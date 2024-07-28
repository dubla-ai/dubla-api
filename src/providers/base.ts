import { Logger } from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axiosRetry from 'axios-retry';

type BaseError = { error: AxiosError; shouldRetry: boolean };

export abstract class BaseProvider {
  protected logger: Logger;
  protected client: AxiosInstance;

  constructor() {
    this.logger = new Logger(BaseProvider.name);
    this.client = this.createClient({
      baseURL: this.getBaseUrl(),
      headers: this.baseHeaders,
      ...this.getAxiosRequestConfig(),
    });
  }

  protected getAxiosRequestConfig(): AxiosRequestConfig {
    return {};
  }

  protected getBaseUrl(): string {
    return '';
  }

  private get axiosRetries() {
    return Number(process.env.AXIOS_RETRY ?? 5);
  }

  protected get baseHeaders() {
    return {};
  }

  private async errorInterceptor(error: AxiosError) {
    if (error.isAxiosError) {
      this.logger.error({
        url: `${error?.config?.method?.toUpperCase()} ${error?.config?.url} - ${
          error.response?.status
        }`,
        message: `Axios Error - ${error.message} - ${this.constructor.name}`,
        response: error.response?.data,
        request: error.request,
      });
    } else {
      this.logger.error({ message: 'Axios unknown error', error });
    }

    const response = await this.processError(error);

    const retryCount = (error?.config?.['axios-retry'] as any)?.retryCount;
    if (retryCount && retryCount >= this.axiosRetries)
      response.shouldRetry = false;

    if (response.shouldRetry) {
      (error as any).shouldRetry = true;
      throw error;
    }

    throw response.error;
  }

  private async retryCondition(
    err: AxiosError & { shouldRetry: boolean },
  ): Promise<boolean> {
    const code = err?.code ?? '';
    if (
      err?.shouldRetry ||
      [
        'ECONNRESET',
        'ECONNREFUSED',
        'ERR_REQUEST_ABORTED',
        'FORCE_RETRY',
      ].includes(code)
    ) {
      this.logger.log('Retrying request');
      return true;
    }
    return false;
  }

  /** Override to handle different errors from your remote */
  protected async processError(error: AxiosError): Promise<BaseError> {
    return { error, shouldRetry: false };
  }

  protected async processResponse(response: AxiosResponse) {
    return response?.data;
  }

  protected createClient(options: AxiosRequestConfig): AxiosInstance {
    const client = axios.create(options);
    client.interceptors.response.use(
      async (response) => {
        this.logger['log'](
          `${response.config.method?.toUpperCase()} ${
            response.config.baseURL
          } ${response.config.url} - ${response.status} - Axios response`,
        );
        return await this.processResponse(response);
      },
      (error) => this.errorInterceptor(error),
    );
    axiosRetry(client, {
      retries: this.axiosRetries,
      retryDelay: this.customExponentialDelay,
      retryCondition: (error) => this.retryCondition(error as any),
      shouldResetTimeout: true,
    });
    return client;
  }

  protected customExponentialDelay(retryCount: number): number {
    if (BaseProvider.isTest) return 0;
    const retryNumber = 3 + retryCount;
    const delay = Math.pow(2, retryNumber) * 100;
    const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay

    return delay + randomSum;
  }

  async downloadFile(url: string, retryCount = 5): Promise<Buffer | string> {
    if (!retryCount) {
      this.logger.error(
        `Error when fetching file, all retries applied and error keeps throwing`,
      );
      return 'No file was uploaded';
    }

    try {
      const response = await axios.get<any, any>(url, {
        headers: {
          Accept: 'application/octet-stream, application/json, text/plain, */*',
        },
        responseType: 'arraybuffer',
        maxContentLength: 10485760, // 10 MB = 10 * 1024 * 1024 bytes
        maxBodyLength: 10485760,
      });

      return response.data;
    } catch (error) {
      const retryCountDecreased = --retryCount;
      this.logger.error({
        message: `Error when fetching file, retrying count: ${retryCountDecreased}`,
        fileUrl: url,
        error,
      });
      return await this.downloadFile(url, retryCountDecreased);
    }
  }

  static get isTest(): boolean {
    return !!(global as any).__TEST__;
  }

  static get isProd(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}

export type MergeAudiosRequest = {
  output_key: string;
  keys: string[];
  type: string;
};

export type MergeAudiosResponse = {
  message: string;
  output_key: string;
};

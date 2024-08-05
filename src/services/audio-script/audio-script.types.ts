export type CreateProjectRequest = {
  name: string;
  description: string;
  is_collaborative?: string;
  is_archived?: string;
};

export type CreateProjectResponse = {
  success: boolean;
  item: {
    uuid: string;
    name: string;
    description: string;
    is_collaborative: string;
    is_archived: boolean;
    created_at: Date;
    updated_at: Date;
  };
};

export type CreateClipRequest = {
  title?: string;
  body: string;
  voice_uuid: string;
  is_archived?: string;
  callback_uri?: string;
  precision?: string;
  sample_rate?: string;
  output_format?: string;
  include_timestamps?: string;
  raw?: string;
  suggestions?: string;
};

export type CreateClipResponse = {
  success: boolean;
  item: {
    uuid: string;
    title: string;
    body: string;
    voice_uuid: string;
    is_archived: boolean;
    timestamps: {
      graph_chars: string[];
      graph_times: number[];
      phon_chars: string[];
      phon_times: number[];
    };
    audio_src: string;
    raw_audio: any;
    created_at: Date;
    updated_at: Date;
  };
};

export type DeleteProjectResponse = {
  success: boolean;
};

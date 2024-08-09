export type CreateProjectRequest = {
  name: string;
  default_title_voice_id: string;
  default_paragraph_voice_id: string;
  default_model_id: string;
  from_url?: string;
  from_document?: string;
  quality_preset?: string;
  title?: string;
  author?: string;
  isbn_number?: string;
  acx_volume_normalization?: boolean;
  volume_normalization?: boolean;
  pronunciation_dictionary_locators?: string[];
  callback_url?: string;
};

export type CreateProjectResponse = {
  project: {
    project_id: string;
    name: string;
    create_date_unix: number;
    default_title_voice_id: string;
    default_paragraph_voice_id: string;
    default_model_id: string;
    last_conversion_date_unix: number;
    can_be_downloaded: boolean;
    title: string;
    author: string;
    isbn_number: string;
    volume_normalization: boolean;
    state: string;
  };
};

export type GetProjectResponse = {
  project_id: string;
  name: string;
  create_date_unix: number;
  default_title_voice_id: string;
  default_paragraph_voice_id: string;
  default_model_id: string;
  last_conversion_date_unix: number;
  can_be_downloaded: boolean;
  state: string;
  chapters: {
    chapter_id: string;
    name: string;
    last_conversion_date_unix: number;
    conversion_progress: number;
    can_be_downloaded: boolean;
    state: string;
    statistics: {
      characters_unconverted: number;
      characters_converted: number;
      paragraphs_converted: number;
      paragraphs_unconverted: number;
    };
  }[];
};

export type TextToSpeechRequest = {
  text: string;
  model_id?: string;
  language_code?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  pronunciation_dictionary_locators?: {
    pronunciation_dictionary_id: string;
    version_id: string;
  }[];
  seed?: number;
  previous_text?: string;
  next_text?: string;
  previous_request_ids?: string[];
  next_request_ids?: string[];
};

export type TextToSpeechResponse = {
  audio_base64: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
  normalized_alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
};

export type DeleteProjectResponse = {
  success: boolean;
};

export type CreateVoiceRequest = {
  name: string;
  file: Blob;
  description?: string;
  labels?: string;
};

export type CreateVoiceResponse = {
  voice_id: string;
};

export enum OutputType {
  COMMAND,
  RESPONSE,
  ERROR,
  USER_INPUT,
}

export interface HistoryItem {
  type: OutputType;
  content: string;
}

export enum ObjectDetectionMode {
    NONE = 'none',
    PEOPLE = 'people',
    OBJECTS = 'objects',
    BOTH = 'both'
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';
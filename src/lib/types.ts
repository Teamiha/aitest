export interface ResponseItem {
  model: string;
  seedUsed: boolean;
  response: string;
}

export interface HistoryEntry {
  id: string;
  prompt: string;
  temperature: number;
  responses: ResponseItem[];
  timestamp: number;
}

export interface GenerateRequest {
  prompt: string;
  temperature: number;
}

export interface GenerateResponse {
  responses: ResponseItem[];
}

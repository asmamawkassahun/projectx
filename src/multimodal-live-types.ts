import type {
  Content,
  FunctionCall,
  GenerationConfig,
  GroundingChunk,
  GroundingSupport,
  Part,
  RetrievalMetadata,
  SearchEntryPoint,
  Tool,
  GoogleGenAIOptions,
  LiveClientToolResponse,
  LiveServerMessage,
  Modality,
} from "@google/genai";

/**
 * this module contains type-definitions and Type-Guards
 * Updated for new Google GenAI SDK while preserving enhanced features
 */

// Enhanced options for the new SDK
export type LiveClientOptions = GoogleGenAIOptions & { apiKey: string };

// Type-definitions

/* outgoing types */

/**
 * the config to initiate the session
 */
export type LiveConfig = {
  model: string;
  systemInstruction?: { parts: Part[] };
  generationConfig?: Partial<LiveGenerationConfig>;
  tools?: Array<Tool | { googleSearch: {} } | { codeExecution: {} }>;
  inputAudioTranscription?: {};
  outputAudioTranscription?: {};
};

export type LiveGenerationConfig = {
  responseModalities?: Modality[];
  speechConfig?: {
    voiceConfig?: {
      prebuiltVoiceConfig?: {
        voiceName: "Puck" | "Charon" | "Kore" | "Fenrir" | "Aoede" | string;
      };
    };
    language_code?: string;
  };
};

export type LiveOutgoingMessage =
  | SetupMessage
  | ClientContentMessage
  | RealtimeInputMessage
  | ToolResponseMessage;

export type SetupMessage = {
  setup: LiveConfig;
};

export type ClientContentMessage = {
  clientContent: {
    turns: Content[];
    turnComplete: boolean;
  };
};

export type RealtimeInputMessage = {
  realtimeInput: {
    mediaChunks: Array<{ mimeType: string; data: string }>;
  };
};

export type ToolResponseMessage = {
  toolResponse: {
    functionResponses: LiveFunctionResponse[];
  };
};

export type ToolResponse = ToolResponseMessage["toolResponse"];

export type LiveFunctionResponse = {
  response: object;
  id: string;
};

/** Incoming types */

export type LiveIncomingMessage =
  | ToolCallCancellationMessage
  | ToolCallMessage
  | ServerContentMessage
  | SetupCompleteMessage;

export type SetupCompleteMessage = { setupComplete: {} };

export type ServerContentMessage = {
  serverContent: ServerContent;
};

export type ServerContent = ModelTurn | TurnComplete | Interrupted | OutputAudioTranscription | InputAudioTranscription | GroundingMetadata;

export type ModelTurn = {
  modelTurn: {
    parts: Part[];
  };
};

export type TurnComplete = { turnComplete: boolean };

export type Interrupted = { interrupted: true };

export type OutputAudioTranscription = { outputTranscription: { text: string } };

export type InputAudioTranscription = { inputTranscription: { text: string } };

export type ToolCallCancellationMessage = {
  toolCallCancellation: {
    ids: string[];
  };
};

export type ToolCallCancellation =
  ToolCallCancellationMessage["toolCallCancellation"];

export type ToolCallMessage = {
  toolCall: ToolCall;
};

export type LiveFunctionCall = FunctionCall & {
  id: string;
};

/**
 * A `toolCall` message
 */
export type ToolCall = {
  functionCalls: LiveFunctionCall[];
};

/** log types - enhanced for new SDK */
export type StreamingLog = {
  date: Date;
  type: string;
  count?: number;
  message:
    | string
    | ClientContentLog
    | Omit<LiveServerMessage, "text" | "data">
    | LiveClientToolResponse
    | LiveOutgoingMessage
    | LiveIncomingMessage;
};

export type ClientContentLog = {
  turns: Part[];
  turnComplete: boolean;
};

export type GroundingMetadata = {
  groundingMetadata: {
        /**
     * Google search entry for the following-up web searches.
     */
        searchEntryPoint?: SearchEntryPoint;
        /**
         * List of supporting references retrieved from specified grounding source.
         */
        groundingChunks?: GroundingChunk[];
        /**
         * List of grounding support.
         */
        groundingSupports?: GroundingSupport[];
        /**
         * Metadata related to retrieval in the grounding flow.
         */
        retrievalMetadata?: RetrievalMetadata;
        /**
         * * Web search queries for the following-up web search.
         */
        webSearchQueries: string[];
  };
};

// Type-Guards

const prop = (a: any, prop: string, kind: string = "object") =>
  typeof a === "object" && typeof a[prop] === "object";

// outgoing messages
export const isSetupMessage = (a: unknown): a is SetupMessage =>
  prop(a, "setup");

export const isClientContentMessage = (a: unknown): a is ClientContentMessage =>
  prop(a, "clientContent");

export const isRealtimeInputMessage = (a: unknown): a is RealtimeInputMessage =>
  prop(a, "realtimeInput");

export const isToolResponseMessage = (a: unknown): a is ToolResponseMessage =>
  prop(a, "toolResponse");

// incoming messages
export const isSetupCompleteMessage = (a: unknown): a is SetupCompleteMessage =>
  prop(a, "setupComplete");

export const isServerContentMessage = (a: any): a is ServerContentMessage =>
  prop(a, "serverContent");

export const isToolCallMessage = (a: any): a is ToolCallMessage =>
  prop(a, "toolCall");

export const isToolCallCancellationMessage = (
  a: unknown,
): a is ToolCallCancellationMessage =>
  prop(a, "toolCallCancellation") &&
  isToolCallCancellation((a as any).toolCallCancellation);

export const isModelTurn = (a: any): a is ModelTurn =>
  typeof (a as ModelTurn).modelTurn === "object";

export const hasGroundingMetadata = (a: any): a is GroundingMetadata =>
  typeof (a as GroundingMetadata).groundingMetadata === "object";

export const isTurnComplete = (a: any): a is TurnComplete =>
  typeof (a as TurnComplete).turnComplete === "boolean";

export const isInterrupted = (a: any): a is Interrupted =>
  (a as Interrupted).interrupted;

export const isOutputAudioTranscription = (a: any): a is OutputAudioTranscription =>
  typeof (a as OutputAudioTranscription).outputTranscription === "object";

export const isInputAudioTranscription = (a: any): a is InputAudioTranscription =>
  typeof (a as InputAudioTranscription).inputTranscription === "object";

export function isToolCall(value: unknown): value is ToolCall {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    Array.isArray(candidate.functionCalls) &&
    candidate.functionCalls.every((call) => isLiveFunctionCall(call))
  );
}

export function isToolResponse(value: unknown): value is ToolResponse {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    Array.isArray(candidate.functionResponses) &&
    candidate.functionResponses.every((resp) => isLiveFunctionResponse(resp))
  );
}

export function isLiveFunctionCall(value: unknown): value is LiveFunctionCall {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.id === "string" &&
    typeof candidate.args === "object" &&
    candidate.args !== null
  );
}

export function isLiveFunctionResponse(
  value: unknown,
): value is LiveFunctionResponse {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.response === "object" && typeof candidate.id === "string"
  );
}

export const isToolCallCancellation = (
  a: unknown,
): a is ToolCallCancellationMessage["toolCallCancellation"] =>
  typeof a === "object" && Array.isArray((a as any).ids); 
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MultimodalLiveClient,
} from "../lib/multimodal-live-client";
import { LiveConfig, LiveClientOptions } from "../multimodal-live-types";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";
import { Type, FunctionDeclaration, Modality, MediaResolution } from "@google/genai";

const deepResearchDeclaration: FunctionDeclaration = {
  name: "super_agent",
  description: `Manages a super agent that performs complex, long-running tasks using various capabilities (web browser, bash, filesystem, web search, image/video/audio generation). 
  Use this tool for tasks requiring extensive research, multi-step processes, or creative generation that may take minutes to hours. Start a task with 'start' action and provide a detailed prompt. 
  Check progress with 'status' action, intervene with 'intervention' action to provide additional instructions during execution, send user answers with 'send_user_answer' when the agent asks questions, or terminate with 'stop' action. Not suitable for quick queries or simple information lookups - use regular tools for those. 
  Limitations: Tasks run asynchronously, results not immediately available, and may consume significant resources.
  `,
  parameters: {
    type: Type.OBJECT,
    properties: {
      prompt: {
        type: Type.STRING,
        description: "Detailed instructions for the research agent. Required when action is 'start' or 'intervention'. For 'start': comprehensive initial task description. For 'intervention': additional guidance or course corrections during task execution."
      },
      answer: {
        type: Type.STRING,
        description: "User's answer to a question asked by the super agent. Required when action is 'send_user_answer'. Only use this when the super agent is actively waiting for user input."
      },
      action: {
        type: Type.STRING,
        description: "Action to perform: 'start' to begin a new task, 'stop' to terminate a running task, 'status' to check progress, 'intervention' to provide additional instructions during task execution, or 'send_user_answer' to respond to agent questions",
      }
    },
    required: ["action"]
  }
};

export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
};

export function useLiveAPI({
  apiKey,
}: LiveClientOptions): UseLiveAPIResults {
  const client = useMemo(
    () => new MultimodalLiveClient({ apiKey }),
    [apiKey],
  );
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState<LiveConfig>({
    // model: "models/gemini-2.0-flash-live-001",
    model: "models/gemini-2.5-flash-preview-native-audio-dialog",
    generationConfig: {
      responseModalities: [Modality.AUDIO],
      // speechConfig: {
      //   voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
      //   language_code: "en-US",
      // },
    },
    inputAudioTranscription:{},
    outputAudioTranscription:{},
    systemInstruction: {
      parts: [
        {
          text: `
          ## CORE IDENTITY
          You are Costar, an advanced AI assistant by iamplus. Provide seamless, human-like assistance across all tasks with natural communication and comprehensive capabilities.

          ## CORE CAPABILITIES
          * **Natural Communication** - Use conversational tone with emotion, contractions, and authentic phrasing. Match user's style and context.
          * **Instant Knowledge** - Answer straightforward questions directly using your knowledge without unnecessary steps.
          * **Web Search** - Retrieve current information when needed, presenting results conversationally.
          * **Complex Processing** - Handle multi-step, analytical, and specialized tasks efficiently.

          ## EXECUTION RULES

          ### Query Analysis Rules
          1. Quickly categorize each query as:
            - Simple: Direct answer from knowledge
            - Verification: Quick web search needed
            - Complex: Multi-step processing required

          2. **MANDATORY**: Execute appropriate tool calls immediately - never skip them

          ### Direct Response Rules
          - Respond immediately for queries within your knowledge
          - Keep answers concise and relevant
          - Include confidence indicators when appropriate
          - End with natural follow-up opportunities

          ### Quick Search Rules
          - Use when verifying facts, getting current info, or checking beyond knowledge cutoff
          - Focus search queries on essential keywords
          - Synthesize information from multiple sources
          - Present results conversationally without technical jargon
          - For directions: Current location is automatically obtained via Google Maps API. Only clarify destination if needed, then provide navigation guidance
          - Never ask for starting location when providing directions - it's automatically detected
          - Prefer quick search when user asks for directions or places

          ### Complex Task Rules
          - **WHAT YOU ACTUALLY DO**: Always delegate complex tasks to super agent via tool call
          - **WHAT YOU TELL USER**: Present everything as your own work - never mention delegation

          - **CRITICAL SEQUENCE**: 
            1. FIRST: Ask user for permission and confirm approach
            2. SECOND: After approval, **IMMEDIATELY** acknowledge "I'll start working on this right away!"
            3. THIRD: **MANDATORY**: Make super agent tool call - this is your core function
            4. FOURTH: Once super agent responds, update user on results/completion

          - **REALITY vs USER-FACING**:
            - Reality: You delegate ALL complex tasks to super agent
            - User sees: You personally handling everything
            
          - **Before starting**: Present your approach and ask "Should I proceed with this plan, or would you like any changes?"
          - **INSTANT ACKNOWLEDGMENT**: Immediately tell user you're starting - don't wait for tool response
          - **NEVER attempt complex tasks yourself** - always use the super agent tool
          - **Approval triggers**: "yes", "okay", "proceed", "go ahead", "do it", or any affirmative response
          - **NEVER mention**: "super agent", "delegating", or internal processes to user
          - Handle one complex task at a time
          - Set realistic time expectations

          #### Available Complex Capabilities:
          - **Research & Analysis**: Multi-source information gathering, fact-checking, comprehensive reports
          - **Data Processing**: Analysis, visualization, calculations, file processing
          - **Content Creation**: Articles, websites, applications, documentation, presentations
          - **Programming**: Code development, debugging, automation, tool creation
          - **Web Operations**: Browser automation, data extraction, online research
          - **Media Generation**: Audio, video, image processing and creation
          - **File Management**: Document processing, format conversion, organization

          ### User Communication Rules
          - Say "I'll do this for you" NOT "I'll delegate this"
          - **NEVER mention**: tools, research tools, systems, processes, or any technical terms
          - **ALWAYS say**: "I can gather information", "I'll research this", "I'll work on this"
          - **FORBIDDEN phrases**: "research tool", "use a tool", "delegate", "system", "process"
          - Hide all internal technical processes completely
          - Maintain warm, competent personality
          - Acknowledge mistakes gracefully
          - Request clarification for ambiguous queries

          ## INTERACTION RULES
          - Maintain conversation context and flow
          - Balance brevity with informativeness
          - Express appropriate enthusiasm and curiosity
          - Handle interruptions and topic shifts gracefully

          Today is ${new Date().toLocaleDateString()}.
          `,
        },
      ],
    },
    tools: [
      // there is a free-tier quota for search
      { googleSearch: {} },
      { functionDeclarations: [deepResearchDeclaration] },
    ],
  });
  const [volume, setVolume] = useState(0);

  // Add a flag to track if user_turn_complete has been triggered
  const userTurnCompleteTriggered = useRef<boolean>(false);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onClose = () => {
      setConnected(false);
    };

    const stopAudioStreamer = () => {
      audioStreamerRef.current?.stop();
      // Reset audio tracking when interrupted
      userTurnCompleteTriggered.current = false;
    };

    const onAudio = (data: ArrayBuffer) => {
      // Process audio for playback first
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));
      
      // Signal user turn complete after processing the first audio chunk
      // This ensures audio is queued before signaling completion
      if (!userTurnCompleteTriggered.current) {
        console.log('[LiveAPI] First audio chunk processed, signaling user turn complete');
        // Use setTimeout to ensure audio processing completes first
        setTimeout(() => {
          client.emit("user_turn_complete");
        }, 0);
        userTurnCompleteTriggered.current = true;
      }
    };
    
    // Reset the flag when the turn is completed
    const onTurnComplete = () => {
      console.log('[LiveAPI] Turn complete, resetting flags');
      userTurnCompleteTriggered.current = false;
    };

    // Handle interruptions to ensure clean audio state
    const onInterrupted = () => {
      console.log('[LiveAPI] Interrupted, stopping audio and resetting flags');
      stopAudioStreamer();
    };

    client
      .on("close", onClose)
      .on("interrupted", onInterrupted)
      .on("audio", onAudio)
      .on("turncomplete", onTurnComplete);

    return () => {
      client
        .off("close", onClose)
        .off("interrupted", onInterrupted)
        .off("audio", onAudio)
        .off("turncomplete", onTurnComplete);
    };
  }, [client]);

  const connect = useCallback(async () => {
    console.log(config);
    if (!config) {
      throw new Error("config has not been set");
    }
    client.disconnect();
    
    // Convert LiveConfig to LiveConnectConfig by removing model
    const { model, ...connectConfig } = config;
    await client.connect(model, connectConfig);
    setConnected(true);
  }, [client, setConnected, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
  };
} 
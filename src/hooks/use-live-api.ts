import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultimodalLiveClient } from "../lib/multimodal-live-client";
import { LiveConfig, LiveClientOptions } from "../multimodal-live-types";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";
import {
  Type,
  FunctionDeclaration,
  Modality,
  MediaResolution,
} from "@google/genai";

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
        description:
          "Detailed instructions for the research agent. Required when action is 'start' or 'intervention'. For 'start': comprehensive initial task description. For 'intervention': additional guidance or course corrections during task execution.",
      },
      answer: {
        type: Type.STRING,
        description:
          "User's answer to a question asked by the super agent. Required when action is 'send_user_answer'. Only use this when the super agent is actively waiting for user input.",
      },
      action: {
        type: Type.STRING,
        description:
          "Action to perform: 'start' to begin a new task, 'stop' to terminate a running task, 'status' to check progress, 'intervention' to provide additional instructions during task execution, or 'send_user_answer' to respond to agent questions",
      },
    },
    required: ["action"],
  },
};

// Email function declarations
const listEmailsDeclaration: FunctionDeclaration = {
  name: "list_emails",
  description: "List emails based on a Gmail search query.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "A valid Gmail search query."
      },
      max_results: {
        type: Type.NUMBER,
        description: "The maximum number of emails to return. Default is 10."
      }
    },
    required: ["query", "max_results"]
  }
};

const summarizeEmailsDeclaration: FunctionDeclaration = {
  name: "summarize_emails",
  description: "Summarize emails based on a Gmail search query. Only use when explicitly asked for a summary.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "A valid Gmail search query."
      }
    },
    required: ["query"]
  }
};

const writeDraftNewEmailDeclaration: FunctionDeclaration = {
  name: "write_draft_for_new_email",
  description: "Write a new email draft.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      to: {
        type: Type.STRING,
        description: "The recipient's email address."
      },
      subject: {
        type: Type.STRING,
        description: "The subject of the email."
      },
      body: {
        type: Type.STRING,
        description: "The body content of the email."
      }
    },
    required: ["to", "subject", "body"]
  }
};

const writeDraftReplyDeclaration: FunctionDeclaration = {
  name: "write_draft_for_reply",
  description: "Write a reply to an email. Use message_id if available, otherwise use a query to find the email.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      message_id: {
        type: Type.STRING,
        description: "The ID of the message to reply to."
      },
      query: {
        type: Type.STRING,
        description: "A query to find the email to reply to if the ID is not known."
      },
      body: {
        type: Type.STRING,
        description: "The body content of the reply."
      },
      to: {
        type: Type.STRING,
        description: "Optional: The recipient's email address if it needs to be changed."
      },
      subject: {
        type: Type.STRING,
        description: "Optional: The subject of the email if it needs to be changed."
      }
    },
    required: ["body"]
  }
};

const sendEmailDeclaration: FunctionDeclaration = {
  name: "send_email",
  description: "Send a previously approved email draft.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      to: {
        type: Type.STRING,
        description: "The recipient's email address."
      },
      subject: {
        type: Type.STRING,
        description: "The subject of the email."
      },
      body: {
        type: Type.STRING,
        description: "The body content of the email."
      }
    },
    required: ["to", "subject", "body"]
  }
};

const coordinateMeetingDeclaration: FunctionDeclaration = {
  name: "coordinate_meeting",
  description: "Initiate a meeting coordination process with one or more recipients.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      recipient_emails: {
        type: Type.ARRAY,
        description: "The email addresses of the meeting recipients.",
        items: {
          type: Type.STRING
        }
      },
      purpose: {
        type: Type.STRING,
        description: "The purpose or topic of the meeting."
      }
    },
    required: ["recipient_emails", "purpose"]
  }
};

// Calendar function declarations
const listEventsDeclaration: FunctionDeclaration = {
  name: "list_events",
  description: "List calendar events for a given time range. Only use when explicitly asked to see calendar or schedule.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      time_min: {
        type: Type.STRING,
        description: "The start of the time range in ISO-8601 format."
      },
      time_max: {
        type: Type.STRING,
        description: "The end of the time range in ISO-8601 format."
      }
    }
  }
};

const checkAvailabilityDeclaration: FunctionDeclaration = {
  name: "check_availability",
  description: "Check if the user is free at a certain time or date.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "A natural language query about availability (e.g., 'tomorrow afternoon')."
      },
      time_min: {
        type: Type.STRING,
        description: "The start of the time range in ISO-8601 format."
      },
      time_max: {
        type: Type.STRING,
        description: "The end of the time range in ISO-8601 format."
      }
    }
  }
};

const createEventDeclaration: FunctionDeclaration = {
  name: "create_event",
  description: "Create a new event in the calendar.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "The title or summary of the event."
      },
      start_time: {
        type: Type.STRING,
        description: "The event start time in ISO-8601 format."
      },
      end_time: {
        type: Type.STRING,
        description: "The event end time in ISO-8601 format."
      },
      location: {
        type: Type.STRING,
        description: "The location of the event."
      },
      attendees: {
        type: Type.ARRAY,
        description: "The email addresses of the event attendees.",
        items: {
          type: Type.STRING
        }
      }
    },
    required: ["summary", "start_time", "end_time"]
  }
};

const updateEventDeclaration: FunctionDeclaration = {
  name: "update_event",
  description: "Update an existing calendar event. First find the event ID with list_events.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      event_id: {
        type: Type.STRING,
        description: "The ID of the event to update."
      },
      summary: {
        type: Type.STRING,
        description: "The new title or summary of the event."
      },
      start_time: {
        type: Type.STRING,
        description: "The new event start time in ISO-8601 format."
      },
      end_time: {
        type: Type.STRING,
        description: "The new event end time in ISO-8601 format."
      },
      location: {
        type: Type.STRING,
        description: "The new location of the event."
      },
      attendees: {
        type: Type.ARRAY,
        description: "The new list of email addresses for event attendees.",
        items: {
          type: Type.STRING
        }
      }
    },
    required: ["event_id"]
  }
};

const deleteEventDeclaration: FunctionDeclaration = {
  name: "delete_event",
  description: "Delete an event from the calendar.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      event_id: {
        type: Type.STRING,
        description: "The ID of the event to delete."
      }
    },
    required: ["event_id"]
  }
};

// Contact function declarations
const findContactDeclaration: FunctionDeclaration = {
  name: "find_contact",
  description: "Find a contact's email address by their name.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "The name of the contact to find."
      }
    },
    required: ["query"]
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

export function useLiveAPI({ apiKey }: LiveClientOptions): UseLiveAPIResults {
  const client = useMemo(() => new MultimodalLiveClient({ apiKey }), [apiKey]);

  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const [config, setConfig] = useState<LiveConfig>({
    model: "models/gemini-live-2.5-flash-preview",
    // model: "models/gemini-2.5-flash-preview-native-audio-dialog",
    generationConfig: {
      responseModalities: [Modality.AUDIO],
      // speechConfig: {
      //   voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
      //   language_code: "en-US",
      // },
    },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
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
          * **Email Management** - List, summarize, draft, send emails and coordinate meetings through Gmail integration.
          * **Calendar Management** - Check availability, list events, create/update/delete calendar events.
          * **Contact Management** - Find contact information by name.

          ## EXECUTION RULES

          ### Query Analysis Rules
          1. Quickly categorize each query as:
            - Simple: Direct answer from knowledge
            - Verification: Quick web search needed
            - Complex: Multi-step processing required
            - Email/Calendar/Contact: Use specific productivity tools

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

          ### Email Management Rules
          - Use list_emails for finding specific emails or browsing email content
          - Use summarize_emails when user explicitly requests email summaries
          - Use write_draft_for_new_email for composing new emails
          - Use write_draft_for_reply when responding to existing emails
          - Use send_email only after user confirms the draft
          - Use coordinate_meeting for scheduling meetings with multiple people
          - Always confirm before sending emails

          ### Calendar Management Rules
          - Use list_events when user asks to see their schedule or calendar
          - Use check_availability to verify free time slots
          - Use create_event for new calendar entries
          - Use update_event to modify existing events (get event_id first with list_events)
          - Use delete_event to remove calendar entries
          - Always confirm event details before creating/updating

          ### Contact Management Rules
          - Use find_contact to locate email addresses by name
          - Helpful for email composition and meeting coordination

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
          - When using productivity tools (email, calendar, contacts), provide clear confirmations and summaries
          - For mobile automation, explain what's happening in simple terms

          Today is ${new Date().toLocaleDateString()}.
          `,
        },
      ],
    },
    tools: [
      // there is a free-tier quota for search
      { googleSearch: {} },
      { 
        functionDeclarations: [
          deepResearchDeclaration,
          // Email tools
          listEmailsDeclaration,
          summarizeEmailsDeclaration,
          writeDraftNewEmailDeclaration,
          writeDraftReplyDeclaration,
          sendEmailDeclaration,
          coordinateMeetingDeclaration,
          // Calendar tools
          listEventsDeclaration,
          checkAvailabilityDeclaration,
          createEventDeclaration,
          updateEventDeclaration,
          deleteEventDeclaration,
          // Contact tools
          findContactDeclaration,
        ] 
      },
    ],
  });

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

  // Enhanced event handlers for real-time UI generation
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
        console.log(
          "[LiveAPI] First audio chunk processed, signaling user turn complete"
        );
        // Use setTimeout to ensure audio processing completes first
        setTimeout(() => {
          client.emit("user_turn_complete");
        }, 0);
        userTurnCompleteTriggered.current = true;
      }
    };

    // Reset the flag when the turn is completed
    const onTurnComplete = () => {
      console.log("[LiveAPI] Turn complete, resetting flags");
      userTurnCompleteTriggered.current = false;
    };

    // Handle interruptions to ensure clean audio state
    const onInterrupted = () => {
      console.log("[LiveAPI] Interrupted, stopping audio and resetting flags");
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

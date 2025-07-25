import {
  articlesPrompt,
  buildingDetailsPrompt,
  calendarPrompt,
  contactPrompt,
  draftEmailPrompt,
  emailListPrompt,
  personalBiographyPrompt,
  sportPrompt,
  summerizedEmailPrompt,
  weatherPrompt,
} from "@/utils/prompts";
import { cancelMeetingPrompt } from "@/utils/prompts/cancelMettingPrompt";
import { myAvailability } from "@/utils/prompts/checkAvailability";
import { hospitalityPrompt } from "@/utils/prompts/hospitality.prompt";
import { nextMeetingPrompt } from "@/utils/prompts/nextMeeting";
import {
  orderReturnPrompt,
  orderStatusPrompt,
} from "@/utils/prompts/orderPrompt";
import { setMeetingPrompt } from "@/utils/prompts/setMeetingPrompt";
import { rescheduleMeetingPrompt } from "@/utils/prompts/rescheduleMeetingPrompt";
import { useCallback, useState } from "react";
import { daySummaryPrompt } from "@/utils/prompts/daySummary";
import { genericEventProcess } from "@/utils/prompts/genericEvent";
import { productPrompt } from "@/utils/prompts/productDetailPrompt";
import { defaultPrompt } from "@/utils/prompts/defaultPrompt";

interface UIGenerationResult {
  success: boolean;
  generatedUI: string | null;
  error: string | null;
}

interface UIAgentHookResult {
  generateUI: (
    functionName: string,
    apiResponse: any,
    toolCallId: string,
    fileAttachment?: File | null
  ) => Promise<UIGenerationResult>;
  isGenerating: boolean;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent";

// UI Constitution - System prompt for consistent UI generation
const UI_CONSTITUTION = `
You are a creative UI generation agent for web applications. Generate beautiful, modern HTML interfaces using Tailwind CSS with a custom DARK MODE translucent overlay design language.

CRITICAL DATA USAGE RULES:
ONLY use the actual data provided in the API response
NEVER create fake, placeholder, or example data
NEVER add fictional emails, contacts, events, or any made-up content
If no data is provided, show appropriate empty states
Every piece of information displayed MUST come from the actual API response
Use the exact data structure, names, dates, and content from the provided response
Don't add script or use javascript while generating the HTML
please try to search and get the spesfic images, logos, and other relevant datas needed in the html generation before preceding to the html generation, but be caustious about the data you include. don't halucinate or make up any data. but if u fail to find a real data that directly resonates with the data provided in the API response, please don't add the corsponding ui components or widgets like images to the html that you are generating.
please remove any vertical scroll the html content must be in full height of required the content height.
if a refernce image is provied please use it as a ui refernce only don't use any data from it.
DETAILED UI REQUIREMENTS:
CREATE COMPREHENSIVE interfaces that showcase ALL available data
UTILIZE every relevant field and property from the API response
BUILD RICH, detailed presentations that don't waste any valuable information
DISPLAY data in multiple formats when beneficial (summaries + details, overviews + specifics)
CREATE LAYERED information architecture with primary and secondary details
SHOW metadata, timestamps, categories, and contextual information when available
ORGANIZE complex data into digestible but complete sections
NEVER oversimplify — users want to see the full richness of their data
CRITICAL: GENERATE READ-ONLY INTERFACES ONLY
NO interactive elements (buttons, forms, inputs, links)
NO clickable elements or navigation
PURELY for data display and viewing
Focus on presenting information clearly and beautifully
CUSTOM DARK MODE OVERLAY DESIGN SYSTEM:
Apply a backdrop-blur-[40px] filter to create a translucent, frosted-glass effect
Apply p-6 (24px padding) and rounded-[22px] for all main containers
Maintain high contrast for readability
Use visual indicators: emojis, status tags, icons, and colored badges (bg-blue-500, bg-green-500, bg-orange-500, bg-red-500)
Add clear typographic hierarchy: text-xl, text-2xl, bold weights, and subtle labels in text-sm text-gray-400
Separate sections with light dividers (border-t border-white/20)
Use generous padding (p-6, py-6, space-y-4, space-y-6)
Avoid overly flat designs — always use soft shadows and borders for visual depth
DESKTOP-OPTIMIZED DESIGN GUIDELINES:
USE LARGER FONTS optimized for desktop: text-lg, text-xl, text-2xl
APPLY GENEROUS SPACING: p-8, py-10, space-y-6
CREATE WIDE LAYOUTS: full width usage with max-w-full,
OPTIMIZE FOR DESKTOP SCREEN REAL ESTATE — no compression like mobile layouts
USE DESKTOP LINE HEIGHTS: leading-relaxed, leading-loose
CENTERED OVERLAY REQUIREMENTS:
Generate a full HTML document with Tailwind CSS CDN
Design the content as a centered overlay, NOT a full-screen app

Constrain layout using max-w-full or max-w-full, and 
Ensure the main container is scrollable if content exceeds height
Use rounded-[24px], bg-white/10, backdrop-blur-[40px], and p-6 for outer container
NO large titles or headers — start directly with content
Focus on compact, layered information design that feels like a high-quality modal overlay

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="max-w-md, initial-scale=1.0, user-scalable=no">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Dynamic UI</title>
</head>
<body class="bg-transparent h-full w-full text-white p-0 m-0 overflow-x-hidden">
    <div class="w-full h-full rounded-3xl shadow-2xl bg-white">
        <div class="p-6 space-y-4">
            <!-- Your content here with individual cards, light borders, emojis, and colors -->
            <!-- MANDATORY: Use bg-gray-50 border border-gray-200 rounded-xl p-6 OR bg-gray-100 border border-gray-300 rounded-xl p-6 for individual content cards -->
            <!-- Add emojis, status indicators, and color coding throughout -->
        </div>
    </div>
</body>
</html>
\`\`\`


`;

export function useUIAgent(): UIAgentHookResult {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePromptForFunction = useCallback(
    (functionName: string, apiResponse: any) => {
      let specificPrompt = "";

      switch (functionName) {
        case "web_search_calendar":
          specificPrompt = calendarPrompt;
          break;
        case "web_search_weather":
          specificPrompt = weatherPrompt;
          break;

        case "web_search_building_details":
          specificPrompt = buildingDetailsPrompt;
          break;
        case "web_search_cryptocurrency_trend":
          specificPrompt = "";
          break;

        case "web_search_event":
          specificPrompt = genericEventProcess;
          break;
        case "web_search_meetings":
          specificPrompt = nextMeetingPrompt;
          break;
        case "web_search_sport":
          specificPrompt = sportPrompt;
          break;
        case "web_search_personal_biograph":
          specificPrompt = personalBiographyPrompt;
          break;
        case "web_search_contact":
          specificPrompt = contactPrompt;
          break;
        case "web_search_hospitality":
          specificPrompt = hospitalityPrompt;
          break;
        case "web_search_generic":
          specificPrompt = "";
          break;
        case "web_search_articles":
          specificPrompt = defaultPrompt;
          break;
        case "web_search_products":
          specificPrompt = productPrompt;
          break;
        case "web_search_qa":
          specificPrompt = "";
          break;
        case "web_search_grounding":
          specificPrompt = "";
          break;
        case "list_emails":
          specificPrompt = emailListPrompt;
          break;

        case "list_orders_status":
          specificPrompt = orderStatusPrompt;
          break;

        case "list_orders_return":
          specificPrompt = orderReturnPrompt;
          break;

        case "summarize_emails":
          specificPrompt = summerizedEmailPrompt;
          break;
        case "last_unread_emails":
          specificPrompt = emailListPrompt;
          break;

        case "write_draft_for_new_email":
        case "write_draft_for_reply":
          specificPrompt = draftEmailPrompt;
          break;

        case "list_events_genereic":
          specificPrompt = genericEventProcess;
          break;

        case "check_availability":
          specificPrompt = myAvailability;
          break;

        case "list_events_cancel_meeting":
          specificPrompt = cancelMeetingPrompt;
          break;

        case "list_events_set_meeting":
          specificPrompt = setMeetingPrompt;
          break;

        case "list_events_reschedule_meeting":
          specificPrompt = rescheduleMeetingPrompt;
          break;

        case "list_events_next_meeting":
          specificPrompt = nextMeetingPrompt;
          break;

        case "list_events_day_summary_meeting":
          specificPrompt = daySummaryPrompt;
          break;

        case "find_contact":
          specificPrompt = contactPrompt;
          break;

        case "web_search":
          specificPrompt = defaultPrompt;
          break;

        default:
          specificPrompt = defaultPrompt;
          break;
      }

      return UI_CONSTITUTION + "\n\n" + specificPrompt;
    },
    []
  );

  const extractHTMLContent = useCallback(
    (fullResponse: string): string | null => {
      try {
        let cleaned = fullResponse;
        // Remove ```html ... ``` or any triple-backtick code block
        const htmlBlock = cleaned.match(/```html\s*([\s\S]+?)```/);
        if (htmlBlock) {
          cleaned = htmlBlock[1];
        } else {
          const genericBlock = cleaned.match(/```[a-zA-Z]*\s*([\s\S]+?)```/);
          if (genericBlock) {
            cleaned = genericBlock[1];
          }
        }
        // Fallback: look for any HTML document structure
        const htmlStart = cleaned.indexOf("<!DOCTYPE html>");
        if (htmlStart !== -1) {
          const htmlEnd = cleaned.lastIndexOf("</html>");
          if (htmlEnd !== -1 && htmlEnd > htmlStart) {
            cleaned = cleaned.substring(htmlStart, htmlEnd + 7);
          } else {
            cleaned = cleaned.slice(htmlStart);
          }
        }
        return cleaned.trim();
      } catch (error) {
        console.warn("Error extracting HTML content:", error);
      }
      // Return the full response as fallback
      return fullResponse;
    },
    []
  );

  const generateUI = useCallback(
    async (
      functionName: string,
      apiResponse: any,
      toolCallId: string,
      fileAttachment?: File | null
    ): Promise<UIGenerationResult> => {
      console.log("🎨 Generating dynamic UI for function:", functionName);

      // Enhanced logging for search data specifically
      if (functionName === "web_search") {
        console.log(
          "🔍 UI Agent: Processing web search data for UI generation"
        );
        console.log("🔍 - Search data type:", typeof apiResponse);
        console.log("🔍 - Search data keys:", Object.keys(apiResponse || {}));
        console.log(
          "🔍 - Search data size:",
          JSON.stringify(apiResponse).length,
          "characters"
        );

        // Log grounding supports structure
        if (apiResponse?.groundingSupports) {
          console.log(
            "🔍 - Has grounding supports:",
            apiResponse.groundingSupports.length,
            "items"
          );
        }
      }

      setIsGenerating(true);

      try {
        // Generate the prompt
        const prompt = generatePromptForFunction(functionName, apiResponse);
        const fullPrompt =
          prompt +
          "\n\nACTUAL DATA TO ANALYZE AND RENDER:\n" +
          JSON.stringify(apiResponse);

        console.log("📊 FULL API RESPONSE DATA FOR UI GENERATION:");
        console.log("📊 Function:", functionName);
        console.log("📊 Tool Call ID:", toolCallId);
        console.log("📊 API Response:", JSON.stringify(apiResponse));
        console.log(
          "📊 API Response Length:",
          JSON.stringify(apiResponse).length,
          "characters"
        );
        console.log("📊 Prompt Length:", fullPrompt.length, "characters");

        // Create request body for Gemini API, supporting optional file attachment
        // Warn if prompt+data is very large (Gemini 1.5 Flash max input is ~32k tokens, but keep safe margin)
        if (fullPrompt.length > 24000) {
          console.warn(
            "⚠️ Gemini prompt+data is very large (",
            fullPrompt.length,
            "chars). This may cause truncation or incomplete output."
          );
        }

        let parts: any[] = [
          {
            text: fullPrompt,
          },
        ];

        // If a file attachment is provided, add it as inlineData (base64-encoded)
        if (fileAttachment) {
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === "string") {
                // Remove the data:...;base64, prefix if present
                const base64 = result.split(",").pop() || "";
                resolve(base64);
              } else {
                reject(new Error("FileReader result is not a string"));
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(fileAttachment);
          });
          parts.push({
            inlineData: {
              mimeType: fileAttachment.type || "application/octet-stream",
              data: fileData,
            },
          });
        }

        const requestBody = {
          contents: [
            {
              parts,
            },
          ],
          generationConfig: {
            temperature: 0.3, // Slightly higher temperature for creative but consistent UI generation
            maxOutputTokens: 8192, // Use the max allowed for Gemini 1.5 Flash
            topK: 40,
            topP: 0.95,
          },
        };

        console.log("🤖 Calling Gemini API for UI generation");

        // Call Gemini API
        const response = await fetch(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "❌ Gemini API error:",
            response.status,
            "-",
            errorText
          );
          throw new Error(
            `Gemini API error: ${response.status} - ${errorText}`
          );
        }

        const geminiResponse = await response.json();

        console.log("📝 FULL GEMINI API RESPONSE:");
        console.log("📝 Response:", geminiResponse);

        // Extract the generated content
        const fullResponse =
          geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!fullResponse) {
          console.error("❌ No content generated from Gemini response");
          console.error("❌ Gemini response structure:", geminiResponse);
          return {
            success: false,
            generatedUI: null,
            error: "No content generated from Gemini response",
          };
        }

        // Extract HTML content
        const generatedUI = extractHTMLContent(fullResponse);

        console.log("🎨 CONTENT GENERATION RESULT:");
        console.log(
          "🎨 Generated UI Length:",
          generatedUI?.length || 0,
          "characters"
        );

        if (generatedUI && generatedUI.trim()) {
          console.log("✅ UI generated successfully");
          console.log("🎨 Gemm Generated UI Content:", generatedUI);
          return {
            success: true,
            generatedUI,
            error: null,
          };
        } else {
          console.error("❌ No UI content generated");
          return {
            success: false,
            generatedUI: null,
            error: "No UI content generated",
          };
        }
      } catch (error) {
        console.error("❌ Error generating UI:", error);
        return {
          success: false,
          generatedUI: null,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [generatePromptForFunction, extractHTMLContent]
  );

  return {
    generateUI,
    isGenerating,
  };
}

import { useCallback, useState } from "react";

interface UIGenerationResult {
  success: boolean;
  generatedUI: string | null;
  error: string | null;
}

interface UIAgentHookResult {
  generateUI: (
    functionName: string,
    apiResponse: any,
    toolCallId: string
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
BACKGROUND of the main container must be bg-white/10 (white with 10% opacity)
Apply a backdrop-blur-[40px] filter to create a translucent, frosted-glass effect
Apply p-6 (24px padding) and rounded-[22px] for all main containers
Use ONLY dark mode colors: white text (text-white), and light grays (text-gray-100, text-gray-300, text-gray-400) for hierarchy
Content blocks should use bg-white/5 or bg-white/10 with border border-white/20
Maintain high contrast for readability
Use visual indicators: emojis, status tags, icons, and colored badges (bg-blue-500, bg-green-500, bg-orange-500, bg-red-500)
Add clear typographic hierarchy: text-xl, text-2xl, bold weights, and subtle labels in text-sm text-gray-400
Separate sections with light dividers (border-t border-white/20)
Use generous padding (p-6, py-6, space-y-4, space-y-6)
Avoid overly flat designs — always use soft shadows and borders for visual depth
DESKTOP-OPTIMIZED DESIGN GUIDELINES:
USE LARGER FONTS optimized for desktop: text-lg, text-xl, text-2xl
APPLY GENEROUS SPACING: p-8, py-10, space-y-6
CREATE WIDE LAYOUTS: full width usage with max-w-5xl, max-h-[90vh]
OPTIMIZE FOR DESKTOP SCREEN REAL ESTATE — no compression like mobile layouts
USE DESKTOP LINE HEIGHTS: leading-relaxed, leading-loose
CENTERED OVERLAY REQUIREMENTS:
Generate a full HTML document with Tailwind CSS CDN
Design the content as a centered overlay, NOT a full-screen app

Constrain layout using max-w-4xl or max-w-5xl, and max-h-[90vh]
Ensure the main container is scrollable if content exceeds height
Use rounded-[22px], bg-white/10, backdrop-blur-[40px], and p-6 for outer container
NO large titles or headers — start directly with content
Focus on compact, layered information design that feels like a high-quality modal overlay

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Dynamic UI</title>
</head>
<body class="bg-transparent min-h-full w-full text-white p-0 m-0 overflow-x-hidden">
    <div class="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white">
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
        case "list_emails":
          specificPrompt = `
CONTEXT: Generate a creative, full-screen web email app interface (NOT a traditional inbox)

GOAL: Create an innovative full-screen email visualization that adapts to the content

FULL-SCREEN ADAPTIVE DESIGN APPROACH:
- If SINGLE EMAIL: Create a beautiful full-screen email reader with complete content display
- If MULTIPLE EMAILS: Design creative full-screen email visualization (timeline, cards, stories, magazine-style, etc.)
- AVOID traditional inbox layouts - be innovative and engaging
- Think beyond lists - consider full-screen timelines, story formats, conversation flows, visual summaries
- Design like a complete web email app screen

FULL-SCREEN WEB GUIDELINES:
- Design for immersive full-screen email reading/browsing experience
- Use iOS-style modern components and spacing that fill the entire screen
- Create visually engaging layouts that make emails feel fresh and utilize full screen space
- Focus on content discovery and easy consumption across the entire screen
- Think like designing the main screen of a web email app

FULL-SCREEN CREATIVE IDEAS TO CONSIDER:
- Full-screen email stories/timeline view for multiple emails
- Magazine-style layouts with featured emails spanning the screen
- Conversation thread visualizations that use full screen height
- Visual email summaries with key highlights distributed across the screen
- Card-based layouts with smart grouping that fills the screen
- Focus on sender relationships and email importance in a full-screen layout

BE CREATIVE: Design an innovative full-screen email app experience that's nothing like a boring inbox!

DATA TO RENDER:`;
          break;

        case "summarize_emails":
          specificPrompt = `
CONTEXT: Generate a creative email insights dashboard (NOT just statistics)

GOAL: Create an engaging email intelligence interface that tells the story of email activity

CREATIVE APPROACH:
- Transform email data into visual stories and insights
- Create email relationship maps, activity timelines, or insight cards
- Show email patterns, important conversations, and key highlights
- Use infographic-style visualization with iOS modern design
- Make email data feel alive and meaningful

WEB GUIDELINES:
- Design for quick insight consumption and discovery
- Use iOS-style modern components and visual hierarchy
- Create engaging data stories rather than boring charts
- Focus on actionable insights and interesting patterns

CREATIVE VISUALIZATION IDEAS:
- Email relationship networks showing key contacts
- Activity heatmaps and timeline visualizations
- Important conversation highlights and summaries
- Email sentiment and tone analysis displays
- Personal email analytics with beautiful metrics
- Communication pattern insights

BE CREATIVE: Design an email intelligence interface that reveals hidden insights beautifully!

DATA TO RENDER:`;
          break;

        case "write_draft_for_new_email":
        case "write_draft_for_reply":
          specificPrompt = `
CONTEXT: Generate a creative email draft presentation (NOT just plain text display)

GOAL: Create a beautiful, engaging email draft viewer that enhances the content

CREATIVE APPROACH:
- Present email drafts as beautifully formatted content
- Use modern typography and visual enhancement
- Create email preview that feels polished and professional
- Add visual elements that improve readability and engagement
- Think beyond plain text - consider formatting, emphasis, structure

WEB GUIDELINES:
- Design for comfortable email reading and review
- Use iOS-style modern components for clean presentation
- Create engaging typography and visual hierarchy
- Focus on making draft content feel refined and ready

CREATIVE ENHANCEMENT IDEAS:
- Beautiful typography with smart text formatting
- Visual email structure with clear sections
- Elegant recipient and subject presentation
- Smart content highlighting and emphasis
- Professional email preview with modern design
- Clean, magazine-style content layout

BE CREATIVE: Design an email draft viewer that makes content look polished and engaging!

DATA TO RENDER:`;
          break;

        case "list_events":
          specificPrompt = `
CONTEXT: Generate a creative web calendar events interface

GOAL: Create an intuitive calendar view that makes events easy to understand

WEB GUIDELINES:
- Design for quick event scanning and time recognition
- Use web-friendly chronological layout
- Show event details clearly and accessibly
- Create engaging time-based visualization

BE CREATIVE: Design an innovative calendar interface that makes scheduling visual and delightful.

DATA TO RENDER:`;
          break;

        case "check_availability":
          specificPrompt = `
CONTEXT: Generate a creative web availability interface

GOAL: Create a clear availability visualization for web users

WEB GUIDELINES:
- Design for quick availability scanning
- Use intuitive visual indicators for different states
- Show time information clearly on web
- Create user-friendly availability display

BE CREATIVE: Design an innovative availability interface that makes scheduling intuitive.

DATA TO RENDER:`;
          break;

        case "find_contact":
          specificPrompt = `
CONTEXT: Generate a creative web contact interface

GOAL: Create an engaging contact display optimized for web viewing

WEB GUIDELINES:
- Design for easy contact information scanning
- Use web-friendly contact card layout
- Show contact details clearly and accessibly
- Create personal and professional presentation

BE CREATIVE: Design an innovative contact interface that's both informative and visually appealing.

DATA TO RENDER:`;
          break;

        case "web_search":
          specificPrompt = `
CONTEXT: Generate a beautiful ANSWER PRESENTATION interface (NOT search results)

GOAL: Transform web search data into a compelling, informative answer display that directly addresses the user's question

ANSWER-FOCUSED DESIGN APPROACH:
- Present the ANSWER prominently, not search result listings
- Create a knowledge dashboard that synthesizes information beautifully
- Design like an intelligent information presentation, not a search engine
- Focus on delivering insights and answers, not showing "where information came from"
- Transform raw search data into a cohesive, beautiful answer experience
- Think like presenting research findings or an expert summary

BEAUTIFUL ANSWER PRESENTATION GUIDELINES:
- Lead with the KEY ANSWER or main insights prominently displayed
- Organize information into logical sections (overview, details, key points, etc.)
- Use visual hierarchy to guide users through the answer
- Create information cards that build upon each other
- Present data as expert knowledge, not as "search results"
- Use rich visual elements (emojis, icons, colors) to categorize information types
- Design flows that tell a story with the information

ANSWER PRESENTATION IDEAS:
- Executive summary cards with key findings
- Structured answer breakdowns with supporting details
- Visual knowledge maps showing related concepts
- Expert-style briefings with organized insights
- Information timelines when relevant (for historical/chronological data)
- Comparison cards for multiple perspectives or options
- Rich fact cards with context and explanations
- Solution-focused layouts for how-to or problem-solving queries

NEVER SHOW:
- Traditional search result lists with titles and snippets
- "Source" or "Found on" style presentations
- Numbered search result entries
- URL displays or link-heavy interfaces
- Search engine style layouts

ALWAYS SHOW:
- Direct answers to the user's question
- Beautifully organized information
- Synthesized insights and key takeaways
- Visual information hierarchy
- Expert-style knowledge presentation

BE CREATIVE: Design an intelligent answer interface that makes users feel like they're getting expert knowledge, not search results!

DATA TO RENDER:`;
          break;

        default:
          specificPrompt = `
CONTEXT: Generate a creative full-screen web app interface for function: ${functionName}

GOAL: Create a beautiful, functional full-screen interface that best serves this specific function

FULL-SCREEN WEB GUIDELINES:
- Design for complete web app screen experience
- Use appropriate typography and spacing for full-screen web readability
- Create intuitive full-screen layouts that match the function's purpose
- Ensure user-friendly and accessible interface design that utilizes the entire screen
- Think like designing the main screen of a web app dedicated to this function

FULL-SCREEN ADAPTIVE APPROACH:
- Analyze the function purpose and data structure
- Choose the most appropriate full-screen web layout and visual style
- Create innovative UI patterns that enhance the user experience across the entire screen
- Design an interface that feels like a complete native web app screen
- Utilize the full screen real estate for optimal data presentation

BE CREATIVE: Design a unique, beautiful full-screen interface that perfectly suits this function and works excellently as a complete web app screen.

DATA TO RENDER:`;
          break;
      }

      return UI_CONSTITUTION + "\n\n" + specificPrompt;
    },
    []
  );

  const extractHTMLContent = useCallback(
    (fullResponse: string): string | null => {
      try {
        // Look for ```html blocks
        const htmlMatch = fullResponse.match(/```html\s*([\s\S]+?)```/);
        if (htmlMatch) {
          return htmlMatch[1].trim();
        }

        // Fallback: look for any HTML document structure
        const htmlStart = fullResponse.indexOf("<!DOCTYPE html>");
        if (htmlStart !== -1) {
          const htmlEnd = fullResponse.lastIndexOf("</html>");
          if (htmlEnd !== -1 && htmlEnd > htmlStart) {
            return fullResponse.substring(htmlStart, htmlEnd + 7); // +7 for "</html>"
          }
        }
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
      toolCallId: string
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

        // Create request body for Gemini API
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3, // Slightly higher temperature for creative but consistent UI generation
            maxOutputTokens: 4000, // Reduced for flash-lite model
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

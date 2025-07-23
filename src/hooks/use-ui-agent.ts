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
please try to search and get the spesfic images, logos, and other relevant datas needed in the html generation before preceding to the html generation, but be caustious about the data you include. don't halucinate or make up any data.
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
    <meta name="viewport" content="max-w-md, initial-scale=1.0, user-scalable=no">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Dynamic UI</title>
</head>
<body class="bg-transparent min-h-full w-full text-white p-0 m-0 overflow-x-hidden">
    <div class="w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl bg-white">
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
          specificPrompt = `"Create a single HTML page with a dark theme. The page should be centered with a maximum width of 400px suitable for mobile viewing, have overall 1.5rem rounded corners, and a background color of #333333 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Neue Haas Grotesk Display Pro' font, loaded from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, have a minimum height of 100vh, and 1.5rem padding around the main container. The UI should consist of the following components, stacked vertically with 1rem spacing between them. The rendering of certain components should be dynamic, appearing only if the corresponding data is provided.
Dynamic Data Structure:
The page will be driven by a single JavaScript object, daySummaryData, which can contain the following properties:

summaryText: A string for the main summary text at the top (e.g., "You have two meetings and one family event today.").
dateText: A string for the current day and date (e.g., "Thursday, 17 July").
events: An array of event objects. Each event object can contain:
type: (string, e.g., "Meeting", "Family Event").
title: (string, e.g., "Design Workshop").
time: (string, e.g., "5:00 PM").
location: (string, e.g., "Starbucks").
attendees: An optional array of attendee avatar URLs (strings).
extraAttendeesCount: An optional number (e.g., 2 for "+2").
agenda: An optional array of strings, where each string is an agenda item (e.g., ["Go through moodboards", "Align on a direction", "Discuss next steps"]).
showDetailsButton: A boolean indicating whether to display the "Meeting details" button.
UI Components:

Main Day Summary Container:
This will be the primary container for the day summary information.
Structure: A div with p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4.
This container should dynamically render its content based on the daySummaryData object.
Top Summary Section:
Condition: Renders if daySummaryData.summaryText and daySummaryData.dateText are present.
Structure: A div with flex items-center gap-4.
Calendar Icon: The provided SVG icon (width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg").
HTML


Text Content: A div containing:
p for summary text: text-white text-base font-semibold. Displays [summaryText] from daySummaryData.summaryText.
p for date text: text-white text-lg font-bold. Displays [dateText] from daySummaryData.dateText.
Events Section (Conditional Layout):
Condition: Renders if daySummaryData.events is present and not empty.
Logic for displayType: The JavaScript rendering function should determine displayType based on whether any event in daySummaryData.events has an agenda property that is an array and is not empty.
If daySummaryData.events.some(event => event.agenda && event.agenda.length > 0) is true, the main events container will be flex overflow-x-auto gap-3 pb-2.
Otherwise (no events have agenda details), it will be flex flex-col gap-3.
For each event in daySummaryData.events:
Event Card: A div with bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0.
If the overall displayType is "horizontal", set w-80 (or appropriate fixed width for horizontal scrolling). The height should be flexible (h-auto) to shrink if no agenda is present.
Event Type: span with text-gray-300 text-sm font-semibold. Displays [type] from event object.
Title and Time: div with flex justify-between items-center.
span for title: text-white text-lg font-bold. Displays [title] from event object.
span for time: text-white text-base. Displays [time] from event object.
Location and Attendees: div with flex justify-between items-center mt-2.
span for location: w-[71px] h-[32px] bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2. Displays [location] from event object.
Attendees Avatars (Optional): If event.attendees is present and not empty, a div with flex -space-x-2 overflow-hidden.
For each attendeeAvatarUrl: img with w-8 h-8 rounded-full border-2 border-[#474747] object-cover. Uses [attendeeAvatarUrl].
Extra Attendees Count (Optional): If event.extraAttendeesCount is present, a div with w-8 h-8 rounded-full bg-[#333333] text-white text-xs flex items-center justify-center border-2 border-[#474747]. Displays +\${event.extraAttendeesCount}.
Agenda Card (Optional, nested within event card):
Condition: Renders if event.agenda is present and not empty.
Structure: A div with bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1.
Header: div with text-white text-base font-bold mb-1. Content: "Agenda".
List of agenda items: An unordered list (ul) with list-disc list-inside text-gray-300 text-sm. Each item is an li displaying an agenda item.
Meeting Details Button (Optional):
Condition: Renders if daySummaryData.showDetailsButton is true.
Structure: A button element.
Styling: w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white. Set its textContent to "Meeting details".
Custom CSS Rules:

Apply font-family: 'Neue Haas Grotesk Display Pro', sans-serif; to the body.
Ensure text within the main content container prevents overflow with overflow: hidden;, word-wrap: break-word;, and overflow-wrap: break-word; for all direct children and specific text elements (paragraphs, headings, spans, and divs).
For horizontal scrolling, ensure the container has white-space: nowrap; and child elements have display: inline-block; or flex-shrink: 0;.

For Reschedule
Create a single HTML page with a dark theme. The page should be centered with a maximum width of 400px suitable for mobile viewing, have overall 1.5rem rounded corners, and a background color of #333333 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Neue Haas Grotesk Display Pro' font, loaded from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, have a minimum height of 100vh, and 1.5rem padding around the main container. The UI should consist of the following components, stacked vertically with 1rem spacing between them. The rendering of certain components should be dynamic, appearing only if the corresponding data is provided. Dynamic Data Structure: The page will be driven by a single JavaScript object, rescheduleData, which can contain the following properties:
rescheduleSummaryText: A string for the main summary text at the top (e.g., "Your Design Workshop is now set for Thursday 17 July, at 5 PM"). dateText: A string for the current day and date (e.g., "Thursday, 17 July"). showCalendarIcon: A boolean indicating whether to display the calendar icon next to the summary text. meetings: An array of meeting objects. Each meeting object can contain: type: (string, e.g., "Meeting", "Family Event"). title: (string, e.g., "Design Workshop"). time: (string, e.g., "5:00 PM"). location: (string, e.g., "Starbucks", "Zoom"). attendees: An optional array of attendee avatar URLs (strings). extraAttendeesCount: An optional number (e.g., 2 for "+2"). agenda: An optional array of strings, where each string is an agenda item (e.g., ["Go through moodboards", "Align on a direction", "Discuss next steps"]). showDetailsButton: A boolean indicating whether to display the "Meeting details" button. UI Components:
Main Reschedule Container: This will be the primary container for the reschedule information. Structure: A div with p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4. This container should dynamically render its content based on the rescheduleData object. Top Reschedule Summary Section: Condition: Renders if rescheduleData.rescheduleSummaryText is present. Structure: A div with flex items-center gap-4. Calendar Icon (Optional): If rescheduleData.showCalendarIcon is true, include the following SVG icon (width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"). HTML
Text Content: A div containing: p for summary text: text-white text-base font-semibold. Displays [rescheduleSummaryText] from rescheduleData.rescheduleSummaryText. p for date text: text-white text-lg font-bold. Displays [dateText] from rescheduleData.dateText. Meetings Section (Vertical List Only): Condition: Renders if rescheduleData.meetings is present and not empty. Structure: A div with flex flex-col gap-3. This ensures all meetings are listed vertically. For each meeting in rescheduleData.meetings: Meeting Card: A div with bg-white/10 rounded-xl p-4 flex flex-col gap-2. The height should be flexible (h-auto) to shrink if no agenda is present. Header Text (Optional): If meeting.headerText is present, span with text-gray-300 text-sm font-semibold. Displays [headerText] from meeting object. Title and Time: div with flex justify-between items-center. span for title: text-white text-lg font-bold. Displays [title] from meeting object. span for time: text-white text-base. Displays [time] from meeting object. Location and Attendees: div with flex justify-between items-center mt-2. span for location: w-[71px] h-[32px] bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2. Displays [location] from meeting object. Attendees Avatars (Optional): If meeting.attendees is present and not empty, a div with flex -space-x-2 overflow-hidden. For each attendeeAvatarUrl: img with w-8 h-8 rounded-full border-2 border-[#474747] object-cover. Uses [attendeeAvatarUrl]. Extra Attendees Count (Optional): If meeting.extraAttendeesCount is present, a div with w-8 h-8 rounded-full bg-[#333333] text-white text-xs flex items-center justify-center border-2 border-[#474747]. Displays +\${meeting.extraAttendeesCount}. Agenda Card (Optional, nested within meeting card): Condition: Renders if meeting.agenda is present and not empty. Structure: A div with bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1. Header: div with text-white text-base font-bold mb-1. Content: "Agenda". List of agenda items: An unordered list (ul) with list-disc list-inside text-gray-300 text-sm. Each item is an li displaying an agenda item. Meeting Details Button (Optional): Condition: Renders if rescheduleData.showDetailsButton is true. Structure: A button element. Styling: w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white. Set its textContent to "Meeting details". Custom CSS Rules:
Apply font-family: 'Neue Haas Grotesk Display Pro', sans-serif; to the body. Ensure text within the main content container prevents overflow with overflow: hidden;, word-wrap: break-word;, and overflow-wrap: break-word; for all direct children and specific text elements (paragraphs, headings, spans, and divs).
"`;
          break;
        case "web_search_weather":
          specificPrompt = ` You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents the images in all the three weather senarios (raining: <img src="https://i.ibb.co/GvQCM1VZ/raining.png" alt="raining" border="0">), (sunny: <img src="https://i.ibb.co/4ZF2CxXb/Sunny.png" alt="Sunny" border="0">), (cloudy: <img src="https://i.ibb.co/nq8RHbhV/Party-Cloudy.png" alt="Party-Cloudy" border="0">). don't change any styling or the template structure.
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Dashboard</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Custom Font -->
    <link
      href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro"
      rel="stylesheet" />

    <style>
      /* Apply the custom font to the body */
      body {
        font-family: "Neue Haas Grotesk Display Pro", sans-serif;
        /* No background image or color, just the card */
        background: none;
      }

      /* Custom class for the glassmorphism effect on the weather card */
      .weather-card {
        background-color: rgba(255, 255, 255, 0.1);
        /* Blur effect for the background */
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px); /* For Safari */
        border: 1px solid rgba(255, 255, 255, 0.2);
        /* Ensure no content overflows from the card */
        overflow: hidden;
      }

      /* Custom class to hide the scrollbar */
      .no-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
    </style>
  </head>
  <body>
    <!-- Main container for the weather card -->
    <!-- The max-w-md and mx-auto classes are now directly on the weather-card -->
    <div
      class="weather-card w-full max-w-md mx-auto p-6 rounded-[1.5rem] shadow-lg text-white">
      <!-- Top section: City, Temp, and Image -->
      <div class="flex justify-between items-start">
        <div>
          <!-- Placeholder for city name -->
          <p class="text-2xl font-medium">{{cityName}}</p>
          <div class="flex  mt-1">
            <!-- Placeholder for current temperature -->
             <div class=" text-[40px] font-medium leading-[130%]"
            style={{fontSize:'40px'}} >{{TempratureValue}}</div>
            <div class="align-top mt-1 ml-1 text-[2.2rem]">&deg;F</div>
          </div>
        </div>
        <div class="w-42 h-32 flex-shrink-0">
          <!-- Placeholder for current weather icon -->
          <!-- Image for current weather, will be replaced by dynamic data -->
          <!-- Example: If current weather is sunny -->
          <img
            src="https://i.ibb.co/4ZF2CxXb/Sunny.png"
            alt="{{currentWeatherDescription}}"
            class="w-full h-full object-contain" />
        </div>
      </div>
      <!-- Bottom section: Condition and Stats -->
      <div class="mt-2">
        <!-- Placeholder for weather condition -->
        <p class="font-bold">{{weatherCondition}}</p>
        <div class="flex items-center space-x-4 text-gray-200 text-sm mt-1">
          <div class="flex items-center gap-2">
            <!-- Icon for cloudiness percentage -->
            <img
              src="https://i.ibb.co/0RK8nnbv/Clouds-16.png"
              alt="Clouds-16"
              class="w-4 object-contain" />
            <!-- Placeholder for cloudiness percentage -->
            <span>{{cloudinessPercentage}}%</span>
          </div>
          <div class="flex items-center gap-2">
            
            <img
              src="https://i.ibb.co/xRBb2hq/Humidity-16.png"
              alt="Humidity"
              class="w-4 object-contain" />
            <!-- Placeholder for humidity percentage -->
            <span>{{humidityPercentage}}%</span>
          </div>
        </div>
      </div>
  
    </div>
  </body>
</html>

      `;

          break;

        case "web_search_building_details":
          specificPrompt = `please reference the image I attached to understand what I meant by in my prompt, before you try to generate the ui please deeply analyse the data provided and do couple of researches to get the building images and provide that for the html generation please don't add script or javascript. here is my prompt and replace all place holders with the actual data you analysed : "As a senior frontend developer please generate an html with Objective
Generate a complete static HTML page for a 'Building Details' UI that precisely replicates the visual layout and styling of the provided image. This UI will display key information about a prominent skyscraper, the Burj Khalifa.

The page will feature a concise descriptive text, a main image of the building, a section for core numerical statistics (floor and height), a detailed list of specifications, and a call-to-action button. All content should be static, with no dynamic placeholders needed for this specific UI. The content within the card should occupy its full height, eliminating any vertical scrollbars, and the card itself should have a minimum width of 480px.

Technical Specifications
HTML Structure
Document Title: Set the <title> to "Burj Khalifa Details".

Font Import: Link to import the 'Inter' font from Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap.

Icon Library: Link to Font Awesome for icons: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.

Styling Framework: Include the Tailwind CSS CDN script: https://cdn.tailwindcss.com.

CSS Styling (within <style> tags)
Global Font: Apply font-family: 'Inter', sans-serif; to the body element.

Image Sizing: Ensure .top-image img and .main-image img have width: 100%; height: 100%; object-fit: cover; for proper scaling and aspect ratio.

Body Layout (Tailwind classes)
Apply the following utility classes to the body element for centering and foundational styling: flex justify-center items-center min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.

Main UI Container (#building-details-card)
Create a div with the ID building-details-card.

Apply the following Tailwind classes for structural and aesthetic properties, ensuring a minimum width of 480px and no vertical scrolling: min-w-[480px] flex flex-col gap-4 rounded-[1.5rem] shadow-xl style="background-color: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px);".

Content Structure (within #building-details-card)
Top Header Section
A div with classes: flex items-center gap-3 p-5 pb-0.

Small Image: A div (w-12 h-12 rounded-full overflow-hidden flex-shrink-0 top-image) containing an <img> with src="[URL_TO_SMALL_BURJ_KHALIFA_IMAGE]" and alt="Burj Khalifa Small Image".

Description Text: A <p> element with the text "The Burj Khalifa is a megatall skyscraper located in Dubai, United Arab Emirates." Apply classes for clear, readable font (e.g., text-white text-base).

Main Building Image Section
A div with classes: p-5 pt-0.

An <img> element with src="[URL_TO_MAIN_BURJ_KHALIFA_IMAGE]" and alt="Burj Khalifa Main Image". Apply classes for rounded corners and full width within its container (e.g., w-full rounded-xl main-image).

Mid-Section - Floor and Height Statistics
A div with classes: flex justify-between gap-4 p-5 pt-0.

Floor Section (Left): A div with classes flex-1 flex flex-col items-center p-4 rounded-xl bg-[#333333].

<p> with text "Floor" and appropriate text styling (e.g., text-gray-400 text-sm).

<p> with text "154" and appropriate text styling (e.g., text-white text-5xl font-bold).

Height Section (Right): A div with classes flex-1 flex flex-col items-center p-4 rounded-xl bg-[#333333].

<p> with text "Height" and appropriate text styling (e.g., text-gray-400 text-sm).

<p> with text "829.8" (text-white text-5xl font-bold) followed by a <span> with text "m" (text-gray-400 text-base).

Bottom Section - Detailed Information List
A div with classes: flex flex-col gap-3 p-5 pt-0.

Height Item: A div with classes rounded-xl p-4 flex justify-between items-center bg-[#333333].

Left <p> with text "Height" and appropriate text styling (e.g., text-gray-300 text-base).

Right <p> with text "829.8 m" and appropriate text styling (e.g., text-white text-base font-semibold).

Floors Item: A div with classes rounded-xl p-4 flex justify-between items-center bg-[#333333].

Left <p> with text "Floors" and appropriate text styling (e.g., text-gray-300 text-base).

Right <p> with text "154" and appropriate text styling (e.g., text-white text-base font-semibold).

Elevators Item: A div with classes rounded-xl p-4 flex justify-between items-center bg-[#333333].

Left <p> with text "Elevators" and appropriate text styling (e.g., text-gray-300 text-base).

Right <p> with text "57" and appropriate text styling (e.g., text-white text-base font-semibold).

Call to Action Button
A div with classes: p-5 pt-0.

A <button> with classes: w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg.

Button text: "View details".

Implement an onclick event to navigate to a relevant URL (e.g., window.open('https://en.wikipedia.org/wiki/Burj_Khalifa', '_blank')).

Image Placeholders (replace with actual URLs)
[URL_TO_SMALL_BURJ_KHALIFA_IMAGE]

[URL_TO_MAIN_BURJ_KHALIFA_IMAGE]`;
          break;
        case "web_search_event":
          specificPrompt = "";
          break;
        case "web_search_sport":
          specificPrompt = `please reference the image I attached to understand what I meant by in my prompt, before you try to generate the ui please deeply analyse the data provided and do couple of researches to get thew logos and other relevant datas needed in the html generation pease don't add script or javascript. here is my prompt and replace all place holders with the actual data you analysed : "As a senior frontend developer please generate an html with Objective
Generate a complete static HTML page for a 'Match Stats' UI. This interface will prominently display football match statistics for a game between {{ home_team.name }} and {{ away_team.name }}, presented within a dedicated card component.

The UI must highlight the top-performing player from the match. This player's selection will be based on their highest statistical contributions (e.g., goals, assists, chances created, or duels won) derived from recent match data. The page will include the match score, a detailed list of the selected player’s statistics, and a clear call-to-action button. All dynamic data points will be represented using generic template placeholders (e.g., {{ variable }}), anticipating replacement by a server-side templating engine without reliance on any specific backend language. The content within the card should occupy its full height, eliminating any vertical scrollbars.

Technical Specifications
HTML Structure
Document Title: Set the <title> dynamically to {{ match.title }}.

Font Import: Link to import the 'Inter' font from Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap.

Icon Library: Link to Font Awesome for icons: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.

Styling Framework: Include the Tailwind CSS CDN script: https://cdn.tailwindcss.com.

CSS Styling (within <style> tags)
Global Font: Apply font-family: 'Inter', sans-serif; to the body element.

Statistic Item Background: Define custom styling for .stat-item-bg: background-color: #333333; border-radius: 1rem;.

Image Sizing: Ensure .team-logo img and .player-avatar img have width: 100%; height: 100%; object-fit: cover; for proper scaling and aspect ratio.

Body Layout (Tailwind classes)
Apply the following utility classes to the body element for centering and foundational styling: flex justify-center items-center min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.

Main UI Container (#match-stats-card)
Create a div with the ID match-stats-card.

Apply the following Tailwind classes and inline style for structural and aesthetic properties, ensuring a minimum width of 480px and no vertical scrolling: min-w-[480px] flex flex-col gap-4 rounded-[1.5rem] shadow-xl style="background-color: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px);".

Content Structure (within #match-stats-card)
Player Header Section
A div with classes: flex items-center gap-3 p-5 pb-0.

Player Avatar: A div (w-12 h-12 rounded-full overflow-hidden flex-shrink-0 player-avatar) containing an <img> with src="{{ player.avatar_url }}" and alt="{{ player.name }} Avatar".

Player Info: A div (flex flex-col) containing:

<p> for {{ player.name }} (text-white text-lg font-semibold).

<p> for {{ player.position_team }} (text-gray-400 text-sm leading-tight).

Match Score Section
A div with classes: p-5 flex flex-col items-center justify-center.

Teams Container: A div (flex justify-between items-center w-full max-w-[300px] mb-4).

Home Team: A div (flex flex-col items-center gap-2) containing:

Logo: A div (w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center team-logo) with an <img> src="{{ home_team.logo_url }}" and alt="{{ home_team.name }} Logo".

Name: <p> for {{ home_team.name }} (text-white text-sm font-medium).

Score and Status: A div (flex flex-col items-center) containing:

Score: <p> for {{ match.score }} (text-white text-5xl font-bold).

Status: <p> for {{ match.status }} (text-gray-300 text-sm font-medium).

Away Team: Identical structure to the Home Team, featuring an <img> src="{{ away_team.logo_url }}" and alt="{{ away_team.name }} Logo", and <p> for {{ away_team.name }}.

Statistics List Section
A div with classes: flex flex-col gap-3 p-5 pt-0.

Utilize a template loop (e.g., {% for stat in stats %} ... {% endfor %}) to render individual statistics for the selected player.

Each statistic should be encapsulated within a div (stat-item-bg rounded-xl p-4 flex justify-between items-center), containing:

Left <p> for {{ stat.name }} (text-gray-300 text-base).

Right <p> for {{ stat.value }} (text-white text-base font-semibold).

Call to Action Button
A div with classes: p-5 pt-0.

A <button> with classes: w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg.

Button text: "View Full Match Report".

Implement an onclick event to navigate to {{ match.report_url }} in a new tab.

Player Selection Logic
The top-performing player should be selected based on the highest statistical contributions (e.g., goals, assists, chances created, duels won) from the specific match between {{ home_team.name }} and {{ away_team.name }}.

Recent match data should be used for accurate top performer identification. In the absence of specific match data, default to a prominent player from either team with a strong historical performance against the opponent.

Example Data (for contextual understanding only; replace with actual data)
Match: {{ home_team.name }} vs {{ away_team.name }} (e.g., Manchester City vs Liverpool).

Player: Top performer (e.g., Erling Haaland, based on goals/assists).

Stats: Goals, Assists, Chances Created, Duels Won, etc.

Team Colors: Home team’s primary colors (e.g., Manchester City: sky blue #6CABDD, white #FFFFFF).

Logos: Publicly available team logo URLs.

Report URL: Link to the home team’s official match report page."`;
          break;
        case "web_search_personal_biograph":
          specificPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe's Professional Profile</title>
    <!-- Link to Neue Haas Grotesk Display Pro font -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Link to Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for font and avatar styling */
        body {
            font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
        }
        /* Ensure profile-avatar img fills its container and covers the area */
        .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        /* Custom styling for text-based avatars */
        .text-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #555555;
            color: #ffffff;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 50%; /* Ensure text avatars are rounded */
        }
    </style>
</head>
<body class="flex justify-center items-center m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main UI Container: Hardcoded static content -->
    <div id="profile-card" class="w-full max-w-[450px] flex flex-col gap-4 p-5 rounded-[1.5rem] bg-white/10 shadow-xl">

        <!-- Profile Header Section -->
        <div class="bg-white/10 rounded-xl p-0 flex items-start gap-4">
            <div class="w-11 h-11 overflow-hidden flex-shrink-0 profile-avatar rounded-full">
                <!-- Example: Image Avatar -->
                <img src="https://placehold.co/44x44/FFD700/000000?text=JD" alt="Profile Avatar" class="w-full h-full object-cover rounded-full">
                <!-- Example: Text Avatar (uncomment and remove img tag to use) -->
                <!-- <div class="w-full h-full text-avatar">JD</div> -->
                <!-- Example: Placeholder if no avatar or name (uncomment and remove img/text-avatar to use) -->
                <!-- <img src="https://via.placeholder.com/44/CCCCCC/808080?text=No+Image" alt="Placeholder Avatar" class="w-full h-full object-cover rounded-full"> -->
            </div>
            <div class="flex-grow flex flex-col justify-center py-2">
                <p class="text-white text-lg font-bold leading-tight">Senior Software Engineer | AI/ML Enthusiast | Tech Lead</p>
            </div>
        </div>

        <!-- Experience Section -->
        <!-- Experience 1 with logo -->
        <div class="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
            <div class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
                <img src="https://placehold.co/44x44/007BFF/FFFFFF?text=ABC" alt="ABC Tech Solutions Logo" class="w-full h-full object-cover rounded-full">
            </div>
            <div class="flex-grow space-y-1">
                <p class="font-semibold text-white">Lead Software Engineer</p>
                <div class="flex justify-between items-center w-full">
                    <p class="text-sm" style="color: #FFFFFF99;">ABC Tech Solutions</p>
                    <p class="text-xs" style="color: #FFFFFF99;">Jan 2022 - Present</p>
                </div>
            </div>
        </div>

        <!-- Experience 2 without logo -->
        <div class="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
            <!-- No logo div here as per requirements for null logoUrl -->
            <div class="flex-grow">
                <p class="font-semibold text-white">Software Developer</p>
                <div class="flex justify-between items-center w-full">
                    <p class="text-sm" style="color: #FFFFFF99;">XYZ Innovations</p>
                    <p class="text-xs" style="color: #FFFFFF99;">Mar 2019 - Dec 2021</p>
                </div>
            </div>
        </div>

        <!-- Experience 3 with logo -->
        <div class="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
            <div class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
                <img src="https://placehold.co/44x44/28A745/FFFFFF?text=PQR" alt="PQR Systems Logo" class="w-full h-full object-cover rounded-full">
            </div>
            <div class="flex-grow">
                <p class="font-semibold text-white">Junior Developer</p>
                <div class="flex justify-between items-center w-full">
                    <p class="text-sm" style="color: #FFFFFF99;">PQR Systems</p>
                    <p class="text-xs" style="color: #FFFFFF99;">Aug 2017 - Feb 2019</p>
                </div>
            </div>
        </div>

        <!-- Call to Action Button -->
        <button class="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors" onclick="window.open('https://www.linkedin.com/in/johndoe', '_blank')">
            Connect on LinkedIn
        </button>

        <!-- To test "No profile information available." message, replace the entire content above with this div: -->
        <!-- <div class="text-center text-gray-400 p-4 bg-[#333333] rounded-[16px]">No profile information available.</div> -->

    </div>

</body>
</html>
"`;
          break;
        case "web_search_contact":
          specificPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Details</title>
    <!-- Link to Neue Haas Grotesk Display Pro font -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Link to Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for font and avatar styling */
        body {
            font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
        }
        /* Ensure contact-avatar img fills its container and covers the area */
        .contact-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        /* Custom text shadow for prominent text */
        .text-shadow-custom {
            text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
        }
        /* Custom styling for text-based avatars */
        .text-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #555555;
            color: #ffffff;
            font-size: 2.5rem;
            font-weight: bold;
            /* text-transform: uppercase; (handled by content directly in static HTML) */
        }
    </style>
</head>
<body class="flex justify-center items-center m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main UI Container: Hardcoded static content -->
    <div id="contact-card" class="w-full max-w-[450px] flex flex-col items-center text-center relative overflow-hidden bg-[#333333] rounded-[1.5rem] p-6 shadow-xl space-y-4">

        <!-- Top Bar (Introductory Text with Icon) -->
        <div class="flex items-start gap-3 w-full">
            <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                <i class="fas fa-user"></i> <!-- Fallback icon -->
            </div>
            <div class="text-base leading-[140%] font-semibold text-white flex-grow text-left">
                Contact information.
            </div>
        </div>

        <!-- Circular Avatar -->
        <div class="w-52 h-52 rounded-full overflow-hidden contact-avatar">
            <!-- Example: Image Avatar -->
            <img src="https://placehold.co/208x208/FFD700/000000?text=JD" alt="Contact Avatar" class="w-full h-full object-cover">
            <!-- Example: Text Avatar (uncomment and remove img tag to use) -->
            <!-- <div class="w-full h-full text-avatar rounded-full">JD</div> -->
            <!-- Example: Placeholder if no avatar or name (uncomment and remove img/text-avatar to use) -->
            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAOVBMVEX///+hoaGZmZmenp75+fmmpqbX19e3t7e/v7/t7e3n5+epqanNzc3KysqSkpL8/Pzf39/z8/OwsLBPkmpzAAAC40lEQVR4nO3a6W6rMBCGYbywmmDC/V9sTSAUEiASWGKQ3udXK3EQ3xmPF0qSAAAAAAAAAAAAAAAAAAAAAAAAAAAu4xNvY7o2TZZHVZRXhklNXNmFWbxSKmIUZeoLw1ildBVLWehLw4TKNPHu9iBMNIswYZ72/szdJIU5TUiYUBFbF0V9bpmQEiZpU2WUco8zdxMSJmlDkn7NUY/keNsICePNEEaptDp+NyFhska9FcfvJiRMod9ZTHf8bkLCdGYK447fTUiYx1QZdf/KVI1R6RBm/3F2j19CwiT5WBqT7j1u25m83J67hYTx3oXaKKPTnWdNWhdOLDtzt5Aw4afMGZM+9upSvqYJkz+3LhATJrSDfdq95d+O87euty6TE2Z3F9MfDTI1zt9ma6DJCfPjwtAw0+ydbmyu7xImKfP/pUgX621zlzD+Me0R+jTZ6pH0LmGmhhnTrLbNLcL4pHJaLbjnyoxxizDJs/jIovTainSLML7+zBL+Wft9ncgwtprPVmFWXjbMuNp8b3wkhql0o+fnzapbyRJOcV8DTWCYUpt+KZl+/26YcaB9tY24MN6613ayP9cMw2ilYcZJ4LNtxIWx46HTuHEpqdK1Qfa6RH1sBMSFad/vaUz+GkXzbcxXabrl/llWGJ+Us//4vm22GmZsm9rLDZPYWR1MmoVtjN4aZK9LmsW2RlYYXzfzR+3K7YYZL1F2VhtZYapm+ajdTsMMdG5lhvHPMLSWafbr0l+haz9NAqLC/KzDam3+20ZSmOxIlvmbNkFhykNZ+raRN8zs7wbZMJ0GxITxu6vjj9qMb2vEhDnWMAPjhhlNSphyd6X/WZrh77pCwnh3Jsu7bYSEOdEwY236tzUywrTN2Y+zdOeFVMam7jSVCQnzLCOoJITR8T43vTiM7Q+U0bhrP2v04XilY+kngivDJHkalTvx5c15ZRbVpVmiO/VZJAAAAAAAAAAAAAAAAAAAAAAAAABc4A+lUzEyY9gMcgAAAABJRU5ErkJggg==" alt="Placeholder Avatar" class="w-full h-full object-cover"> -->
        </div>

        <!--optional(if it not exist omit in ui) Contact Name -->
        <h2 class="text-2xl font-bold text-white text-shadow-custom">Jane Doe</h2>

        <!--optional(if it not exist omit in ui) Additional Contact Details Section -->
        <div class="w-full text-left bg-[#444444] p-4 rounded-lg space-y-2">
            <!-- Birthday Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-birthday-cake text-gray-400"></i>
                <span class="text-gray-200"><strong>Birthday:</strong> January 1, 1990</span>
            </div>
            <!-- Email Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-envelope text-gray-400"></i>
                <span class="text-gray-200"><strong>Email:</strong> jane.doe@example.com</span>
            </div>
            <!-- Phone Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-phone text-gray-400"></i>
                <span class="text-gray-200"><strong>Phone:</strong> +1 (555) 123-4567</span>
            </div>
            <!-- Address Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-map-marker-alt text-gray-400"></i>
                <span class="text-gray-200"><strong>Address:</strong> 123 Main St, Anytown, USA 12345</span>
            </div>
            <!-- Notes Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-info-circle text-gray-400"></i>
                <span class="text-gray-200"><strong>Notes:</strong> Met at the annual tech conference.</span>
            </div>
        </div>

        <!-- "Send a message" Button -->
        <button class="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors">
            Send a message
        </button>

        <!-- To test "No contact information available." message, replace the entire content above with this div: -->
        <!-- <div class="text-center text-gray-400 p-4 bg-[#333333] rounded-xl">No contact information available.</div> -->

    </div>

</body>
</html>
"`;
          break;
        case "web_search_hospitality":
          specificPrompt = `
          IMPORTANT: Use only the actual data provided in the API response. Do not use any static, sample, or placeholder data from this prompt. Every field in the UI must come from the real API response make the response match with the ui. If a field is missing, omit that field and on current cond replace static data with the response and use real image of the Restaurant and hotels and don't change any ui style just understand the response and make show the content in ui and also when you ask for resturant please use Restaurant ui part , if you ask for hotels you should use hotels ui.
          IMPORTANT: Use actual and real image of Restaurant or hotel if it fail use placeholder image 
          "Generate a complete HTML page for a UI that can display either 'Restaurant Details' or 'Hotel Listings, or Hotel Detail with list of image', using Tailwind CSS for styling. The UI should be capable of displaying both a single restaurant entry and a list of hotel entries.

HTML Structure:

    Standard HTML5 boilerplate with meta charset and viewport.

    title should be 'Restaurant & Hotel Details Sample'.

    Link to import the 'Neue Haas Grotesk Display Pro' font from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro.

    Link to Font Awesome for icons (utensils, star, clock, bed, globe, map-marker, phone, dumbbell, eye, wrench, info-circle) from https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.

    Include the Tailwind CSS CDN script from https://cdn.tailwindcss.com.

CSS Styling (within <style> tags):

    Apply font-family: "Neue Haas Grotesk Display Pro", Arial, sans-serif; to the body.

    Ensure .restaurant-image img and .hotel-image img have width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;.

    Add a custom class .text-shadow-custom for text-shadow: 1px 1px 3px rgba(0,0,0,0.7);.

Body Layout (using Tailwind classes):

    body should be flex justify-center items-start  m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.

Main UI Container (id="main-content-container"):

    A div with container w-full max-w-[450px] flex flex-col gap-4 p-5 rounded-[1.5rem] bg-white/10 shadow-xl.

    This div will contain either the restaurant or hotel content.

Content Sections (Static HTML, commented out to switch between views):

1. Restaurant Details Sample or (list of Restaurant):

    Top Bar (Introductory Text with Icon):

        Structure: A div with flex items-start gap-3 mb-2.

        Icon div: w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold flex-shrink-0. Inside, a Font Awesome icon (i tag) like fas fa-utensils.

        Text div: text-lg font-bold text-white leading-tight flex-grow.e,g( Set its textContent to 'put response match to this ', this is for sample for you to understandable like this for other placeholder value).

    Restaurant Image Card:

        Structure: A div with restaurant-image card bg-[#333333] rounded-xl p-0 overflow-hidden relative h-56.

       optional img (if no image omit the image and bottom button in ui): w-full h-full object-cover rounded-xl. Use a sample image URL when you get an error to load the image  (e.g., https://i.ibb.co/0pzY3nWB/placeholder-Hotels.png, if the actual image url is not provide or have error use this placeholder image).

        Optional Rating Overlay: An absolute div with top-4 left-4 bg-black bg-opacity-50 text-white text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-1. Inside, a Font Awesome star icon (fas fa-star) with text-yellow-400 and a span for the rating (e.g., '4.7').

    Restaurant Details Card:

        Structure: A div with card bg-white/10 rounded-xl p-4 flex flex-col gap-2.

        Name and Distance div: flex justify-between items-center.

            Name div: text-xl font-bold text-white (e.g., 'The Gastronome Grill' this is for sample for you to understandable like this for other placeholder value).

            Distance div: text-sm text-gray-400 (e.g., '2.5 mi' this is for smaple for you to understandable like this for other placeholder value).

        Food Type and Price Range div: text-base text-gray-400 flex items-center gap-2.

            Font Awesome icon (i tag) (e.g., fas fa-burger).

            span for food type and price range (e.g., 'Modern American • $$$$').

        Open Status and Closing Time div: text-base flex items-center gap-2.

            Font Awesome clock icon (fas fa-clock) with text-gray-400.

            span for open/closed status: font-semibold. Apply text-green-400 if open, else text-red-400 (e.g., 'Open').

            span for closing time: text-gray-400 (e.g., '• 10:00 PM').

    Book A Table Button:

        Structure: A button element. always white background and black text color

        Styling: bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-gray-200. Set its textContent to 'Book A Table'.

2. Hotel Listing Sample:

    Top Bar (Introductory Text with Icon):

        Structure: A div with flex items-start gap-3 mb-2.

        Icon div: w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white text-xl font-bold flex-shrink-0. Inside, a Font Awesome icon (i tag) like fas fa-hotel.

        Text div: text-lg font-bold text-white leading-tight flex-grow. Set its textContent to 'use the real api respose data that match with this.'.

    Hotel Cards (List):

        Create two sample hotel cards. For each hotel:

            Structure: A div with card bg-[#333333] rounded-xl p-4 flex flex-col gap-3.

            Optional  Hotel Image(if the no image omit in ui): A div with hotel-image rounded-xl overflow-hidden h-40. Inside, an img with w-full h-full object-cover. (e.g., https://i.ibb.co/0pzY3nWB/placeholder-Hotels.png, if the actual image url is not provide or have error use this placeholder image).

            Location, Rating, Amenities Row: A div with flex justify-between items-center text-sm.

                Left side div: flex items-center gap-2.

                    Location span: text-gray-400 (e.g., 'New York').

                    Star Rating span: flex items-center text-yellow-400. Render 5 Font Awesome star icons (fas fa-star), with text-gray-600 for unfilled stars based on a sample rating (e.g., 4.5).

                    Numerical Rating span: text-white font-semibold (e.g., '4.5').

                Right side div: flex items-center gap-2.

                    For each amenity, create a div with w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm. Inside, a Font Awesome icon (i tag) (e.g., fas fa-wifi, fas fa-dumbbell, fas fa-spa, fas fa-parking).

            Hotel Name: A div with text-xl font-bold text-white (e.g., 'Grand Hyatt', 'The Cozy Inn',  as placeholder, please change it in real data as soon as you get the data).

            Price: A div with text-base text-gray-400 (e.g., 'from $350 p/night as placeholder, please change it in real data as soon as you get the data').

            Action Buttons Row: A div with flex justify-between items-center mt-2.

                For each action, create an a tag (link) with flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200 hover:bg-gray-600.

                    Font Awesome icon (i tag) (e.g., fas fa-web, fas fa-phone, fas fa-map-marker-alt).

                    span for action text (e.g., 'website','Direction', 'Call'). Set href to '#' or a sample tel: link.

    Main Action Button (for hotel listing):

        Structure: A button element.

        Styling: bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-gray-200. Set its textContent to 'Explore More Hotels'.

Instructions for switching views:

    The generated HTML should contain both the restaurant and hotel sections.

    One section should be commented out by default (e.g., the restaurant section) so that the other (e.g., hotel listing) is visible upon initial load. Users can uncomment the desired section and comment out the other to switch views."`;
          break;
        case "web_search_generic":
          specificPrompt = "";
          break;
        case "web_search_articles":
          specificPrompt = `"Generate a complete HTML page for a 'Professional Profile' UI, using Tailwind CSS for styling and JavaScript for dynamic, conditional rendering. This UI should display a user's professional information in a prominent card format, with a specialized header section and an optional list of experiences.
HTML Structure:
Standard HTML5 boilerplate with meta charset and viewport.
title should be '[Dynamic content, e.g., User Profile]'.
Link to import the 'Neue Haas Grotesk Display Pro' font from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro.
Link to Font Awesome for icons from https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.
Include the Tailwind CSS CDN script from https://cdn.tailwindcss.com.
CSS Styling (within <style> tags):
Apply font-family: 'Neue Haas Grotesk Display Pro', sans-serif; to the body.
Ensure .profile-avatar img has width: 100%; height: 100%; object-fit: cover;. (Note: border-radius: 50%; is intentionally not applied here to allow for square avatars as per the image).
Add custom styling for .text-avatar to display: flex; align-items: center; justify-content: center; background-color: #555555; color: #ffffff; font-size: 1.5rem; font-weight: bold; border-radius: 50%;.
Body Layout (using Tailwind classes):
body should be flex justify-center items-center min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.
Main UI Container (id='profile-card'):
A div with id="profile-card" that acts as the main container for the profile.
It should have the classes: w-full max-w-[450px] flex flex-col gap-4 p-5 rounded-[1.5rem] bg-[#222222] shadow-xl max-h-[90vh] overflow-y-auto.
This div will be empty initially, as its content will be dynamically injected by JavaScript.
JavaScript Logic (within <script> tags, at the end of body):
renderProfileUI(data) Function:
This function takes a data object as its argument.
It should get the profile-card element. If not found, log an error and return.
It must clear the innerHTML of the container before rendering new content.
The HTML page's <title> element should be updated with data.title if provided, otherwise default to 'User Profile'.
Conditional Rendering Logic for the profile card:
Condition: Renders if data.profile object is present.
Structure: Content is directly appended to the profile-card container.
Profile Header Section: Create a div with bg-[#222222] rounded-xl p-0 flex items-start gap-4.
Profile Image/Avatar: Create a div with w-11 h-11 overflow-hidden flex-shrink-0 profile-avatar.
If data.profile.avatarUrl is present, an img with w-full h-full object-cover. Use data.profile.avatarUrl for src.
If data.profile.avatarUrl is not present but data.profile.name is present, create a div with w-full h-full text-avatar. Set its textContent to the first letter initials of data.profile.name (ensuring the first letter of name is capitalized using .toUpperCase()).
If neither avatarUrl nor name is present, use a placeholder image: https://via.placeholder.com/44/CCCCCC/808080?text=No+Image.
Create a div with flex-grow flex flex-col justify-center py-2 for the text content.
Profile Tagline/Description: If data.profile.tagline is present, create a p element with classes text-white text-lg font-bold leading-tight and set its textContent to data.profile.tagline. (Note: The name property is used for initials fallback but not rendered as a separate h2 in this design).
    Make the avatar rounded-full
Experience Section (Optional): If data.profile.experiences is an array and not empty, iterate through data.profile.experiences.
For each experience, create a div with bg-white/10 rounded-[16px] p-4 flex items-start gap-3.
Icon/Logo div: Create a div with w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0.
If experience.logoUrl is present, use an img tag instead with w-full h-full object-cover rounded-full. Use experience.logoUrl for src.
Else, remove the from the ui
Details div: Create a div with flex-grow.
Create a p with font-semibold text-white and textContent experience.title.
Create a div with flex justify-between items-center w-full.
Create a p with text-sm and style.color = '#FFFFFF99' for textContent experience.company.
Create a p with text-xs and style.color = '#FFFFFF99' for textContent experience.duration.
Call to Action Button (Optional): If data.profile.callToAction is present, create a button with w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors. Set its textContent to data.profile.callToAction.text. Add an onclick event to perform an action (e.g., window.open(data.profile.callToAction.link, '_blank')).
No Profile Message: If data.profile is not present, display a div with text-center text-gray-400 p-4 bg-[#333333] rounded-[16px] and text 'No profile information available.' "

For sports
"Generate a complete HTML page for a 'Match Stats' UI, using Tailwind CSS for styling and JavaScript for dynamic, conditional rendering. This UI should display football match statistics in a prominent card format, including player details, match score, a list of statistics, and a call-to-action button.
HTML Structure:
Standard HTML5 boilerplate with meta charset and viewport.
title should be '[Dynamic content, e.g., Match Stats]'.
Link to import the 'Inter' font from Google Fonts (https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap).
Link to Font Awesome for icons from (https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css).
Include the Tailwind CSS CDN script from (https://cdn.tailwindcss.com).
CSS Styling (within <style> tags):
Apply font-family: 'Inter', sans-serif; to the body.
Add custom styling for .gradient-header with background: linear-gradient(to right, #D4AF37, #1E4E2C); (Gold for Al-Nassr, Dark Green for Al-Khaleej).
Add custom styling for .stat-item-bg with background-color: #333333;.
Ensure .team-logo img, .player-avatar img have width: 100%; height: 100%; object-fit: cover;.
Body Layout (using Tailwind classes):
body should be flex justify-center items-center min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.
Main UI Container (id='match-stats-card'):
A div with id="match-stats-card" that acts as the main container for the stats.
It should have the classes: w-full max-w-[450px] flex flex-col gap-4 rounded-[1.5rem] bg-[#222222] shadow-xl max-h-[95vh] overflow-y-auto.
This div will be empty initially, as its content will be dynamically injected by JavaScript.
JavaScript Logic (within <script> tags, at the end of body):
renderMatchStatsUI(data) Function:
This function takes a data object as its argument.
It should get the match-stats-card element. If not found, log an error and return.
It must clear the innerHTML of the container before rendering new content.
The HTML page's <title> element should be updated with data.title if provided, otherwise default to 'Match Stats'.
Conditional Rendering Logic for the stats card:
Combined Header Section (Player and Match):
Create a single wrapper div with gradient-header and rounded-t-[1.5rem].
This wrapper's rounded-b-[1.5rem] class should be conditionally applied if it's the last content block (i.e., no data.stats or data.callToAction are present).
Player Header Section: Renders inside the combined header wrapper if data.player object is present.
Create a div with flex items-center gap-3 p-5 pb-0.
Player Avatar: Create a div with w-12 h-12 rounded-full overflow-hidden flex-shrink-0 player-avatar.
Use an img with src set to data.player.avatarUrl or a placeholder (https://placehold.co/48x48/CCCCCC/808080?text=P).
Player Info: Create a div with flex flex-col.
p for data.player.name with text-white text-lg font-semibold.
p for data.player.description with text-gray-400 text-sm leading-tight.
Match Score Section: Renders inside the combined header wrapper if data.match object is present.
Create a div with p-5 flex flex-col items-center justify-center.
Teams Container: Create a div with flex justify-between items-center w-full max-w-[300px] mb-4.
Home Team: div with flex flex-col items-center gap-2.
Logo: div with w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center team-logo.
img with src set to data.match.homeTeam.logoUrl or a placeholder (https://placehold.co/64x64/CCCCCC/808080?text=H).
Name: p for data.match.homeTeam.name with text-white text-sm font-medium.
Score and Status: div with flex flex-col items-center.
Score: p for \${data.match.homeTeam.score} - \${data.match.awayTeam.score} with text-white text-5xl font-bold.
Status: p for data.match.status with text-gray-300 text-sm font-medium.
Away Team: (Structure identical to Home Team, using data.match.awayTeam).
Statistics List Section (Optional): If data.stats is an array and not empty, iterate through data.stats.
Create a container div with flex flex-col gap-3 p-5 pt-0.
For each statistic, create a div with stat-item-bg rounded-xl p-4 flex justify-between items-center.
p for stat.label with text-gray-300 text-base.
p for stat.value with text-white text-base font-semibold.
Call to Action Button (Optional): If data.callToAction is present.
Create a container div with p-5 pt-0.
Create a button with w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg.
Set its textContent to data.callToAction.text.
Add an onclick event to perform an action (e.g., window.open(data.callToAction.link, '_blank')).
If no CTA button, add a div with pb-5 for bottom padding, but only if other content (player, match, or stats) is present.
No Data Message: If data.player AND data.match AND (data.stats is not an array or is empty) are not present, display a div with text-center text-gray-400 p-4 bg-[#333333] rounded-xl and text 'No match statistics available.'`;
          break;
        case "web_search_products":
          specificPrompt = "";
          break;
        case "web_search_qa":
          specificPrompt = "";
          break;
        case "web_search_grounding":
          specificPrompt = "";
          break;
        case "list_emails":
          specificPrompt = `"Create a single HTML page with a dark theme. The page should be centered with a maximum width suitable for mobile viewing (e.g., 400px), have overall 1.5rem rounded corners, and a background color of #282828 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Inter' font, loaded from Google Fonts. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, have a minimum height of 100vh, and 1.5rem padding around the main container.

The UI should consist of the following components, stacked vertically with 1rem spacing between them:

Header/Title

A text-xl sized, font-semibold white text that reads: Emails

Horizontal Spacer Line

A thin horizontal line with a color of rgba(255, 255, 255, 0.1) and vertical margins of 1rem (achieved via my-4 or margin-top: 1rem; margin-bottom: 1rem;). This line should be placed directly after the Header/Title.

Email List (Dynamic Component)

The email list should be dynamically generated. For each email, the following data points should be used to render the component: sender name, sender initials, a sender-specific hex color for the avatar background, email subject, an optional snippet of the email body, an optional relative timestamp (e.g., \"Yesterday\"), an optional specific time (e.g., \"3:31 PM\"), and an optional boolean indicating whether a reply/forward icon should be shown. If an optional component's data is not provided, that component should not be rendered.

For each email, render an email item with the following structure:

Email Item Container: A div with flex items-start gap-4 relative.

Avatar: A 40x40px, rounded avatar (img tag) with the sender's theme color as the background color. The src should be a placeholder image like https://placehold.co/40x40/[SENDER_HEX_COLOR]/FFFFFF?text=[SENDER_INITIALS]).

Email Details: A div with flex-1 flex flex-col gap-2 containing the following:

Sender Name: A span with font-semibold text-sm bg-[#484848] px-3 py-1 rounded-xl w-fit text-white. This will display the sender's name.

Subject: A h2 with text-lg font-bold text-white mt-2. This will display the email subject.

Email Body/Snippet (Optional): A p with text-base text-gray-300. This will display the snippet of the email body.

Status/Timestamp (Optional): A div with flex items-center text-sm text-gray-400.

Custom Blue Double Checkmark SVG Icon: (width=\"22\" height=\"13\" viewBox=\"0 0 22 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (M5.70011 13.0001L0.0501099 7.3501L1.47511 5.9501L7.12511 11.6001L5.70011 13.0001ZM11.3501 13.0001L5.70011 7.3501L7.10011 5.9251L11.3501 10.1751L20.5501 0.975098L21.9501 2.4001L11.3501 13.0001ZM11.3501 7.3501L9.92511 5.9501L14.8751 1.0001L16.3001 2.4001L11.3501 7.3501Z\" fill=\"#1078FF\") preceding the text: \"Received: [Relative Timestamp], [Time]\". The icon should have a mr-2\` class.


SVG Icon: (width=\"16\" height=\"14\" viewBox=\"0 0 16 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (\`M7.99954 4.00958V0.182129L0.329407 7.00002L7.99954 13.8179V9.98592C10.2361 9.96191 11.5143 10.2111 12.3264 10.6171C13.1683 11.0381 13.5867 11.665 14.0699 12.6315L15.3329 12.3334C15.3329 9.47717 14.9232 7.32861 13.6125 5.92075C12.3937 4.61169 10.5325 4.08468 7.99954 4.00958Z\` fill=\"white\").

Horizontal Spacer Line

A thin horizontal line with a color of rgba(255, 255, 255, 0.1) and vertical margins of 1rem (achieved via my-4 or margin-top: 1rem; margin-bottom: 1rem;). This line should separate each email item.

Custom CSS Rules:

Define CSS variables --card-custom-rounded: 1.5rem; and --card-custom-inner-rounded: 1rem;.

Apply font-family: 'Inter', sans-serif; to the body.

Ensure text within the main content container (.main-content-container) prevents overflow with overflow: hidden;, word-wrap: break-word;, and overflow-wrap: break-word; for all direct children and specific text elements (paragraphs, headings, spans, and divs).

Add a CSS rule for .spacer-line with height: 1px; background-color: rgba(255, 255, 255, 0.1); and appropriate vertical margins of 1rem.

Negative Prompt:

Do not add any borders to any elements in the UI, including but not limited to the Email Item Container, Avatar, or any other components. Ensure all elements have border: none; to avoid any border styling."`;
          break;

        case "summarize_emails":
          specificPrompt = `"Create a single HTML page with a dark theme. The page should be centered with a maximum width of 400px suitable for mobile viewing, have overall 1.5rem rounded corners, and a background color of #333333 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Neue Haas Grotesk Display Pro' font, loaded from \<link href=\"https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro\" rel=\"stylesheet\"\>. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, have a minimum height of 100vh, and 1.5rem padding around the main container. The UI should consist of the following components, stacked vertically with 1rem spacing between them. The rendering of certain components (Email Cards, Event/Meeting Card, Map Card, Attachments Section, Action Button) should be dynamic, appearing only if the corresponding data is provided. Dynamic Data Structure: The page will be driven by a single JavaScript object, emailSummaryData, which can contain the following properties:
summaryHeader: This object will derive its text from the subject of the first email in the emails array. The avatarUrl property is not used for this header. emails: An array containing exactly two email objects: The first object in the array represents the sender's email. It contains: senderName (optional string), senderInitials (string), senderColor (hex string for avatar border), subject (string). This email object will not have snippet, relativeTimestamp, or time properties. The second object in the array represents the receiver's email. It contains: senderName (optional string), senderInitials (string), senderColor (hex string for avatar border), subject (string), snippet (optional string), relativeTimestamp (optional string), time (optional string). event: An optional object containing title (string), dateTime (string), recipientInitials (string), and recipientColor (hex string for participant avatar border). map: An optional object containing imageUrl (string for map placeholder), and locationName (string). attachments: An optional array of objects, where each object contains fileName (string) and fileIconSvgPath (string for a file icon SVG path). UI Components:
Summary Header This component will display a dynamic summary text at the top of the card. It should be a div that is text-xl sized, font-semibold white text, with truncation for overflow (overflow: hidden; text-overflow: ellipsis; white-space: nowrap;). It should not contain an avatar. The text content of this header will be the subject of the first email in the emailSummaryData.emails array (i.e., emailSummaryData.emails[0].subject). This component should only be rendered if emailSummaryData.emails exists and contains at least one email. Horizontal Spacer Line A thin horizontal line with a color of #474747 and vertical margins of 1rem (achieved via my-4). This line should be placed directly after the Summary Header. Email Cards (Main) This section is part of the main container's background (#333333) and should not have its own distinct card background. It should be a container (div with space-y-4 for spacing between multiple email items) that dynamically renders both email items from the emailSummaryData.emails array. This component should only be rendered if emailSummaryData.emails exists and contains at least one email. For each email item, render a div with flex items-start gap-4. Avatar: A 40x40px, rounded avatar (img tag) with a 2px [Sender's Theme Color] border. The src should be a placeholder image like https://placehold.co/40x40/[SENDER_HEX_COLOR]/FFFFFF?text=[SENDER_INITIALS]) positioned on the left side. Email Details: A div with flex-1 flex flex-col gap-2 on the right side containing the name (if available), subject, message, and timestamp. Sender Name (Optional): A span with font-semibold text-sm bg-[#484848] px-3 py-1 rounded-2xl (for 16px border-radius), and w-fit width, text-white. This will display the [Sender Name] from the current email object. This should only be rendered if senderName exists. If senderName is not provided, the avatar and the rest of the email content (subject, snippet, timestamp) should still be displayed side-by-side. Subject: A h2 with text-xl font-bold text-white mt-2. This will display the [Email Subject]. Email Body/Snippet (Optional): A p with text-base text-gray-300. This will display a [Snippet of the email body]. This should only be rendered if snippet exists. Status/Timestamp (Optional): A div with flex items-center text-sm text-gray-400. It should include a custom blue double checkmark SVG icon (width=\"22\" height=\"13\" viewBox=\"0 0 22 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (M5.70011 13.0001L0.0501099 7.3501L1.47511 5.9501L7.12511 11.6001L5.70011 13.0001ZM11.3501 13.0001L5.70011 7.3501L7.10011 5.9251L11.3501 10.1751L20.5501 0.975098L21.9501 2.4001L11.3501 13.0001ZM11.3501 7.3501L9.92511 5.9501L14.8751 1.0001L16.3001 2.4001L11.3501 7.3501Z\" fill=\"#1078FF\") preceding the text: \"Received: [Relative Timestamp], [Time]\". The icon should have a mr-2 class. This entire div should only be rendered if both relativeTimestamp and time exist for the email. Event/Meeting Card (Conditional) A card with 1rem rounded corners (rounded-custom-inner), 1rem padding (p-4), a background color of #444444, and text-white. It should be a flex container with content justified between the start and end, and items centered. This card should only be displayed if emailSummaryData.event exists. Title: A text-lg, font-bold heading. This is where the [Event Title] from emailSummaryData.event would appear. Date & Time: A text-sm, text-gray-300 paragraph. This is where the [Event Date & Time] from emailSummaryData.event would appear. Participant Avatar: A 40x40px, rounded avatar with a 2px [Recipient's Theme Color] border on the right side, using a placeholder image like https://placehold.co/40x40/[RECIPIENT_HEX_COLOR]/FFFFFF?text=[RECIPIENT_INITIALS]). Map Card (Conditional) A card with 1rem rounded corners (rounded-custom-inner), overflow-hidden, and a background color of #333333. This card should only be displayed if emailSummaryData.map exists. Map Placeholder: A full-width, 48-unit height div (h-48) with a bg-gray-600 background. It should contain a placeholder image from a [Map Image URL] with opacity-70, object-cover, and be a w-full h-full image. Centered on top of this image, include a white map pin SVG icon (w-8 h-8 mx-auto mb-1 with viewBox=\"0 0 20 20\" and the specified path fill-rule=\"evenodd\"), and the text for the [Location Name] in font-semibold, text-lg. Attachments Section (Conditional) A div with a text-base, text-gray-400 heading that reads \"Attachments\". This section should only be displayed if emailSummaryData.attachments exists and is not empty. Below the heading, for each attachment in the attachments array: A rounded card (e.g., rounded-xl, p-3, bg-[#444444]) with flex items-center gap-2. An SVG icon (width=\"22\" height=\"28\" viewBox=\"0 0 22 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with two paths (M11 0.666504H4.33333C2.12419 0.666504 0.333328 2.45736 0.333328 4.6665V23.3332C0.333328 25.5423 2.12419 27.3332 4.33333 27.3332H17.6667C19.8758 27.3332 21.6667 25.5423 21.6667 23.3332V11.3332H15C12.7909 11.3332 11 9.54231 11 7.33317V0.666504Z and M20.8856 8.6665L13.6667 1.44755V7.33317C13.6667 8.06955 14.2636 8.6665 15 8.6665H20.8856Z) preceding the file name. A text-base, text-white span displaying the [File Name]. Action Button (Optional) A full-width button with 1.5rem rounded corners (rounded-[var(--card-custom-rounded)]), a white background (bg-white), black text (text-black), py-3 px-4 padding, font-semibold, text-lg, and a hover:bg-black effect with text-white on hover (transition-colors duration-200). The button text should always be \"Reply\". This button should only be displayed if emailSummaryData.emails exists and contains at least one email (as it's a reply to an email). Custom CSS Rules:
Define CSS variables --card-custom-rounded: 1.5rem; and --card-custom-inner-rounded: 1rem;. Apply font-family: 'Neue Haas Grotesk Display Pro', sans-serif; to the body. Ensure text within the main content container (.main-content-container) prevents overflow with overflow: hidden;, word-wrap: break-word;, and overflow-wrap: break-word; for all direct children and specific text elements (paragraphs, headings, spans, and divs).
"`;
          break;
        case "last_unread_emails":
          specificPrompt = `"Create a single HTML page with a dark theme. The page should be centered with a maximum width suitable for mobile viewing (e.g., 400px), have overall 1.5rem rounded corners, and a background color of #282828 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Inter' font, loaded from Google Fonts. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, have a minimum height of 100vh, and 1.5rem padding around the main container.

The UI should consist of the following components, stacked vertically with 1rem spacing between them:

Header/Title

A text-xl sized, font-semibold white text that reads: \"You have [Number] unread emails\". The [Number] should be dynamically populated based on the number of email items displayed.

Horizontal Spacer Line

A thin horizontal line with a color of rgba(255, 255, 255, 0.1) and vertical margins of 1rem (achieved via my-4 or margin-top: 1rem; margin-bottom: 1rem;). This line should be placed directly after the Header/Title.

Email List (Dynamic Component)

The email list should be dynamically generated. For each email, the following data points should be used to render the component: sender name, sender initials, a sender-specific hex color for the avatar background, email subject, an optional snippet of the email body, an optional relative timestamp (e.g., \"Yesterday\"), an optional specific time (e.g., \"3:31 PM\"), and an optional boolean indicating whether a reply/forward icon should be shown. If an optional component's data is not provided, that component should not be rendered.

For each email, render an email item with the following structure:

Email Item Container: A div with flex items-start gap-4 relative.

Avatar: A 40x40px, rounded avatar (img tag) with the sender's theme color as the background color. The src should be a placeholder image like https://placehold.co/40x40/[SENDER_HEX_COLOR]/FFFFFF?text=[SENDER_INITIALS]).

Email Details: A div with flex-1 flex flex-col gap-2 containing the following:

Sender Name: A span with font-semibold text-sm bg-[#484848] px-3 py-1 rounded-xl w-fit text-white. This will display the sender's name.

Subject: A h2 with text-lg font-bold text-white mt-2. This will display the email subject.

Email Body/Snippet (Optional): A p with text-base text-gray-300. This will display the snippet of the email body.

Status/Timestamp (Optional): A div with flex items-center text-sm text-gray-400.

Custom Blue Double Checkmark SVG Icon: (width=\"22\" height=\"13\" viewBox=\"0 0 22 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (M5.70011 13.0001L0.0501099 7.3501L1.47511 5.9501L7.12511 11.6001L5.70011 13.0001ZM11.3501 13.0001L5.70011 7.3501L7.10011 5.9251L11.3501 10.1751L20.5501 0.975098L21.9501 2.4001L11.3501 13.0001ZM11.3501 7.3501L9.92511 5.9501L14.8751 1.0001L16.3001 2.4001L11.3501 7.3501Z\" fill=\"#1078FF\") preceding the text: \"Received: [Relative Timestamp], [Time]\". The icon should have a mr-2\` class.

Reply/Forward Icon (Optional): A button with absolute top-0 right-0 w-8 h-8 rounded-full bg-[#3A3A3A] flex items-center justify-center.

SVG Icon: (width=\"16\" height=\"14\" viewBox=\"0 0 16 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (\`M7.99954 4.00958V0.182129L0.329407 7.00002L7.99954 13.8179V9.98592C10.2361 9.96191 11.5143 10.2111 12.3264 10.6171C13.1683 11.0381 13.5867 11.665 14.0699 12.6315L15.3329 12.3334C15.3329 9.47717 14.9232 7.32861 13.6125 5.92075C12.3937 4.61169 10.5325 4.08468 7.99954 4.00958Z\` fill=\"white\").

Horizontal Spacer Line

A thin horizontal line with a color of rgba(255, 255, 255, 0.1) and vertical margins of 1rem (achieved via my-4 or margin-top: 1rem; margin-bottom: 1rem;). This line should separate each email item.

Custom CSS Rules:

Define CSS variables --card-custom-rounded: 1.5rem; and --card-custom-inner-rounded: 1rem;.

Apply font-family: 'Inter', sans-serif; to the body.

Ensure text within the main content container (.main-content-container) prevents overflow with overflow: hidden;, word-wrap: break-word;, and overflow-wrap: break-word; for all direct children and specific text elements (paragraphs, headings, spans, and divs).

Add a CSS rule for .spacer-line with height: 1px; background-color: rgba(255, 255, 255, 0.1); and appropriate vertical margins of 1rem.

Negative Prompt:

Do not add any borders to any elements in the UI, including but not limited to the Email Item Container, Avatar, or any other components. Ensure all elements have border: none; to avoid any border styling."`;
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

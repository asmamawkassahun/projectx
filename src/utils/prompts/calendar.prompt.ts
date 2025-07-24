export const calendarPrompt = `"Create a single HTML page with a dark theme. The page should be centered with a maximum width of 400px suitable for mobile viewing, have overall 1.5rem rounded corners, and a background color of #333333 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Neue Haas Grotesk Display Pro' font, loaded from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, have a minimum height of 100vh, and 1.5rem padding around the main container. The UI should consist of the following components, stacked vertically with 1rem spacing between them. The rendering of certain components should be dynamic, appearing only if the corresponding data is provided.
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

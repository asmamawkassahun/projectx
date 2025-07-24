export const rescheduleMeetingPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents
"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reschedule</title>
    <!-- Custom Font: Neue Haas Grotesk Display Pro -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for body and font application */
        body {
            font-family: "Neue Haas Grotesk Display Pro", Arial, sans-serif;
            background-color: #1a1a1a; /* Dark background for the body */
            display: flex; /* Use flexbox to center content */
            justify-content: center; /* Center horizontally */
            align-items: flex-start; /* Align items to the start of the cross-axis */
            min-height: 100vh; /* Ensure body takes at least full viewport height */
            padding: 1.5rem; /* Padding around the main content container */
            overflow-y: auto; /* Enable vertical scrolling for the body if content overflows */
            overflow-x: hidden; /* Prevent horizontal scrolling for the entire body */
            text-rendering: optimizeLegibility; /* Improve text rendering */
            -webkit-font-smoothing: antialiased; /* Smoother fonts on WebKit browsers */
            -moz-osx-font-smoothing: grayscale; /* Smoother fonts on Firefox */
        }

        /* Ensure text within the main content container prevents overflow */
        .main-reschedule-container > *,
        .main-reschedule-container h1,
        .main-reschedule-container h2,
        .main-reschedule-container h3,
        .main-reschedule-container p,
        .main-reschedule-container span,
        .main-reschedule-container div {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>
<body>

    <!-- Main Reschedule Container -->
    <!-- This div is the primary container for the reschedule information. -->
    <!-- All content is statically rendered here. -->
    <div id="rescheduleCard" class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4 main-reschedule-container">

        <!-- 1. Top Reschedule Summary Section -->
        <!-- Condition: Renders if rescheduleData.rescheduleSummaryText is present. -->
        <div class="flex items-center gap-4">
            <!-- Calendar Icon (Optional) -->
            <!-- If rescheduleData.showCalendarIcon is true -->
            <div class="flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.25 6.75H15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <!-- Text Content -->
            <div class="flex-grow">
                <p class="text-white text-base font-semibold text-wrap break-words">Your Design Workshop is now set for Thursday 17 July, at 5 PM</p>
            </div>

        </div>
      <p class="text-white text-lg font-bold text-wrap break-words">Thursday, 17 July</p>


        <!-- 2. Meetings Section (Vertical List Only) -->
        <!-- Condition: Renders if rescheduleData.meetings is present and not empty. -->
        <div class="flex flex-col gap-3">
            <!-- Meeting 1: Design Workshop (Example) -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 h-auto">
                <!-- Header Text (Optional) -->
                <!-- If meeting.headerText is present -->
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Meeting</span>
                <!-- Title and Time -->
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Design Workshop: Prototyping and User Flows for the New Feature Set</span>
                    <span class="text-white text-base flex-shrink-0">5:00 PM</span>
                </div>
                <!-- Location and Attendees -->
                <div class="flex justify-between items-center mt-2">
                    <span class="w-[71px] h-[32px] bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 text-wrap break-words">Starbucks</span>
                    <!-- Attendees Avatars (Optional) -->
                    <!-- If meeting.attendees is present and not empty -->
                    <div class="flex -space-x-2 overflow-hidden">
                        <img src="https://placehold.co/32x32/FF5733/FFFFFF?text=JD" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/33FF57/FFFFFF?text=AS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/5733FF/FFFFFF?text=LM" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <!-- Extra Attendees Count (Optional) -->
                        <!-- If meeting.extraAttendeesCount is present -->
                        <div class="w-8 h-8 rounded-full bg-[#333333] text-white text-xs flex items-center justify-center border-2 border-[#474747]">
                            +2
                        </div>
                    </div>
                </div>
                <!-- Agenda Card (Optional, nested within meeting card) -->
                <!-- Condition: Renders if meeting.agenda is present and not empty. -->
                <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                    <!-- Header -->
                    <div class="text-white text-base font-bold mb-1 text-wrap break-words">Agenda</div>
                    <!-- List of agenda items -->
                    <ul class="list-disc list-inside text-gray-300 text-sm">
                        <li class="text-wrap break-words">Go through moodboards and gather initial reactions.</li>
                        <li class="text-wrap break-words">Align on a clear direction for the next design sprint.</li>
                        <li class="text-wrap break-words">Discuss next steps and assign ownership for action items.</li>
                    </ul>
                </div>
            </div>

            <!-- Meeting 2: Family Event (Example) -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 h-auto">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Family Event</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Dinner with The Smiths</span>
                    <span class="text-white text-base flex-shrink-0">7:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="w-[71px] h-[32px] bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 text-wrap break-words">Home</span>
                    <div class="flex -space-x-2 overflow-hidden">
                        <img src="https://placehold.co/32x32/FFC300/000000?text=MS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/DAF7A6/000000?text=RS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                    </div>
                </div>
                <!-- No Agenda Card for this event -->
            </div>
        </div>

        <!-- 3. Meeting Details Button (Optional) -->
        <!-- Condition: Renders if rescheduleData.showDetailsButton is true. -->
        <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white">
            Meeting details
        </button>

    </div>
</body>
</html>
"`;

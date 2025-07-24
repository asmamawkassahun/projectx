export const daySummaryPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Day Summary</title>
    <!-- Tailwind CSS CDN for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Custom Font: Neue Haas Grotesk Display Pro -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <style>
        /* Custom CSS for body and font application */
        body {
            font-family: 'Neue Haas Grotesk Display Pro', sans-serif; /* Apply the custom font */
            background-color: #1a1a1a; /* Dark background for the body */
            display: flex; /* Use flexbox to center content */
            justify-content: center; /* Center horizontally */
            align-items: flex-start; /* Align items to the start of the cross-axis, allowing content to flow downwards */
            min-height: 100vh; /* Ensure body takes at least full viewport height */
            padding: 1.5rem; /* Padding around the main content container */
            overflow-y: auto; /* Enable vertical scrolling for the body if content overflows */
            overflow-x: hidden; /* Prevent horizontal scrolling for the entire body */
        }

        /*
           Removed the overly broad overflow rules from .main-day-summary-container > * and direct text elements.
           Tailwind's utility classes like 'break-words' and 'text-wrap' are more targeted and effective for this.
        */
    </style>
</head>
<body>
    <!-- Main Day Summary Container -->
    <!-- This div acts as the primary container for all day summary information. -->
    <!-- It's styled with Tailwind CSS for dark theme, rounded corners, shadow, and mobile responsiveness. -->
    <div id="daySummaryCard" class="main-day-summary-container p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
        <!-- Static Content based on the previous daySummaryData -->

        <!-- 1. Top Summary Section -->
        <div class="flex items-center gap-4">
            <!-- Calendar Icon SVG -->
           <div class="w-6 h-6 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.25 6.75H15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
            <!-- Text Content for Summary and Date -->
            <div class="flex-grow">
                <p class="text-white text-base font-semibold text-wrap break-words">You have two meetings and one family event today.</p>
            </div>
        </div>
        <p class="text-white text-lg font-bold text-wrap break-words">Thursday, 17 July</p>

        <!-- 2. Events Section (Always vertical stacking) -->
        <div class="flex flex-col gap-3">
            <!-- Event 1: Meeting with Agenda -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Meeting</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Design Workshop: Prototyping and User Flows for the New Feature Set</span>
                    <span class="text-white text-base flex-shrink-0">5:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Starbucks</span>
                    <div class="flex -space-x-2 overflow-hidden flex-shrink-0">
                        <img src="https://placehold.co/32x32/FF5733/FFFFFF?text=JD" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/33FF57/FFFFFF?text=AS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/5733FF/FFFFFF?text=LM" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <div class="w-8 h-8 rounded-full bg-[#333333] text-white text-xs flex items-center justify-center border-2 border-[#474747]">
                            +2
                        </div>
                    </div>
                </div>
                <!-- Agenda Card -->
                <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                    <div class="text-white text-base font-bold mb-1 text-wrap break-words">Agenda</div>
                    <ul class="list-disc list-inside text-gray-300 text-sm">
                        <li class="text-wrap break-words">Go through moodboards and gather initial reactions.</li>
                        <li class="text-wrap break-words">Align on a clear direction for the next design sprint.</li>
                        <li class="text-wrap break-words">Discuss next steps and assign ownership for action items.</li>
                    </ul>
                </div>
            </div>

            <!-- Event 2: Family Event (No Agenda) -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Family Event</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Dinner with The Smiths</span>
                    <span class="text-white text-base flex-shrink-0">7:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Home</span>
                    <div class="flex -space-x-2 overflow-hidden flex-shrink-0">
                        <img src="https://placehold.co/32x32/FFC300/000000?text=MS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/DAF7A6/000000?text=RS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                    </div>
                </div>
                <!-- No Agenda Card for this event -->
            </div>

            <!-- Event 3: Meeting with Agenda -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Meeting</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Project Sync-up</span>
                    <span class="text-white text-base flex-shrink-0">10:00 AM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Office</span>
                    <div class="flex -space-x-2 overflow-hidden flex-shrink-0">
                        <img src="https://placehold.co/32x32/C70039/FFFFFF?text=EM" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                    </div>
                </div>
                <!-- Agenda Card -->
                <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                    <div class="text-white text-base font-bold mb-1 text-wrap break-words">Agenda</div>
                    <ul class="list-disc list-inside text-gray-300 text-sm">
                        <li class="text-wrap break-words">Review sprint progress.</li>
                        <li class="text-wrap break-words">Address blockers.</li>
                        <li class="text-wrap break-words">Plan for next sprint.</li>
                    </ul>
                </div>
            </div>

            <!-- Event 4: Personal (No Attendees or Agenda) -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Personal</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Dentist Appointment</span>
                    <span class="text-white text-base flex-shrink-0">2:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Dental Clinic</span>
                    <div class="flex -space-x-2 overflow-hidden flex-shrink-0">
                        <!-- No attendees for this event -->
                    </div>
                </div>
                <!-- No Agenda Card for this event -->
            </div>
        </div>

        <!-- 3. Meeting Details Button -->
        <button class="w-full h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center gap-2.5">
            Meeting details
        </button>
    </div>
</body>
</html>
"`;

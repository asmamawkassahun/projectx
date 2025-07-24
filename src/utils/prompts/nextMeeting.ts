export const nextMeetingPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Card (Static)</title>
    <!-- Load Neue Haas Grotesk Display Pro font -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for font and overflow prevention */
        body {
            font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
        }
        /* Ensure text within the main content container prevents overflow */
        .meeting-card > * {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .meeting-card h1, .meeting-card h2, .meeting-card h3, .meeting-card h4, .meeting-card h5, .meeting-card h6,
        .meeting-card p, .meeting-card span, .meeting-card div {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>
<body class="bg-[#1a1a1a] flex justify-center items-start min-h-screen p-6">
    <div class="meeting-card p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[450px] flex flex-col gap-4">
        <!-- Card Header -->
        <div class="text-white text-xl font-bold mb-2">Upcoming Events</div>

        <!-- Next Meeting Header -->
        <div class="text-gray-400 text-base font-semibold">Next meeting</div>

        <!-- Meeting Details Section -->
        <div>
            <!-- Title and Time -->
            <div class="flex justify-between items-center">
                <span class="text-white text-xl font-bold">Design Workshop</span>
                <span class="text-white text-base">5:00 PM</span>
            </div>
            <!-- Location and Avatar -->
            <div class="flex justify-between items-center mt-2">
                <span class="bg-[#474747] text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2">Starbucks</span>
                <img class="w-10 h-10 rounded-full object-cover" src="https://placehold.co/40x40/000000/FFFFFF?text=JD" alt="Attendee Avatar" onerror="this.src='https://placehold.co/40x40/000000/FFFFFF?text=User'; this.alt='Placeholder Avatar';">
            </div>
        </div>

        <!-- Agenda Card -->
        <div class="bg-[#474747] rounded-xl p-4 flex flex-col gap-2">
            <div class="text-white text-lg font-bold mb-2">Agenda</div>
            <ul class="list-disc list-inside text-gray-300 text-base">
                <li>Go through moodboards</li>
                <li>Align on a direction</li>
                <li>Discuss next steps</li>
            </ul>
        </div>

        <!-- Resources Card -->
        <div class="bg-[#474747] rounded-xl p-4 flex flex-col gap-2">
            <div class="text-white text-lg font-bold mb-2">Resources</div>
            <div class="flex flex-wrap gap-3">
                <div class="bg-white/10 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 0H5.5C2.46 0 0 2.46 0 5.5V10.5C0 13.54 2.46 16 5.5 16H10.5C13.54 16 16 13.54 16 10.5V5.5C16 2.46 13.54 0 10.5 0ZM10.5 14H5.5C3.57 14 2 12.43 2 10.5V5.5C2 3.57 3.57 2 5.5 2H10.5C12.43 2 14 3.57 14 5.5V10.5C14 12.43 12.43 14 10.5 14ZM8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4Z"/>
                    </svg>
                    <span class="font-bold">Figma</span>
                </div>
                <div class="bg-white/10 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6Z"/>
                    </svg>
                    <span class="font-bold">Miro Board</span>
                </div>
                <div class="bg-white/10 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.99 2C4.68 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 7.99 2ZM8 12C5.79 12 4 10.21 4 8C4 5.79 5.79 4 8 4C10.21 4 12 5.79 12 8C12 10.21 10.21 12 8 12ZM8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11C9.66 11 11 9.66 11 8C11 6.34 9.66 5 8 5Z"/>
                    </svg>
                    <span class="font-bold">Google</span>
                </div>
            </div>
        </div>

        <!-- Meeting Details Button -->
        <button class="w-full h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg hover:bg-white/80 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2.5">Meeting details</button>
    </div>
</body>
</html>
"`;

export const resheduleMeetingPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents
"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reschedule Summary</title>
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

        /* Apply text overflow properties to direct children of the main content container */
        .main-day-summary-container > * {
            overflow: hidden; /* Hide overflowing content */
            word-wrap: break-word; /* Break long words to prevent overflow */
            overflow-wrap: break-word; /* Ensure words break correctly */
        }

        /* Apply text overflow properties to specific text elements within the main container */
        .main-day-summary-container h1,
        .main-day-summary-container h2,
        .main-day-summary-container h3,
        .main-day-summary-container p,
        .main-day-summary-container span,
        .main-day-summary-container div {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>
<body>
    <!-- Main Day Summary Container -->
    <!-- This div acts as the primary container for all day summary information. -->
    <!-- It's styled with Tailwind CSS for dark theme, rounded corners, shadow, and mobile responsiveness. -->
    <div id="daySummaryCard" class="main-day-summary-container p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">

        <!-- 1. Top Reschedule Summary Section -->
        <!-- This section renders if rescheduleData.rescheduleSummaryText is present. -->
        <div class="flex items-center gap-4">
            <!-- Calendar Icon (Optional): This icon renders if rescheduleData.showCalendarIcon is true. -->
           <div class="w-6 h-6">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.25 6.75H15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
            <!-- Text Content for Summary and Date -->
            <div>
                <p class="text-white text-base font-semibold">Your Design Workshop is now set for Thursday 17 July, at 5 PM</p>
                <p class="text-white text-lg font-bold">Thursday, 17 July</p>
            </div>
        </div>

        <!-- 2. Meetings Section (Vertical List Only) -->
        <!-- This section renders if rescheduleData.meetings is present and not empty. -->
        <div class="flex flex-col gap-3">
            <!-- Meeting Card 1: Design Workshop -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <!-- Header Text (type): This span renders if meeting.type is present. -->
                <span class="text-gray-300 text-sm font-semibold">Meeting</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold">Design Workshop: Prototyping and User Flows for the New Feature Set</span>
                    <span class="text-white text-base max-w-12">5:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2">Starbucks</span>
                    <!-- Attendees Avatars (Optional): This div renders if meeting.attendees is present and not empty. -->
                    <div class="flex -space-x-2 overflow-hidden">
                        <img src="https://placehold.co/32x32/FF5733/FFFFFF?text=JD" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/33FF57/FFFFFF?text=AS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/5733FF/FFFFFF?text=LM" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <!-- Extra Attendees Count (Optional): This div renders if meeting.extraAttendeesCount is present. -->
                        <div class="w-8 h-8 rounded-full bg-[#333333] text-white text-xs flex items-center justify-center border-2 border-[#474747]">
                            +2
                        </div>
                    </div>
                </div>
                <!-- Agenda Card (Optional): This div renders if meeting.agenda is present and not empty. -->
                <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                    <div class="text-white text-base font-bold mb-1">Agenda</div>
                    <ul class="list-disc list-inside text-gray-300 text-sm">
                        <li>Go through moodboards and gather initial reactions.</li>
                        <li>Align on a clear direction for the next design sprint.</li>
                        <li>Discuss next steps and assign ownership for action items.</li>
                    </ul>
                </div>
            </div>

            <!-- Meeting Card 2: Dinner with The Smiths -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <!-- Header Text (type): This span renders if meeting.type is present. -->
                <span class="text-gray-300 text-sm font-semibold">Family Event</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold">Dinner with The Smiths</span>
                    <span class="text-white text-base">7:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2">Home</span>
                    <!-- Attendees Avatars (Optional): This div renders if meeting.attendees is present and not empty. -->
                    <div class="flex -space-x-2 overflow-hidden">
                        <img src="https://placehold.co/32x32/FFC300/000000?text=MS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                        <img src="https://placehold.co/32x32/DAF7A6/000000?text=RS" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                    </div>
                    <!-- Extra Attendees Count (Optional): This div renders if meeting.extraAttendeesCount is present. -->
                    <!-- No extra attendees for this event in the sample data, so this would be omitted. -->
                </div>
                <!-- Agenda Card (Optional): This div renders if meeting.agenda is present and not empty. -->
                <!-- No agenda for this event in the sample data, so this would be omitted. -->
            </div>

            <!-- Meeting Card 3: Project Sync-up -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <!-- Header Text (type): This span renders if meeting.type is present. -->
                <span class="text-gray-300 text-sm font-semibold">Meeting</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold">Project Sync-up</span>
                    <span class="text-white text-base">10:00 AM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2">Office</span>
                    <!-- Attendees Avatars (Optional): This div renders if meeting.attendees is present and not empty. -->
                    <div class="flex -space-x-2 overflow-hidden">
                        <img src="https://placehold.co/32x32/C70039/FFFFFF?text=EM" alt="Attendee Avatar" class="w-8 h-8 rounded-full border-2 border-[#474747] object-cover">
                    </div>
                    <!-- Extra Attendees Count (Optional): This div renders if meeting.extraAttendeesCount is present. -->
                    <!-- No extra attendees for this event in the sample data, so this would be omitted. -->
                </div>
                <!-- Agenda Card (Optional): This div renders if meeting.agenda is present and not empty. -->
                <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                    <div class="text-white text-base font-bold mb-1">Agenda</div>
                    <ul class="list-disc list-inside text-gray-300 text-sm">
                        <li>Review sprint progress.</li>
                        <li>Address blockers.</li>
                        <li>Plan for next sprint.</li>
                    </ul>
                </div>
            </div>

            <!-- Meeting Card 4: Dentist Appointment -->
            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-full h-auto">
                <!-- Header Text (type): This span renders if meeting.type is present. -->
                <span class="text-gray-300 text-sm font-semibold">Personal</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold">Dentist Appointment</span>
                    <span class="text-white text-base">2:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2">Dental Clinic</span>
                    <!-- Attendees Avatars (Optional): This div renders if meeting.attendees is present and not empty. -->
                    <!-- No attendees for this event in the sample data, so this would be omitted. -->
                    <!-- Extra Attendees Count (Optional): This div renders if meeting.extraAttendeesCount is present. -->
                    <!-- No extra attendees for this event in the sample data, so this would be omitted. -->
                </div>
                <!-- Agenda Card (Optional): This div renders if meeting.agenda is present and not empty. -->
                <!-- No agenda for this event in the sample data, so this would be omitted. -->
            </div>
        </div>

        <!-- 3. Meeting Details Button (Optional) -->
        <!-- This button renders if rescheduleData.showDetailsButton is true. -->
        <button class="w-full h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center gap-2.5">
            Meeting details
        </button>
    </div>
</body>
</html>
"`;

export const setMeetingPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents
"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Set a Meeting</title>
    <!-- Custom Font: Neue Haas Grotesk Display Pro -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Font Awesome for icons (not directly used by this prompt, but included for consistency if other prompts use it) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
        .main-set-meeting-container > *,
        .main-set-meeting-container h1,
        .main-set-meeting-container h2,
        .main-set-meeting-container h3,
        .main-set-meeting-container p,
        .main-set-meeting-container span,
        .main-set-meeting-container div {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>
<body>

    <!-- Main Set Meeting Container -->
    <!-- This div is the primary container for the set meeting information. -->
    <!-- All content is statically rendered here. -->
    <div id="main-set-meeting-container" class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-full flex flex-col gap-4">

        <!-- 1. Top Summary Section -->
        <!-- Condition: Renders if setMeetingData.summaryText is present. -->
        <div class="flex items-center gap-4">
            <!-- Calendar Icon (Optional) -->
            <!-- If setMeetingData.showCalendarIcon is true -->
            <div class="flex-shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M66.6667 13.3333H13.3333C9.65147 13.3333 6.66667 16.3181 6.66667 20V66.6667C6.66667 70.3485 9.65147 73.3333 13.3333 73.3333H66.6667C70.3485 73.3333 73.3333 70.3485 73.3333 66.6667V20C73.3333 16.3181 70.3485 13.3333 66.6667 13.3333Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M53.3333 3.33331V20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M26.6667 3.33331V20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.66667 33.3333H73.3333" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <!-- Text Content -->
            <p class="text-white text-base font-semibold text-wrap break-words">Your Coffee meeting with Gustavo is set for Thursday 17 July, at 5 PM</p>
        </div>

        <!-- 2. Meeting Details Section (Optional) -->
        <!-- Condition: Renders if setMeetingData.meetingDetails is present. -->
        <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2">
            <!-- Header Text (Optional) -->
            <!-- If meetingDetails.headerText is present -->
            <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Next meeting</span>
            <!-- Title and Time -->
            <div class="flex justify-between items-center">
                <span class="text-white text-lg font-bold text-wrap break-words pr-2">Coffee with Gustavo</span>
                <span class="text-white text-base flex-shrink-0">5:00 PM</span>
            </div>
            <!-- Location and Attendee -->
            <div class="flex justify-between items-center mt-2">
                <span class="w-[71px] h-[32px] bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 text-wrap break-words">Starbucks</span>
                <img src="https://placehold.co/40x40/FF5733/FFFFFF?text=GP" alt="Attendee Avatar" class="w-10 h-10 rounded-full object-cover">
            </div>
        </div>

        <!-- 3. Map Card (Optional) -->
        <!-- Condition: Renders if setMeetingData.showMapCard is true. -->
        <div class="bg-white/10 rounded-xl p-0 overflow-hidden relative min-h-[200px]">
            <!-- Map img -->
            <img src="https://placehold.co/600x300/606060/FFFFFF?text=Map+Image" alt="Map Image" class="w-full h-full object-cover rounded-xl">
            <!-- Centered Map Pin Icon Overlay -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white text-shadow-lg">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="white"/>
                    <path d="M22 2C13.1634 2 6 9.16344 6 18C6 27.5 22 42 22 42C22 42 38 27.5 38 18C38 9.16344 30.8366 2 22 2ZM22 24C18.6863 24 16 21.3137 16 18C16 14.6863 18.6863 12 22 12C25.3137 12 28 14.6863 28 18C28 21.3137 25.3137 24 22 24Z" fill="#333333"/>
                </svg>
                <span class="text-lg font-bold">Starbucks</span>
            </div>
        </div>

        <!-- 4. Meeting Details Button (Optional) -->
        <!-- Condition: Renders if setMeetingData.showDetailsButton is true. -->
        <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white">
            Meeting details
        </button>

    </div>
</body>
</html>
"`;
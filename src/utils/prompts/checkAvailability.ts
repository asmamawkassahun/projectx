export const myAvailability = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share My Availability</title>
    <!-- Custom Font: Neue Haas Grotesk Display Pro -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Font Awesome for icons (if needed, though prompt specifies SVGs) -->
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
        .main-share-availability-container > *,
        .main-share-availability-container h1,
        .main-share-availability-container h2,
        .main-share-availability-container h3,
        .main-share-availability-container p,
        .main-share-availability-container span,
        .main-share-availability-container div {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>
<body>

    <!-- Main Share Availability Container -->
    <!-- This div is the primary container for the share availability information. -->
    <!-- All content is statically rendered here. -->
    <div id="main-share-availability-container" class="rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-full flex flex-col gap-4">

        <!-- 1. Top Summary Section -->
        <!-- Condition: Renders if shareAvailabilityData.summaryText is present. -->
        <div class="flex items-start gap-4">
            <!-- Calendar Icon (Optional) -->
            <!-- If shareAvailabilityData.showCalendarIcon is true -->
            <div class="flex-shrink-0">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.6667 7.33331H7.33333C5.55072 7.33331 4.08333 8.79998 4.08333 10.5833V36.6666C4.08333 38.4499 5.55072 39.9166 7.33333 39.9166H36.6667C38.4493 39.9166 39.9167 38.4499 39.9167 36.6666V10.5833C39.9167 8.79998 38.4493 7.33331 36.6667 7.33331Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M33 2.58331V10.5833" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 2.58331V10.5833" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.08333 18.5833H39.9167" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <!-- Text Content -->
            <p class="text-white text-base font-semibold ml-2 text-wrap break-words">I've shared your availability across the week with Gustavo</p>
        </div>

        <!-- 2. Availability Section (Optional) -->
        <!-- Condition: Renders if shareAvailabilityData.availability is present and not empty. -->
        <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-3">
            <!-- Day: Wednesday -->
            <span class="text-white text-lg font-bold text-wrap break-words">Wednesday</span>
            <div class="flex flex-wrap gap-2">
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">18:30</div>
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">19:00</div>
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">19:30</div>
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">20:00</div>
            </div>

            <!-- Day: Thursday -->
            <span class="text-white text-lg font-bold text-wrap break-words">Thursday</span>
            <div class="flex flex-wrap gap-2">
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">09:00</div>
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">09:30</div>
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">10:00</div>
            </div>

            <!-- Day: Friday -->
            <span class="text-white text-lg font-bold text-wrap break-words">Friday</span>
            <div class="flex flex-wrap gap-2">
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">14:00</div>
                <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">14:30</div>
            </div>
        </div>

        <!-- 3. Reply Card (Optional) -->
        <!-- Condition: Renders if shareAvailabilityData.replyCard is present. -->
        <div class="bg-white/10 rounded-xl p-4 flex items-start gap-4">
            <!-- Left: Sender Profile Picture/Avatar/Initial -->
            <div class="flex-shrink-0">
                <!-- If shareAvailabilityData.replyCard.senderProfilePictureUrl is present: -->
                <img src="https://placehold.co/40x40/33FF57/FFFFFF?text=GP" alt="Sender Avatar" class="w-10 h-10 rounded-full object-cover">
                <!-- Else if shareAvailabilityData.replyCard.senderAvatarSvg is present: -->
                <!-- <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#FF5733"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20">G</text></svg> -->
                <!-- Else (no profile picture or avatar SVG), display sender's name as a circular initial: -->
                <!-- <div class="w-10 h-10 rounded-full bg-[#333333] text-white text-base flex items-center justify-center">G</div> -->
            </div>
            <div class="flex-grow">
                <!-- Sender Name -->
                <div class="text-white text-base font-bold text-wrap break-words">Gustavo Paris</div>
                <!-- Reply Text -->
                <p class="text-gray-300 text-sm whitespace-pre-wrap text-wrap break-words">Sorry I can't make it<br>Hi Gus, I'll have to take a rain check on todays coffee meet. Maybe we can reschedule for another weekend?</p>
                <!-- Received Status -->
                <div class="flex items-center gap-1 text-gray-400 text-sm mt-2">
                    <!-- Double tick SVG icon -->
                    <svg width="22" height="13" viewBox="0 0 22 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5 0.5L8.5 11.5L2.5 5.5" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.5 0.5L11.5 1.5L10.5 0.5" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Received: Yesterday, 3:31 PM</span>
                </div>
            </div>
        </div>

    </div>
</body>
</html>
"`;

export const calendarPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Purpose UI</title>
    <!-- Custom Font: Neue Haas Grotesk Display Pro -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for body and font application */
        body {
            font-family: "Neue Haas Grotesk Display Pro", Arial, sans-serif;
        }
        /* Custom CSS for product and map images */
        .product-image-container img,
        .tracking-map-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1rem; /* Apply border-radius here as well for consistency */
        }
        /* Custom CSS for text overflow, as specified in multiple prompts */
        .main-container-common > *,
        .main-container-common h1,
        .main-container-common h2,
        .main-container-common h3,
        .main-container-common p,
        .main-container-common span,
        .main-container-common div {
            overflow: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        /* Specific rule for horizontal scrolling in Day Summary */
        .events-horizontal-scroll {
            white-space: nowrap; /* Ensures items stay in one line */
            overflow-x: auto; /* Enables horizontal scrolling */
            -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
        }
        .events-horizontal-scroll::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome, Safari, Edge */
        }
        .events-horizontal-scroll > div {
            display: inline-block; /* Makes children behave like inline-block for horizontal layout */
        }
    </style>
</head>
<body class="flex justify-center items-start min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main Multi-Purpose UI Container -->
    <!-- This container will hold all the different UI scenarios, with each scenario commented out -->
    <!-- to represent conditional rendering without JavaScript. -->
    <div id="main-multi-purpose-container" class="container w-full max-w-[450px] flex flex-col gap-4 p-6 rounded-[1.5rem] bg-[#222222] shadow-xl main-container-common">

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: CONNECT AN ACCOUNT (from prompt-2.pdf, Page 1) -->
        <!-- This section would render if calendarData is present. -->
        <!-- ==================================================================================================== -->
        
        <div class="p-6 rounded-[24px] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[360px] min-h-[386px] flex flex-col items-start gap-6 pt-6 pr-4 pb-6 pl-4">
            <div class="flex items-center gap-4 text-white text-xl font-semibold">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M66.6667 13.3333H13.3333C9.65147 13.3333 6.66667 16.3181 6.66667 20V66.6667C6.66667 70.3485 9.65147 73.3333 13.3333 73.3333H66.6667C70.3485 73.3333 73.3333 70.3485 73.3333 66.6667V20C73.3333 16.3181 70.3485 13.3333 66.6667 13.3333Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M53.3333 3.33331V20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M26.6667 3.33331V20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.66667 33.3333H73.3333" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-wrap break-words">Connect your calendar account to own your meetings and productivity</span>
            </div>

            <div class="bg-[#474747] rounded-[24px] flex-shrink-0 mx-auto w-[280px] h-[280px]">
                <!-- Placeholder Box (Large variant example) -->
            </div>

            <button class="w-[328px] h-[48px] bg-white text-black px-3 py-3 rounded-full font-semibold text-lg hover:bg-white/80 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2.5">
                Add a calendar account
            </button>
        </div>
        

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: NEXT MEETING (from prompt-2.pdf, Pages 2-4) -->
        <!-- This section would render if meetingData is present. -->
        <!-- ==================================================================================================== -->
        <!--
        <div class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
            <div class="text-white text-xl font-bold mb-2">Upcoming Events</div>

            <div class="text-gray-400 text-base font-semibold">Next meeting</div>

            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <span class="text-white text-xl font-bold text-wrap break-words pr-2">Design Workshop</span>
                    <span class="text-white text-base flex-shrink-0">5:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="w-[71px] h-[32px] bg-[#474747] text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Starbucks</span>
                    <img src="https://placehold.co/40x40/FF5733/FFFFFF?text=JD" alt="Attendee Avatar" class="w-10 h-10 rounded-full object-cover flex-shrink-0">
                </div>
            </div>

            <div class="bg-[#474747] rounded-xl p-4 flex flex-col gap-2">
                <div class="text-white text-lg font-bold mb-2">Agenda</div>
                <ul class="list-disc list-inside text-gray-300 text-base">
                    <li class="text-wrap break-words">Go through moodboards</li>
                    <li class="text-wrap break-words">Align on a direction</li>
                    <li class="text-wrap break-words">Discuss next steps</li>
                </ul>
            </div>

            <div class="bg-[#474747] rounded-xl p-4 flex flex-col gap-2">
                <div class="text-white text-lg font-bold mb-2">Resources</div>
                <div class="flex flex-wrap gap-3">
                    <div class="bg-white/10 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.9167 1.33331H3.08333C2.37896 1.33331 1.83333 1.87894 1.83333 2.58331V13.4166C1.83333 14.121 2.37896 14.6666 3.08333 14.6666H12.9167C13.621 14.6666 14.1667 14.121 14.1667 13.4166V2.58331C14.1667 1.87894 13.621 1.33331 12.9167 1.33331Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.5 1.33331V14.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10.5 1.33331V14.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.83333 6.5H14.1667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.83333 9.5H14.1667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="font-bold">Figma</span>
                    </div>
                    <div class="bg-white/10 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.9167 1.33331H3.08333C2.37896 1.33331 1.83333 1.87894 1.83333 2.58331V13.4166C1.83333 14.121 2.37896 14.6666 3.08333 14.6666H12.9167C13.621 14.6666 14.1667 14.121 14.1667 13.4166V2.58331C14.1667 1.87894 13.621 1.33331 12.9167 1.33331Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.5 1.33331V14.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10.5 1.33331V14.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.83333 6.5H14.1667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.83333 9.5H14.1667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="font-bold">Miro Board</span>
                    </div>
                </div>
            </div>

            <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center gap-2.5">
                Meeting details
            </button>
        </div>
        -->

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: DAY SUMMARY (from prompt-2.pdf, Pages 5-7) -->
        <!-- This section would render if daySummaryData is present. -->
        <!-- ==================================================================================================== -->
        <!--
        <div class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <div class="w-6 h-6 flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.25 6.75H15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="flex-grow">
                    <p class="text-white text-base font-semibold text-wrap break-words">You have two meetings and one family event today.</p>
                    <p class="text-white text-lg font-bold text-wrap break-words">Thursday, 17 July</p>
                </div>
            </div>

            <div class="flex flex-col gap-3">
            -->
                <!-- Example Event Card (Vertical Layout - if no agenda or all events without agenda) -->
                <!--
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
                </div>
                -->
                <!-- Example Event Card (Horizontal Layout - if any event has an agenda) -->
                <!--
                <div class="events-horizontal-scroll flex gap-3 pb-2">
                    <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-80 h-auto">
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
                        <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                            <div class="text-white text-base font-bold mb-1 text-wrap break-words">Agenda</div>
                            <ul class="list-disc list-inside text-gray-300 text-sm">
                                <li class="text-wrap break-words">Go through moodboards and gather initial reactions.</li>
                                <li class="text-wrap break-words">Align on a clear direction for the next design sprint.</li>
                                <li class="text-wrap break-words">Discuss next steps and assign ownership for action items.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2 flex-shrink-0 w-80 h-auto">
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
                        <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                            <div class="text-white text-base font-bold mb-1 text-wrap break-words">Agenda</div>
                            <ul class="list-disc list-inside text-gray-300 text-sm">
                                <li class="text-wrap break-words">Review sprint progress.</li>
                                <li class="text-wrap break-words">Address blockers.</li>
                                <li class="text-wrap break-words">Plan for next sprint.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white">
                Meeting details
            </button>
        </div>
        -->

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: RESCHEDULE (from prompt-2.pdf, Pages 7-8) -->
        <!-- This section would render if rescheduleData is present. -->
        <!-- ==================================================================================================== -->
        <!--
        <div class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <div class="w-6 h-6 flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.25 6.75H15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="flex-grow">
                    <p class="text-white text-base font-semibold text-wrap break-words">Your Design Workshop is now set for Thursday 17 July, at 5 PM</p>
                    <p class="text-white text-lg font-bold text-wrap break-words">Thursday, 17 July</p>
                </div>
            </div>

            <div class="flex flex-col gap-3">
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
                    <div class="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-1">
                        <div class="text-white text-base font-bold mb-1 text-wrap break-words">Agenda</div>
                        <ul class="list-disc list-inside text-gray-300 text-sm">
                            <li class="text-wrap break-words">Go through moodboards and gather initial reactions.</li>
                            <li class="text-wrap break-words">Align on a clear direction for the next design sprint.</li>
                            <li class="text-wrap break-words">Discuss next steps and assign ownership for action items.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center gap-2.5">
                Meeting details
            </button>
        </div>
        -->

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: SET A MEETING (from prompt-2.pdf, Pages 9-10) -->
        <!-- This section would render if setMeetingData is present. -->
        <!-- ==================================================================================================== -->
        <!--
        <div class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M66.6667 13.3333H13.3333C9.65147 13.3333 6.66667 16.3181 6.66667 20V66.6667C6.66667 70.3485 9.65147 73.3333 13.3333 73.3333H66.6667C70.3485 73.3333 73.3333 70.3485 73.3333 66.6667V20C73.3333 16.3181 70.3485 13.3333 66.6667 13.3333Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M53.3333 3.33331V20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M26.6667 3.33331V20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.66667 33.3333H73.3333" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-white text-base font-semibold text-wrap break-words">Your Coffee meeting with Gustavo is set for Thursday 17 July, at 5 PM</p>
            </div>

            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-2">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Next meeting</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Coffee with Gustavo</span>
                    <span class="text-white text-base flex-shrink-0">5:00 PM</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="w-[71px] h-[32px] bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Starbucks</span>
                    <img src="https://placehold.co/40x40/FF5733/FFFFFF?text=GP" alt="Attendee Avatar" class="w-10 h-10 rounded-full object-cover flex-shrink-0">
                </div>
            </div>

            <div class="bg-white/10 rounded-xl p-0 overflow-hidden relative min-h-[200px]">
                <img src="https://placehold.co/600x300/606060/FFFFFF?text=Map+Image" alt="Map Image" class="w-full h-full object-cover rounded-xl">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white text-shadow-lg">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="22" cy="22" r="22" fill="white"/>
                        <path d="M22 2C13.1634 2 6 9.16344 6 18C6 27.5 22 42 22 42C22 42 38 27.5 38 18C38 9.16344 30.8366 2 22 2ZM22 24C18.6863 24 16 21.3137 16 18C16 14.6863 18.6863 12 22 12C25.3137 12 28 14.6863 28 18C28 21.3137 25.3137 24 22 24Z" fill="#333333"/>
                    </svg>
                    <span class="text-lg font-bold">Starbucks</span>
                </div>
            </div>

            <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white">
                Meeting details
            </button>
        </div>
        -->

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: CANCEL A MEETING (from prompt-2.pdf, Pages 10-12) -->
        <!-- This section would render if cancelMeetingData is present. -->
        <!-- ==================================================================================================== -->
        <!--
        <div class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
            <div class="flex items-start gap-4">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.6667 7.33331H7.33333C5.55072 7.33331 4.08333 8.79998 4.08333 10.5833V36.6666C4.08333 38.4499 5.55072 39.9166 7.33333 39.9166H36.6667C38.4493 39.9166 39.9167 38.4499 39.9167 36.6666V10.5833C39.9167 8.79998 38.4493 7.33331 36.6667 7.33331Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M33 2.58331V10.5833" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 2.58331V10.5833" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.08333 18.5833H39.9167" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-white text-base font-semibold ml-2 text-wrap break-words">I've let Gustavo know you can't make it for the Coffee meeting today</p>
            </div>

            <div class="bg-white/10 rounded-xl p-4 flex flex-col">
                <span class="text-gray-300 text-sm font-semibold text-wrap break-words">Meeting</span>
                <div class="flex justify-between items-center">
                    <span class="text-white text-lg font-bold text-wrap break-words pr-2">Coffee with Gustavo</span>
                    <span class="text-gray-400 text-base flex-shrink-0">Cancelled</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="bg-white/10 text-white px-2 py-1 rounded-md text-sm flex items-center justify-center gap-2 flex-shrink-0 text-wrap break-words">Starbucks</span>
                    <img src="https://placehold.co/40x40/FF5733/FFFFFF?text=GP" alt="Attendee Avatar" class="w-10 h-10 rounded-full object-cover flex-shrink-0">
                </div>
            </div>

            <div class="bg-white/10 rounded-xl p-4 flex items-start gap-4">
                <div class="flex-shrink-0">
                    <img src="https://placehold.co/40x40/33FF57/FFFFFF?text=GS" alt="Sender Avatar" class="w-10 h-10 rounded-full object-cover">
                </div>
                <div>
                    <div class="text-white text-base font-bold text-wrap break-words">Gustavo Paris</div>
                    <p class="text-gray-300 text-sm whitespace-pre-wrap text-wrap break-words">Sorry I can't make it
Hi Gus, I'll have to take a rain check on todays coffee meet. Maybe we can reschedule for another weekend?</p>
                    <span class="text-gray-400 text-xs text-wrap break-words">Received: Yesterday, 3:31 PM</span>
                </div>
            </div>

            <button class="w-[328px] h-[46px] bg-white text-black px-2 py-3 rounded-full font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2.5 hover:bg-black hover:text-white">
                View availability
            </button>
        </div>
        -->

        <!-- ==================================================================================================== -->
        <!-- SCENARIO: SHARE MY AVAILABILITY (from prompt-2.pdf, Pages 12-13) -->
        <!-- This section would render if shareAvailabilityData is present. -->
        <!-- ==================================================================================================== -->
        <!--
        <div class="p-6 rounded-[1.5rem] bg-[#333333] shadow-lg shadow-black/30 w-full max-w-[400px] flex flex-col gap-4">
            <div class="flex items-start gap-4">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 0.75V3.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.25 6.75H15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-white text-base font-semibold ml-2 text-wrap break-words">A p with text-white text-base font-semibold ml-2. Displays [summaryText] from shareAvailabilityData.summaryText. This text will be on the right of the icon.</p>
            </div>

            <div class="bg-white/10 rounded-xl p-4 flex flex-col gap-3">
                <span class="text-white text-lg font-bold text-wrap break-words">Wednesday</span>
                <div class="flex flex-wrap gap-2">
                    <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">18:30</div>
                    <div class="w-[45px] h-[32px] bg-white/10 rounded-[8px] px-2 py-1 text-white text-sm font-semibold flex items-center justify-center">19:00</div>
                </div>
            </div>

            <div class="bg-white/10 rounded-xl p-4 flex items-start gap-4">
                <div class="flex-shrink-0">
                    <img src="https://placehold.co/40x40/33FF57/FFFFFF?text=GS" alt="Sender Avatar" class="w-10 h-10 rounded-full object-cover">
                </div>
                <div>
                    <div class="text-white text-base font-bold text-wrap break-words">Gustavo Paris</div>
                    <p class="text-gray-300 text-sm whitespace-pre-wrap text-wrap break-words">Sorry I can't make it
Hi Gus, I'll have to take a rain check on todays coffee meet. Maybe we can reschedule for another weekend?</p>
                    <span class="text-gray-400 text-xs text-wrap break-words">Received: Yesterday, 3:31 PM</span>
                </div>
            </div>
        </div>
        -->

    </div>
</body>
</html>
"`;

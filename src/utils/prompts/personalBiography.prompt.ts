 export const  personalBiographyPrompt=  `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
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
    <div id="profile-card" class="w-full max-w-full flex flex-col gap-4 p-5 rounded-[1.5rem] bg-white/10 shadow-xl">

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
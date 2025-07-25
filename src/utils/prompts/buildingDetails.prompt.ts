export const buildingDetailsPrompt = `You are an expert HTML developer. Your task is to carefully analyze the provided data and the given HTML template. Extract all necessary information from the data to populate the template. Then, generate the *exact* HTML code from the template, but with all placeholder variables replaced by the real data you extracted. try to get the building image and if u fail or can't get the image for the building mentioned use this placeholder image https://i.ibb.co/V0VSQYyF/placeholderr.png in an img tag with alt="Building image". Ensure no template variables (e.g., \`\${variableName}\`) remain in the final HTML output.
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burj Khalifa Details</title>
    <!-- Font Import -->
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Global Styles */
        body {
            font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
            background-color: #333; /* Dark background for contrast with the card */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            box-sizing: border-box;
            padding: 20px; /* Add some padding for smaller screens */
        }

        /* Main Container Card */
        .container {
            background-color: rgba(255, 255, 255, 0.1); /* White with 10% opacity */
            backdrop-filter: blur(10px); /* Blur effect */
            border-radius: 1.5rem;
            padding: 20px;
            width: 100%; /* Full width on small screens */
            max-width: full; /* Max width for larger screens */
            color: #fff;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        /* Header Section */
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .header-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 15px;
            background-color: #555; /* Placeholder background */
            flex-shrink: 0; /* Prevent shrinking on smaller screens */
        }

        .header-text {
            font-size: 1.1em;
            line-height: 1.4;
            flex-grow: 1;
        }

        /* Main Image Section */
        .main-image {
            width: 100%;
            border-radius: 15px;
            margin-bottom: 20px;
            object-fit: cover;
            height: 200px; /* Fixed height for consistency */
            display: block; /* Ensures it behaves like a block element */
        }

        /* Quick Info Section (Floor & Height) */
        .quick-info {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            flex-wrap: wrap; /* Allow items to wrap on smaller screens */
        }

        .info-item {
            text-align: center;
            flex: 1; /* Distribute space evenly */
            min-width: 120px; /* Minimum width before wrapping */
            margin: 10px 0; /* Add vertical margin for wrapped items */
        }

        .info-label {
            font-size: 0.9em;
            color: #ccc;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 2.2em;
            font-weight: bold;
        }

        /* Detailed Info Section (Cards) */
        .detailed-info .card {
            background-color: rgba(255, 255, 255, 0.15); /* Slightly more opaque for inner cards */
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .detailed-info .card-label {
            font-size: 1em;
            color: #ccc;
        }

        .detailed-info .card-value {
            font-size: 1.1em;
            font-weight: bold;
        }

        /* Note: The .view-details-button custom CSS is removed as Tailwind classes will be used directly on the button element. */

        /* Responsive adjustments */
        @media (max-width: 480px) {
            .header-text {
                font-size: 1em;
            }
            .info-value {
                font-size: 1.8em;
            }
        }
    </style>
</head>
<body>
    <!-- Main container card -->
    <div class="container">
        <!-- Header section with an icon and text description -->
        <div class="header">
            <!-- Placeholder for header icon. The browser will show a broken image icon if the link is invalid. -->
            <img src="\${headerIconLink}" alt="Building Icon" class="header-icon">
            <!-- Placeholder for the building's description -->
            <p class="header-text">\${buildingDescription}</p>
        </div>

        <!-- Main image of the building -->
        <!-- Please add the building image here-->
           <img src="\${buildingImageLink}" alt="Building image" class="main-image">
          



        <!-- Section displaying quick information like Floor and Height -->
        <div class="quick-info">
            <div class="info-item">
                <div class="info-label">Floor</div>
                <!-- Placeholder for quick floor value -->
                <div class="info-value">\${quickFloorValue}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Height</div>
                <!-- Placeholder for quick height value -->
                <div class="info-value">\${quickHeightValue}</div>
            </div>
        </div>

        <!-- Section for more detailed information cards -->
        <div class="detailed-info">
            <div class="card">
                <span class="card-label">Height</span>
                <!-- Placeholder for detailed height value -->
                <span class="card-value">\${detailHeightValue}</span>
            </div>
            <div class="card">
                <span class="card-label">Floors</span>
                <!-- Placeholder for detailed floors value -->
                <span class="card-value">\${detailFloorsValue}</span>
            </div>
            <div class="card">
                <span class="card-label">Elevators</span>
                <!-- Placeholder for detailed elevators value -->
                <span class="card-value">\${detailElevatorsValue}</span>
            </div>
        </div>

        <!-- Button to view more details -->
        <!-- Tailwind classes applied for styling: full width, padding, background color, text color, rounded corners, font weight, and hover effect -->
        <button class="w-full py-4 bg-white text-black rounded-full font-semibold mt-5 hover:bg-white-700 transition-colors duration-300">View details</button>
    </div>
</body>
</html>
`;
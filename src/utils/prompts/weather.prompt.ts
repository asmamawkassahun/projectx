export const weatherPrompt = ` You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
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
      class="weather-card w-full max-w-md mx-auto rounded-[1.5rem] shadow-lg text-white">
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

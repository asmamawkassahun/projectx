export const sportPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{home_team_name}} vs {{away_team_name}} - Match Stats</title>
    <!-- Google Fonts - Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .gradient-header {
            background: linear-gradient(to right, {{home_team_logo_color}}, {{away_team_logo_color}}); /* Team logo colors */
        }
        .stat-item-bg {
            background-color: #333333;
        }
        .team-logo img, .player-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    </style>
</head>
<body class="flex justify-center items-center m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main UI Container for Match Stats Card -->
    <div id="match-stats-card" class="w-full max-w-full flex flex-col gap-4 rounded-[1.5rem] bg-white/10 shadow-xl">

        <!-- Combined Header Section (Player and Match) -->
        <div class="gradient-header rounded-t-[1.5rem]">
            <!-- Player Header Section -->
            <div class="flex items-center gap-3 p-5 pb-0">
                <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 player-avatar">
                    <img src="{{player_image}}" alt="{{player_name}} Avatar">
                </div>
                <div class="flex">
                    <p class="text-white text-lg font-semibold">{{player_name with description of his activity in that game}}</p>
                </div>
            </div>

            <!-- Match Score Section -->
            <div class="p-5 flex flex-col items-center justify-center">
                <div class="flex justify-between items-center w-full max-w-[300px] mb-4">
                    <!-- Home Team Section -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center team-logo">
                            <img src="{{home_team_logo}}" alt="{{home_team_name}} Logo">
                        </div>
                        <p class="text-white text-sm font-medium">{{home_team_name}}</p>
                    </div>

                    <!-- Score and Status Section -->
                    <div class="flex flex-col items-center">
                        <p class="text-white text-5xl font-bold">{{home_team_score}} - {{away_team_score}}</p>
                        <p class="text-gray-300 text-sm font-medium">{{match_status}} ({{match_date}})</p>
                    </div>

                    <!-- Away Team Section -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center team-logo">
                            <img src="{{away_team_logo}}" alt="{{away_team_name}} Logo">
                        </div>
                        <p class="text-white text-sm font-medium">{{away_team_name}}</p>
                    </div>
                </div>
            </div>
        </div>

        <!--Optional(if it not don't show in ui) Statistics List Section -->
        <div class="flex flex-col gap-3 py-5 pt-0">
            {{#each statistics}}
            <div class="stat-item-bg rounded-xl py-4 flex justify-between items-center">
                <p class="text-gray-300 text-base">{{this.label}}</p>
                <p class="text-white text-base font-semibold">{{this.value}}</p>
            </div>
            {{/each}}
        </div>

        <!-- optional(if it not exist don't show it) Call to Action Button -->
        <div class="p-5 pt-0">
            <button onclick="window.open('{{match_report_url}}', '_blank')"
                    class="w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg">
                View stats
            </button>
        </div>

    </div>

</body>
</html>


`;

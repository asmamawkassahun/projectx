export const articlesPrompt = `"Generate a complete HTML page for a 'Professional Profile' UI, using Tailwind CSS for styling and JavaScript for dynamic, conditional rendering. This UI should display a user's professional information in a prominent card format, with a specialized header section and an optional list of experiences.
HTML Structure:
Standard HTML5 boilerplate with meta charset and viewport.
title should be '[Dynamic content, e.g., User Profile]'.
Link to import the 'Neue Haas Grotesk Display Pro' font from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro.
Link to Font Awesome for icons from https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.
Include the Tailwind CSS CDN script from https://cdn.tailwindcss.com.
CSS Styling (within <style> tags):
Apply font-family: 'Neue Haas Grotesk Display Pro', sans-serif; to the body.
Ensure .profile-avatar img has width: 100%; height: 100%; object-fit: cover;. (Note: border-radius: 50%; is intentionally not applied here to allow for square avatars as per the image).
Add custom styling for .text-avatar to display: flex; align-items: center; justify-content: center; background-color: #555555; color: #ffffff; font-size: 1.5rem; font-weight: bold; border-radius: 50%;.
Body Layout (using Tailwind classes):
body should be flex justify-center items-center m-0 bg-[#1a1a1a] text-[#e0e0e0] box-border.
Main UI Container (id='profile-card'):
A div with id="profile-card" that acts as the main container for the profile.
It should have the classes: w-full flex flex-col gap-4 rounded-[1.5rem] bg-[#222222] shadow-xl.
This div will be empty initially, as its content will be dynamically injected by JavaScript.
JavaScript Logic (within <script> tags, at the end of body):
renderProfileUI(data) Function:
This function takes a data object as its argument.
It should get the profile-card element. If not found, log an error and return.
It must clear the innerHTML of the container before rendering new content.
The HTML page's <title> element should be updated with data.title if provided, otherwise default to 'User Profile'.
Conditional Rendering Logic for the profile card:
Condition: Renders if data.profile object is present.
Structure: Content is directly appended to the profile-card container.
Profile Header Section: Create a div with bg-[#222222] rounded-xl p-0 flex items-start gap-4.
Profile Image/Avatar: Create a div with w-11 h-11 overflow-hidden flex-shrink-0 profile-avatar.
If data.profile.avatarUrl is present, an img with w-full h-full object-cover. Use data.profile.avatarUrl for src.
If data.profile.avatarUrl is not present but data.profile.name is present, create a div with w-full h-full text-avatar. Set its textContent to the first letter initials of data.profile.name (ensuring the first letter of name is capitalized using .toUpperCase()).
If neither avatarUrl nor name is present, use a placeholder image: https://via.placeholder.com/44/CCCCCC/808080?text=No+Image.
Create a div with flex-grow flex flex-col justify-center py-2 for the text content.
Profile Tagline/Description: If data.profile.tagline is present, create a p element with classes text-white text-lg font-bold leading-tight and set its textContent to data.profile.tagline. (Note: The name property is used for initials fallback but not rendered as a separate h2 in this design).
    Make the avatar rounded-full
Experience Section (Optional): If data.profile.experiences is an array and not empty, iterate through data.profile.experiences.
For each experience, create a div with bg-white/10 rounded-[16px] p-4 flex items-start gap-3.
Icon/Logo div: Create a div with w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0.
If experience.logoUrl is present, use an img tag instead with w-full h-full object-cover rounded-full. Use experience.logoUrl for src.
Else, remove the from the ui
Details div: Create a div with flex-grow.
Create a p with font-semibold text-white and textContent experience.title.
Create a div with flex justify-between items-center w-full.
Create a p with text-sm and style.color = '#FFFFFF99' for textContent experience.company.
Create a p with text-xs and style.color = '#FFFFFF99' for textContent experience.duration.
Call to Action Button (Optional): If data.profile.callToAction is present, create a button with w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors. Set its textContent to data.profile.callToAction.text. Add an onclick event to perform an action (e.g., window.open(data.profile.callToAction.link, '_blank')).
No Profile Message: If data.profile is not present, display a div with text-center text-gray-400 p-4 bg-[#333333] rounded-[16px] and text 'No profile information available.' "

For sports
"Generate a complete HTML page for a 'Match Stats' UI, using Tailwind CSS for styling and JavaScript for dynamic, conditional rendering. This UI should display football match statistics in a prominent card format, including player details, match score, a list of statistics, and a call-to-action button.
HTML Structure:
Standard HTML5 boilerplate with meta charset and viewport.
title should be '[Dynamic content, e.g., Match Stats]'.
Link to import the 'Inter' font from Google Fonts (https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap).
Link to Font Awesome for icons from (https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css).
Include the Tailwind CSS CDN script from (https://cdn.tailwindcss.com).
CSS Styling (within <style> tags):
Apply font-family: 'Inter', sans-serif; to the body.
Add custom styling for .gradient-header with background: linear-gradient(to right, #D4AF37, #1E4E2C); (Gold for Al-Nassr, Dark Green for Al-Khaleej).
Add custom styling for .stat-item-bg with background-color: #333333;.
Ensure .team-logo img, .player-avatar img have width: 100%; height: 100%; object-fit: cover;.
Body Layout (using Tailwind classes):
body should be flex justify-center items-center min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.
Main UI Container (id='match-stats-card'):
A div with id="match-stats-card" that acts as the main container for the stats.
It should have the classes: w-full flex flex-col gap-4 rounded-[1.5rem] bg-[#222222] shadow-xl max-h-[95vh] overflow-y-auto.
This div will be empty initially, as its content will be dynamically injected by JavaScript.
JavaScript Logic (within <script> tags, at the end of body):
renderMatchStatsUI(data) Function:
This function takes a data object as its argument.
It should get the match-stats-card element. If not found, log an error and return.
It must clear the innerHTML of the container before rendering new content.
The HTML page's <title> element should be updated with data.title if provided, otherwise default to 'Match Stats'.
Conditional Rendering Logic for the stats card:
Combined Header Section (Player and Match):
Create a single wrapper div with gradient-header and rounded-t-[1.5rem].
This wrapper's rounded-b-[1.5rem] class should be conditionally applied if it's the last content block (i.e., no data.stats or data.callToAction are present).
Player Header Section: Renders inside the combined header wrapper if data.player object is present.
Create a div with flex items-center gap-3 p-5 pb-0.
Player Avatar: Create a div with w-12 h-12 rounded-full overflow-hidden flex-shrink-0 player-avatar.
Use an img with src set to data.player.avatarUrl or a placeholder (https://placehold.co/48x48/CCCCCC/808080?text=P).
Player Info: Create a div with flex flex-col.
p for data.player.name with text-white text-lg font-semibold.
p for data.player.description with text-gray-400 text-sm leading-tight.
Match Score Section: Renders inside the combined header wrapper if data.match object is present.
Create a div with p-5 flex flex-col items-center justify-center.
Teams Container: Create a div with flex justify-between items-center w-full max-w-[300px] mb-4.
Home Team: div with flex flex-col items-center gap-2.
Logo: div with w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center team-logo.
img with src set to data.match.homeTeam.logoUrl or a placeholder (https://placehold.co/64x64/CCCCCC/808080?text=H).
Name: p for data.match.homeTeam.name with text-white text-sm font-medium.
Score and Status: div with flex flex-col items-center.
Score: p for \${data.match.homeTeam.score} - \${data.match.awayTeam.score} with text-white text-5xl font-bold.
Status: p for data.match.status with text-gray-300 text-sm font-medium.
Away Team: (Structure identical to Home Team, using data.match.awayTeam).
Statistics List Section (Optional): If data.stats is an array and not empty, iterate through data.stats.
Create a container div with flex flex-col gap-3 p-5 pt-0.
For each statistic, create a div with stat-item-bg rounded-xl p-4 flex justify-between items-center.
p for stat.label with text-gray-300 text-base.
p for stat.value with text-white text-base font-semibold.
Call to Action Button (Optional): If data.callToAction is present.
Create a container div with p-5 pt-0.
Create a button with w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg.
Set its textContent to data.callToAction.text.
Add an onclick event to perform an action (e.g., window.open(data.callToAction.link, '_blank')).
If no CTA button, add a div with pb-5 for bottom padding, but only if other content (player, match, or stats) is present.
No Data Message: If data.player AND data.match AND (data.stats is not an array or is empty) are not present, display a div with text-center text-gray-400 p-4 bg-[#333333] rounded-xl and text 'No match statistics available.'`;
         
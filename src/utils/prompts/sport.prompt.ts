export const sportPrompt = `please reference the image I attached to understand what I meant by in my prompt, before you try to generate the ui please deeply analyse the data provided and do couple of researches to get thew logos and other relevant datas needed in the html generation pease don't add script or javascript. here is my prompt and replace all place holders with the actual data you analysed : "As a senior frontend developer please generate an html with Objective
Generate a complete static HTML page for a 'Match Stats' UI. This interface will prominently display football match statistics for a game between {{ home_team.name }} and {{ away_team.name }}, presented within a dedicated card component.

The UI must highlight the top-performing player from the match. This player's selection will be based on their highest statistical contributions (e.g., goals, assists, chances created, or duels won) derived from recent match data. The page will include the match score, a detailed list of the selected player’s statistics, and a clear call-to-action button. All dynamic data points will be represented using generic template placeholders (e.g., {{ variable }}), anticipating replacement by a server-side templating engine without reliance on any specific backend language. The content within the card should occupy its full height, eliminating any vertical scrollbars.

Technical Specifications
HTML Structure
Document Title: Set the <title> dynamically to {{ match.title }}.

Font Import: Link to import the 'Inter' font from Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap.

Icon Library: Link to Font Awesome for icons: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.

Styling Framework: Include the Tailwind CSS CDN script: https://cdn.tailwindcss.com.

CSS Styling (within <style> tags)
Global Font: Apply font-family: 'Inter', sans-serif; to the body element.

Statistic Item Background: Define custom styling for .stat-item-bg: background-color: #333333; border-radius: 1rem;.

Image Sizing: Ensure .team-logo img and .player-avatar img have width: 100%; height: 100%; object-fit: cover; for proper scaling and aspect ratio.

Body Layout (Tailwind classes)
Apply the following utility classes to the body element for centering and foundational styling: flex justify-center items-center min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.

Main UI Container (#match-stats-card)
Create a div with the ID match-stats-card.

Apply the following Tailwind classes and inline style for structural and aesthetic properties, ensuring a minimum width of w-full and no vertical scrolling: min-w-[480px] flex flex-col gap-4 rounded-[1.5rem] shadow-xl style="background-color: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px);".

Content Structure (within #match-stats-card)
Player Header Section
A div with classes: flex items-center gap-3 p-5 pb-0.

Player Avatar: A div (w-12 h-12 rounded-full overflow-hidden flex-shrink-0 player-avatar) containing an <img> with src="{{ player.avatar_url }}" and alt="{{ player.name }} Avatar".

Player Info: A div (flex flex-col) containing:

<p> for {{ player.name }} (text-white text-lg font-semibold).

<p> for {{ player.position_team }} (text-gray-400 text-sm leading-tight).

Match Score Section
A div with classes: p-5 flex flex-col items-center justify-center.

Teams Container: A div (flex justify-between items-center w-full max-w-[300px] mb-4).

Home Team: A div (flex flex-col items-center gap-2) containing:

Logo: A div (w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center team-logo) with an <img> src="{{ home_team.logo_url }}" and alt="{{ home_team.name }} Logo".

Name: <p> for {{ home_team.name }} (text-white text-sm font-medium).

Score and Status: A div (flex flex-col items-center) containing:

Score: <p> for {{ match.score }} (text-white text-5xl font-bold).

Status: <p> for {{ match.status }} (text-gray-300 text-sm font-medium).

Away Team: Identical structure to the Home Team, featuring an <img> src="{{ away_team.logo_url }}" and alt="{{ away_team.name }} Logo", and <p> for {{ away_team.name }}.

Statistics List Section
A div with classes: flex flex-col gap-3 p-5 pt-0.

Utilize a template loop (e.g., {% for stat in stats %} ... {% endfor %}) to render individual statistics for the selected player.

Each statistic should be encapsulated within a div (stat-item-bg rounded-xl p-4 flex justify-between items-center), containing:

Left <p> for {{ stat.name }} (text-gray-300 text-base).

Right <p> for {{ stat.value }} (text-white text-base font-semibold).

Call to Action Button
A div with classes: p-5 pt-0.

A <button> with classes: w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg.

Button text: "View Full Match Report".

Implement an onclick event to navigate to {{ match.report_url }} in a new tab.

Player Selection Logic
The top-performing player should be selected based on the highest statistical contributions (e.g., goals, assists, chances created, duels won) from the specific match between {{ home_team.name }} and {{ away_team.name }}.

Recent match data should be used for accurate top performer identification. In the absence of specific match data, default to a prominent player from either team with a strong historical performance against the opponent.

Example Data (for contextual understanding only; replace with actual data)
Match: {{ home_team.name }} vs {{ away_team.name }} (e.g., Manchester City vs Liverpool).

Player: Top performer (e.g., Erling Haaland, based on goals/assists).

Stats: Goals, Assists, Chances Created, Duels Won, etc.

Team Colors: Home team’s primary colors (e.g., Manchester City: sky blue #6CABDD, white #FFFFFF).

Logos: Publicly available team logo URLs.

Report URL: Link to the home team’s official match report page."`;
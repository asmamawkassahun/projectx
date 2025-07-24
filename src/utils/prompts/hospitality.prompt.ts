export const hospitalityPrompt = `
          IMPORTANT: Use only the actual data provided in the API response. Do not use any static, sample, or placeholder data from this prompt. Every field in the UI must come from the real API response make the response match with the ui. If a field is missing, omit that field and on current cond replace static data with the response and use real image of the Restaurant and hotels and don't change any ui style just understand the response and make show the content in ui and also when you ask for resturant please use Restaurant ui part , if you ask for hotels you should use hotels ui.
          IMPORTANT: Use actual and real image of Restaurant or hotel if it fail use placeholder image 
          "Generate a complete HTML page for a UI that can display either 'Restaurant Details' or 'Hotel Listings, or Hotel Detail with list of image', using Tailwind CSS for styling. The UI should be capable of displaying both a single restaurant entry and a list of hotel entries.

HTML Structure:

    Standard HTML5 boilerplate with meta charset and viewport.

    title should be 'Restaurant & Hotel Details Sample'.

    Link to import the 'Neue Haas Grotesk Display Pro' font from https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro.

    Link to Font Awesome for icons (utensils, star, clock, bed, globe, map-marker, phone, dumbbell, eye, wrench, info-circle) from https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css.

    Include the Tailwind CSS CDN script from https://cdn.tailwindcss.com.

CSS Styling (within <style> tags):

    Apply font-family: "Neue Haas Grotesk Display Pro", Arial, sans-serif; to the body.

    Ensure .restaurant-image img and .hotel-image img have width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;.

    Add a custom class .text-shadow-custom for text-shadow: 1px 1px 3px rgba(0,0,0,0.7);.

Body Layout (using Tailwind classes):

    body should be flex justify-center items-start  m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border.

Main UI Container (id="main-content-container"):

    A div with container w-full max-w-[450px] flex flex-col gap-4 p-5 rounded-[1.5rem] bg-white/10 shadow-xl.

    This div will contain either the restaurant or hotel content.

Content Sections (Static HTML, commented out to switch between views):

1. Restaurant Details Sample or (list of Restaurant):

    Top Bar (Introductory Text with Icon):

        Structure: A div with flex items-start gap-3 mb-2.

        Icon div: w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold flex-shrink-0. Inside, a Font Awesome icon (i tag) like fas fa-utensils.

        Text div: text-lg font-bold text-white leading-tight flex-grow.e,g( Set its textContent to 'put response match to this ', this is for sample for you to understandable like this for other placeholder value).

    Restaurant Image Card:

        Structure: A div with restaurant-image card bg-[#333333] rounded-xl p-0 overflow-hidden relative h-56.

       optional img (if no image omit the image and bottom button in ui): w-full h-full object-cover rounded-xl. Use a sample image URL when you get an error to load the image  (e.g., https://i.ibb.co/0pzY3nWB/placeholder-Hotels.png, if the actual image url is not provide or have error use this placeholder image).

        Optional Rating Overlay: An absolute div with top-4 left-4 bg-black bg-opacity-50 text-white text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-1. Inside, a Font Awesome star icon (fas fa-star) with text-yellow-400 and a span for the rating (e.g., '4.7').

    Restaurant Details Card:

        Structure: A div with card bg-white/10 rounded-xl p-4 flex flex-col gap-2.

        Name and Distance div: flex justify-between items-center.

            Name div: text-xl font-bold text-white (e.g., 'The Gastronome Grill' this is for sample for you to understandable like this for other placeholder value).

            Distance div: text-sm text-gray-400 (e.g., '2.5 mi' this is for smaple for you to understandable like this for other placeholder value).

        Food Type and Price Range div: text-base text-gray-400 flex items-center gap-2.

            Font Awesome icon (i tag) (e.g., fas fa-burger).

            span for food type and price range (e.g., 'Modern American • $$$$').

        Open Status and Closing Time div: text-base flex items-center gap-2.

            Font Awesome clock icon (fas fa-clock) with text-gray-400.

            span for open/closed status: font-semibold. Apply text-green-400 if open, else text-red-400 (e.g., 'Open').

            span for closing time: text-gray-400 (e.g., '• 10:00 PM').

    Book A Table Button:

        Structure: A button element. always white background and black text color

        Styling: bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-gray-200. Set its textContent to 'Book A Table'.

2. Hotel Listing Sample:

    Top Bar (Introductory Text with Icon):

        Structure: A div with flex items-start gap-3 mb-2.

        Icon div: w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white text-xl font-bold flex-shrink-0. Inside, a Font Awesome icon (i tag) like fas fa-hotel.

        Text div: text-lg font-bold text-white leading-tight flex-grow. Set its textContent to 'use the real api respose data that match with this.'.

    Hotel Cards (List):

        Create two sample hotel cards. For each hotel:

            Structure: A div with card bg-[#333333] rounded-xl p-4 flex flex-col gap-3.

            Optional  Hotel Image(if the no image omit in ui): A div with hotel-image rounded-xl overflow-hidden h-40. Inside, an img with w-full h-full object-cover. (e.g., https://i.ibb.co/0pzY3nWB/placeholder-Hotels.png, if the actual image url is not provide or have error use this placeholder image).

            Location, Rating, Amenities Row: A div with flex justify-between items-center text-sm.

                Left side div: flex items-center gap-2.

                    Location span: text-gray-400 (e.g., 'New York').

                    Star Rating span: flex items-center text-yellow-400. Render 5 Font Awesome star icons (fas fa-star), with text-gray-600 for unfilled stars based on a sample rating (e.g., 4.5).

                    Numerical Rating span: text-white font-semibold (e.g., '4.5').

                Right side div: flex items-center gap-2.

                    For each amenity, create a div with w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm. Inside, a Font Awesome icon (i tag) (e.g., fas fa-wifi, fas fa-dumbbell, fas fa-spa, fas fa-parking).

            Hotel Name: A div with text-xl font-bold text-white (e.g., 'Grand Hyatt', 'The Cozy Inn',  as placeholder, please change it in real data as soon as you get the data).

            Price: A div with text-base text-gray-400 (e.g., 'from $350 p/night as placeholder, please change it in real data as soon as you get the data').

            Action Buttons Row: A div with flex justify-between items-center mt-2.

                For each action, create an a tag (link) with flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200 hover:bg-gray-600.

                    Font Awesome icon (i tag) (e.g., fas fa-web, fas fa-phone, fas fa-map-marker-alt).

                    span for action text (e.g., 'website','Direction', 'Call'). Set href to '#' or a sample tel: link.

    Main Action Button (for hotel listing):

        Structure: A button element.

        Styling: bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-gray-200. Set its textContent to 'Explore More Hotels'.

Instructions for switching views:

    The generated HTML should contain both the restaurant and hotel sections.

    One section should be commented out by default (e.g., the restaurant section) so that the other (e.g., hotel listing) is visible upon initial load. Users can uncomment the desired section and comment out the other to switch views."`;
         
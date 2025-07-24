export const contactPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Details</title>
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
        /* Ensure contact-avatar img fills its container and covers the area */
        .contact-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        /* Custom text shadow for prominent text */
        .text-shadow-custom {
            text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
        }
        /* Custom styling for text-based avatars */
        .text-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #555555;
            color: #ffffff;
            font-size: 2.5rem;
            font-weight: bold;
            /* text-transform: uppercase; (handled by content directly in static HTML) */
        }
    </style>
</head>
<body class="flex justify-center items-center m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main UI Container: Hardcoded static content -->
    <div id="contact-card" class="w-full max-w-[450px] flex flex-col items-center text-center relative overflow-hidden bg-[#333333] rounded-[1.5rem] p-6 shadow-xl space-y-4">

        <!-- Top Bar (Introductory Text with Icon) -->
        <div class="flex items-start gap-3 w-full">
            <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                <i class="fas fa-user"></i> <!-- Fallback icon -->
            </div>
            <div class="text-base leading-[140%] font-semibold text-white flex-grow text-left">
                Contact information.
            </div>
        </div>

        <!-- Circular Avatar -->
        <div class="w-52 h-52 rounded-full overflow-hidden contact-avatar">
            <!-- Example: Image Avatar -->
            <img src="https://placehold.co/208x208/FFD700/000000?text=JD" alt="Contact Avatar" class="w-full h-full object-cover">
            <!-- Example: Text Avatar (uncomment and remove img tag to use) -->
            <!-- <div class="w-full h-full text-avatar rounded-full">JD</div> -->
            <!-- Example: Placeholder if no avatar or name (uncomment and remove img/text-avatar to use) -->
            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAOVBMVEX///+hoaGZmZmenp75+fmmpqbX19e3t7e/v7/t7e3n5+epqanNzc3KysqSkpL8/Pzf39/z8/OwsLBPkmpzAAAC40lEQVR4nO3a6W6rMBCGYbywmmDC/V9sTSAUEiASWGKQ3udXK3EQ3xmPF0qSAAAAAAAAAAAAAAAAAAAAAAAAAAAu4xNvY7o2TZZHVZRXhklNXNmFWbxSKmIUZeoLw1ildBVLWehLw4TKNPHu9iBMNIswYZ72/szdJIU5TUiYUBFbF0V9bpmQEiZpU2WUco8zdxMSJmlDkn7NUY/keNsICePNEEaptDp+NyFhska9FcfvJiRMod9ZTHf8bkLCdGYK447fTUiYx1QZdf/KVI1R6RBm/3F2j19CwiT5WBqT7j1u25m83J67hYTx3oXaKKPTnWdNWhdOLDtzt5Aw4afMGZM+9upSvqYJkz+3LhATJrSDfdq95d+O87euty6TE2Z3F9MfDTI1zt9ma6DJCfPjwtAw0+ydbmyu7xImKfP/pUgX621zlzD+Me0R+jTZ6pH0LmGmhhnTrLbNLcL4pHJaLbjnyoxxizDJs/jIovTainSLML7+zBL+Wft9ncgwtprPVmFWXjbMuNp8b3wkhql0o+fnzapbyRJOcV8DTWCYUpt+KZl+/26YcaB9tY24MN6613ayP9cMw2ilYcZJ4LNtxIWx46HTuHEpqdK1Qfa6RH1sBMSFad/vaUz+GkXzbcxXabrl/llWGJ+Us//4vm22GmZsm9rLDZPYWR1MmoVtjN4aZK9LmsW2RlYYXzfzR+3K7YYZL1F2VhtZYapm+ajdTsMMdG5lhvHPMLSWafbr0l+haz9NAqLC/KzDam3+20ZSmOxIlvmbNkFhykNZ+raRN8zs7wbZMJ0GxITxu6vjj9qMb2vEhDnWMAPjhhlNSphyd6X/WZrh77pCwnh3Jsu7bYSEOdEwY236tzUywrTN2Y+zdOeFVMam7jSVCQnzLCOoJITR8T43vTiM7Q+U0bhrP2v04XilY+kngivDJHkalTvx5c15ZRbVpVmiO/VZJAAAAAAAAAAAAAAAAAAAAAAAAABc4A+lUzEyY9gMcgAAAABJRU5ErkJggg==" alt="Placeholder Avatar" class="w-full h-full object-cover"> -->
        </div>

        <!--optional(if it not exist omit in ui) Contact Name -->
        <h2 class="text-2xl font-bold text-white text-shadow-custom">Jane Doe</h2>

        <!--optional(if it not exist omit in ui) Additional Contact Details Section -->
        <div class="w-full text-left bg-[#444444] p-4 rounded-lg space-y-2">
            <!-- Birthday Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-birthday-cake text-gray-400"></i>
                <span class="text-gray-200"><strong>Birthday:</strong> January 1, 1990</span>
            </div>
            <!-- Email Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-envelope text-gray-400"></i>
                <span class="text-gray-200"><strong>Email:</strong> jane.doe@example.com</span>
            </div>
            <!-- Phone Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-phone text-gray-400"></i>
                <span class="text-gray-200"><strong>Phone:</strong> +1 (555) 123-4567</span>
            </div>
            <!-- Address Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-map-marker-alt text-gray-400"></i>
                <span class="text-gray-200"><strong>Address:</strong> 123 Main St, Anytown, USA 12345</span>
            </div>
            <!-- Notes Detail -->
            <div class="flex items-center gap-3 text-sm">
                <i class="fas fa-info-circle text-gray-400"></i>
                <span class="text-gray-200"><strong>Notes:</strong> Met at the annual tech conference.</span>
            </div>
        </div>

        <!-- "Send a message" Button -->
        <button class="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors">
            Send a message
        </button>

        <!-- To test "No contact information available." message, replace the entire content above with this div: -->
        <!-- <div class="text-center text-gray-400 p-4 bg-[#333333] rounded-xl">No contact information available.</div> -->

    </div>

</body>
</html>
"`;
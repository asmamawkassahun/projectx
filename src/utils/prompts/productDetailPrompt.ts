export const productPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents
IMPORTANT: use exact image of product , if you don't get it don't show that part in the ui, and plsease fill the placeholder data or static data with actual data
"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Display</title>
    <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for font and image styling */
        body {
            font-family: "Neue Haas Grotesk Display Pro", Arial, sans-serif;
        }
        /* Ensure product images fill their containers and cover/contain the area */
        .product-main-image img,
        .thumbnail-image img,
        .product-image-container img,
        .product-card-image img,
        .tech-specs-image img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Default to cover for product images */
            border-radius: 1rem;
        }
        /* Override for tech-specs-image to contain as per its specific prompt */
        .tech-specs-image img {
            object-fit: contain;
        }
        /* Custom text shadow for prominent text */
        .text-shadow-custom {
            text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
        }
        /* Custom styling for product comparison progress bar */
        .airflow-bar-progress {
            background-color: #00bcd4; /* Cyan color */
            height: 100%;
            border-radius: 9999px;
        }
    </style>
</head>
<body class="flex justify-center items-start m-0 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <div id="main-product-container" class="w-full max-w-full flex flex-col gap-4 p-5 rounded-[1.5rem] bg-white/10 shadow-xl">

        <div class="text-lg font-bold text-white mb-2 leading-tight">
            {{header_intro_text}}
        </div>

        <div class="card bg-[#333333] rounded-xl p-4 flex items-center gap-3">
            {{#if company_logo_url}}
            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <img src="{{company_logo_url}}" alt="{{company_name}} Logo" class="w-full h-full object-contain p-1 rounded-full">
            </div>
            {{/if}}
            <div class="flex-grow">
                {{#if availability_status}}
                <div class="text-sm text-white">{{availability_status}}</div>
                {{/if}}
                <div class="text-lg font-semibold text-white">{{product_name}}</div>
            </div>
            <div class="flex justify-between items-baseline w-full mt-2">
                <div class="text-lg font-semibold text-white">{{product_category}}</div>
                <div class="text-lg font-bold text-white">{{product_price}}</div>
            </div>
        </div>

        {{#if main_product_image_url}}
        <div class="product-main-image rounded-xl overflow-hidden h-64">
            <img src="{{main_product_image_url}}"
                 onerror="this.onerror=null;this.src='https://placehold.co/450x256/334155/E2E8F0?text=Product+Image';"
                 alt="{{product_name}} Main" class="w-full h-full object-cover">
        </div>
        {{/if}}

        {{#if thumbnail_image_urls}}
        <div class="flex justify-between gap-3">
            {{#each thumbnail_image_urls}}
            <div class="thumbnail-image w-1/3 h-24 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img src="{{this}}"
                     onerror="this.onerror=null;this.src='https://placehold.co/150x96/334155/E2E8F0?text=Thumb';"
                     alt="{{../product_name}} Thumbnail" class="w-full h-full object-cover">
            </div>
            {{/each}}
        </div>
        {{/if}}

        {{#if available_sizes}}
        <div class="card bg-white/10 rounded-xl p-4 flex flex-col gap-3">
            <div class="text-lg font-bold text-white">Available in Size: {{available_sizes}}</div>
            {{#if retailers}}
            <div class="flex flex-wrap justify-start gap-3">
                {{#each retailers}}
                <button class="flex items-center gap-2 bg-white/10 border border-gray-600 text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200 hover:bg-gray-600">
                    <div class="w-6 h-6 rounded-full bg-transparent flex items-center justify-center text-xs font-bold">{{this.initial}}</div>
                    <span>{{this.name}}</span>
                </button>
                {{/each}}
            </div>
            {{/if}}
        </div>
        {{/if}}

        {{#if new_release_data}}
        <div class="relative p-4">
            <div class="absolute -top-4 left-4 bg-[#333333] text-white text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-2 shadow-md">
                <i class="fas fa-calendar-alt"></i>
                <span>New Release</span>
            </div>
            <div class="text-lg font-bold text-white leading-tight mt-6">
                {{new_release_data.title}}
            </div>
        </div>

        <div class="card bg-[#333333] rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl">
                <i class="{{new_release_data.company_icon}}"></i>
            </div>
            <div>
                <div class="text-sm text-gray-400">{{new_release_data.company_name}}</div>
                <div class="text-lg font-semibold text-white">{{new_release_data.event_name}}</div>
            </div>
        </div>

        {{#if new_release_data.image_url}}
        <div class="product-image-container rounded-xl overflow-hidden h-64 flex items-center justify-center bg-gray-800">
            <img src="{{new_release_data.image_url}}" alt="{{new_release_data.title}}" class="w-full h-full object-contain">
        </div>
        {{/if}}

        <div class="flex justify-between gap-3 text-center">
            <div class="w-1/3 bg-[#333333] rounded-xl p-4 flex flex-col items-center justify-center">
                <div class="text-5xl font-bold text-white mb-1">{{new_release_data.countdown.days}}</div>
                <div class="text-sm text-gray-400">Days</div>
            </div>
            <div class="w-1/3 bg-[#333333] rounded-xl p-4 flex flex-col items-center justify-center">
                <div class="text-5xl font-bold text-white mb-1">{{new_release_data.countdown.hours}}</div>
                <div class="text-sm text-gray-400">Hours</div>
            </div>
            <div class="w-1/3 bg-[#333333] rounded-xl p-4 flex flex-col items-center justify-center">
                <div class="text-5xl font-bold text-white mb-1">{{new_release_data.countdown.minutes}}</div>
                <div class="text-sm text-gray-400">Mins</div>
            </div>
        </div>
        {{/if}}

        {{#if comparison_data}}
        <div class="text-lg font-bold text-white mb-2 leading-tight">
            Compare {{comparison_data.product1.name}} vs. {{comparison_data.product2.name}}
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="card bg-[#333333] rounded-xl p-4 flex flex-col items-center">
                {{#if comparison_data.product1.image_url}}
                <div class="product-card-image w-20 h-20 mb-2">
                    <img src="{{comparison_data.product1.image_url}}" alt="{{comparison_data.product1.name}}" class="object-cover">
                </div>
                {{/if}}
                <div class="text-lg font-bold text-white text-center">{{comparison_data.product1.name}}</div>
                <p class="text-sm text-gray-400 leading-tight text-center">{{comparison_data.product1.description}}</p>
                <div class="text-lg font-bold text-white mt-2">{{comparison_data.product1.price}}</div>
            </div>
            <div class="card bg-[#333333] rounded-xl p-4 flex flex-col items-center">
                {{#if comparison_data.product2.image_url}}
                <div class="product-card-image w-20 h-20 mb-2">
                    <img src="{{comparison_data.product2.image_url}}" alt="{{comparison_data.product2.name}}" class="object-cover">
                </div>
                {{/if}}
                <div class="text-lg font-bold text-white text-center">{{comparison_data.product2.name}}</div>
                <p class="text-sm text-gray-400 leading-tight text-center">{{comparison_data.product2.description}}</p>
                <div class="text-lg font-bold text-white mt-2">{{comparison_data.product2.price}}</div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 w-full">
            {{#each comparison_data.features}}
            <div class="card bg-[#333333] rounded-xl p-4 flex flex-col items-start">
                <div class="text-sm text-gray-400 mb-2">{{this.name}}</div>
                {{#if this.type_bar}}
                <div class="w-full h-2 bg-gray-600 rounded-full mb-1">
                    <div class="airflow-bar-progress" style="width: {{this.value1_percentage}}%;"></div>
                </div>
                {{/if}}
                <div class="text-xl font-bold text-white">{{this.value1}}</div>
            </div>
            <div class="card bg-[#333333] rounded-xl p-4 flex flex-col items-start">
                <div class="text-sm text-gray-400 mb-2">{{this.name}}</div>
                {{#if this.type_bar}}
                <div class="w-full h-2 bg-gray-600 rounded-full mb-1">
                    <div class="airflow-bar-progress" style="width: {{this.value2_percentage}}%;"></div>
                </div>
                {{/if}}
                <div class="text-xl font-bold text-white">{{this.value2}}</div>
            </div>
            {{/each}}
        </div>
        {{/if}}

        {{#if tech_specs_data}}
        <div class="relative p-4">
            <div class="absolute -top-4 left-4 bg-[#333333] text-white text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-2 shadow-md">
                <i class="fas fa-microchip"></i>
                <span>{{tech_specs_data.header_title}}</span>
            </div>
            <div class="text-lg font-bold text-white leading-tight mt-6">
                {{tech_specs_data.main_title}}
            </div>
        </div>

        <div class="grid grid-cols-1 gap-3 w-full">
            {{#each tech_specs_data.specs}}
            <div class="card bg-[#333333] rounded-xl p-4 flex flex-col items-start">
                <div class="text-sm text-gray-400 mb-1">{{this.name}}</div>
                <div class="text-base font-semibold text-white leading-tight">{{this.value}}</div>
            </div>
            {{/each}}
        </div>
        {{/if}}

        {{#if cta_button_text}}
        <button class="bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-gray-200">
            {{cta_button_text}}
        </button>
        {{/if}}

    </div>

</body>
</html>
"`;

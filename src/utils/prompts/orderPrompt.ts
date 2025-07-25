export const orderStatusPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents
"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Tracking</title>
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
    </style>
</head>
<body class="flex justify-center items-start min-h-screen m-0 p-5 bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main UI Container -->
    <!-- This div will contain all the order tracking components. -->
    <!-- Its content would typically be dynamically injected by JavaScript based on data. -->
    <div id="main-order-tracking-container" class="container w-full max-w-full flex flex-col gap-4 p-6 rounded-[1.5rem] bg-white/10 backdrop:blur-[40px] shadow-xl">

        <!-- Optional Notification (Example - would be dynamically added/removed) -->
        <!--
        <div class="bg-blue-600 text-white p-3 rounded-lg text-center text-sm">
            Your order is on its way! Estimated delivery in 30 minutes.
        </div>
        -->

        <!-- Top Bar (Company Info) -->
        <!-- This section would render if data.companyInfo is present -->
        <div class="flex items-center gap-3 mb-2">
            <!-- Company Logo -->
            <div class="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white text-xl font-bold">
                A <!-- Example: data.companyInfo.logoText or 'A' as fallback -->
            </div>
            <!-- Company Name and Order Number -->
            <div>
                <div class="text-lg font-bold text-white">
                    Acme Corp <!-- Example: data.companyInfo.companyName or 'Company' as fallback -->
                </div>
                <div class="text-sm text-gray-400">
                    Order No. 123456789 <!-- Example: Order No. data.companyInfo.orderNumber or 'N/A' as fallback -->
                </div>
            </div>
        </div>

        <!-- Product Card -->
        <!-- This section would render if data.product is present -->
        <div class="card bg-[#333333] rounded-xl p-0 overflow-hidden">
            <!-- Product Image Container -->
            <div class="product-image-container h-56">
                <img src="https://placehold.co/400x224/333333/FFFFFF?text=Product+Image
            " alt="Product Image" class="w-full h-full object-cover rounded-t-xl">
                <!-- Example: data.product.imageUrl or a placeholder -->
            </div>
            <!-- Product Name -->
            <div class="p-4">
                <div class="text-lg font-semibold text-white">
                    Wireless Headphones Pro <!-- Example: data.product.name or 'Product Name' as fallback -->
                </div>
            </div>
        </div>

        <!-- Delivery Status Bar -->
        <!-- This section would render if data.deliveryStatus is present -->
        <div class="flex flex-col bg-[#222222] rounded-xl p-4 text-white text-base font-semibold">
            <!-- Status Text -->
            <span class="mb-4 text-lg font-bold text-white">
                Out for Delivery <!-- Example: data.deliveryStatus.text or 'Status N/A' as fallback -->
            </span>
            <!-- Progress Bar -->
            <div class="relative w-full h-1 bg-transparent rounded-full flex items-center justify-between">
                <!-- Blue filled portion -->
                <div class="absolute left-0 h-1 bg-blue-500 rounded-full" style="width: 45%;"></div>
                <!-- Start dot -->
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                <!-- Truck icon -->
                <i class="fas fa-truck absolute text-xl text-white" style="left: 50%; transform: translate(-50%, -50%); top: 50%;"></i>
                <!-- Gray unfilled portion -->
                <div class="absolute right-0 h-1 bg-gray-500 rounded-full" style="width: 45%;"></div>
            </div>
        </div>

        <!-- Tracking Map Card -->
        <!-- This section would render if data.trackingMap is present -->
        <div class="card bg-[#333333] rounded-xl p-0 overflow-hidden relative min-h-[200px] flex justify-center items-center">
            <!-- Map Image -->
            <img src="https://placehold.co/555555/FFFFFF" alt="" class="w-full h-full object-cover rounded-xl">
            <!-- Example: data.trackingMap.imageUrl or a placeholder -->
            <!-- Map Overlay with Driver Status -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white text-shadow-lg">
                <i class="fas fa-car text-5xl text-white"></i>
                <span class="text-lg font-bold w-full">
                    Driver: John Doe (5 min away) <!-- Example: data.trackingMap.driverStatus or 'Driver Status N/A' as fallback -->
                </span>
            </div>
        </div>

        <!-- Order Details Card -->
        <!-- This section would render if data.orderDetails is present -->
        <div class="card bg-[#333333] rounded-xl p-4 flex flex-col gap-3">
            <!-- Header -->
            <div class="text-lg font-bold text-white mb-2">Order details</div>
            <!-- Date -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Date</span>
                <span class="text-white">July 24, 2025 <!-- Example: data.orderDetails.date or 'N/A' as fallback --></span>
            </div>
            <!-- Price -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Price</span>
                <span class="text-white">$199.99 <!-- Example: data.orderDetails.price or 'N/A' as fallback --></span>
            </div>
            <!-- Shipping -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Shipping</span>
                <span class="text-white">Standard <!-- Example: data.orderDetails.shipping or 'N/A' as fallback --></span>
            </div>
            <!-- Paid with -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Paid with</span>
                <span class="text-white">
                    <i class="fab fa-cc-mastercard text-xl text-orange-500 mr-1"></i>
                    **** 1234 <!-- Example: data.orderDetails.paymentLastFour or 'N/A' as fallback -->
                </span>
            </div>
        </div>

        <!-- Track Package Button -->
        <!-- This button would render if data.showTrackPackageButton is true -->
        <button class="bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-white/80">
            Track Package
        </button>

    </div>
</body>
</html>
"`;
export const orderReturnPrompt = `You are an expert frontend developer and I want you to generate me an html with this templeate I provided, before trying to generate the code please understand the data and you can remove the optional components if there data isn't availible in the data provided, be cautious about the data you include.
when u do so because I don't want you to edit anything in the ui in the template has to be as it is. and please change all placeholder contents because that is your main job to substitute the contents"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Return Status</title>
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
    </style>
</head>
<body class="flex justify-center items-start min-h-screen m-0  bg-[#1a1a1a] text-[#e0e0e0] box-border">

    <!-- Main UI Container -->
    <!-- This div will contain all the order return tracking components. -->
    <!-- Its content would typically be dynamically injected by JavaScript based on data. -->
    <div id="main-order-return-container" class="container w-full max-w-full flex flex-col gap-4 rounded-[1.5rem] bg-white/10 backdrop:blur-[40px] shadow-xl">

        <!-- Optional Notification (Example - would be dynamically added/removed) -->
        <!--
        <div class="bg-blue-600 text-white p-3 rounded-lg text-center text-sm">
            Your return request has been received!
        </div>
        -->

        <!-- Top Bar (Company Info & Optional Small Product Thumbnail) -->
        <!-- This section would render if data.companyInfo is present -->
        <div class="flex items-center gap-3 mb-2">
            <!-- Company Logo -->
            <div class="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                A <!-- Example: data.companyInfo.logoText or 'A' as fallback -->
            </div>
            <!-- Company Name and Order Number -->
            <div class="flex-grow">
                <div class="text-lg font-bold text-white">
                    Acme Returns <!-- Example: data.companyInfo.companyName or 'Company' as fallback -->
                </div>
                <div class="text-sm text-gray-400">
                    Return ID: R-987654321 <!-- Example: Return ID: data.companyInfo.orderNumber or 'N/A' as fallback -->
                </div>
            </div>
            <!-- Conditional Product Thumbnail -->
            <!-- This img element would render if data.product is present AND data.product.isThumbnail is true -->
            <!-- <img src="https://placehold.co/48x48/333333/FFFFFF?text=Thumb" alt="Product Thumbnail" class="w-12 h-12 rounded-lg object-cover ml-auto flex-shrink-0"> -->
            <!-- Example: data.product.imageUrl or a placeholder -->
        </div>

        <!-- Product Card (Large Image) -->
        <!-- This section would render if data.product is present AND data.product.isThumbnail is false (or undefined/null) -->
        <div class="card bg-[#333333] rounded-xl p-0 overflow-hidden">
            <!-- Product Image Container -->
            <div class="product-image-container h-56">
                <img src="https://placehold.co/400x224/333333/FFFFFF?text=Product+Image" alt="Product Image" class="w-full h-full object-cover rounded-t-xl">
                <!-- Example: data.product.imageUrl or a placeholder -->
            </div>
            <!-- Product Name -->
            <div class="p-4">
                <div class="text-lg font-semibold text-white">
                    Wireless Headphones Pro (Return) <!-- Example: data.product.name or 'Product Name' as fallback -->
                </div>
            </div>
        </div>

        <!-- Return Status Bar -->
        <!-- This section would render if data.returnStatus is present -->
        <div class="flex flex-col items-start bg-[#222222] rounded-xl p-4 text-white text-base font-semibold">
            <!-- Status Text -->
            <span class="mb-4 text-lg font-bold text-white">
                Return Initiated <!-- Example: data.returnStatus.text or 'Status N/A' as fallback -->
            </span>
            <!-- Progress Bar SVG -->
            <svg width="328" height="44" viewBox="0 0 328 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                <circle cx="4" cy="22" r="4" fill="#1078FF"/>
                <path d="M16 22H60" stroke="#1078FF" stroke-width="3" stroke-linecap="round"/>
                <path d="M93 17.5L89 19.5M89 19.5L88.5 19.75L84 22M89 19.5V23M89 19.5L79.5 14.5M84 22L75 17.5M84 22V31.5M87.578 13.382L89.578 14.432C91.729 15.561 92.805 16.125 93.403 17.14C94 18.154 94 19.417 94 21.942V22.059C94 24.583 94 25.846 93.403 26.86C92.805 27.875 91.729 28.44 89.578 29.569L87.578 30.618C85.822 31.539 84.944 32 84 32C83.056 32 82.178 31.54 80.422 30.618L78.422 29.568C76.271 28.439 75.195 27.875 74.597 26.86C74 25.846 74 24.583 74 22.06V21.943C74 19.418 74 18.155 74.597 17.141C75.195 16.126 76.271 15.561 78.422 14.433L80.422 13.383C82.178 12.461 83.056 12 84 12C84.944 12 85.822 12.46 87.578 13.382Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <path opacity="0.1" d="M108 22L172 22" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <circle opacity="0.1" cx="184" cy="22" r="4" fill="white"/>
                <path opacity="0.1" d="M190 22L312 22" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <circle opacity="0.1" cx="324" cy="22" r="4" fill="white"/>
            </svg>
        </div>

        <!-- Order Details Card (Modified for Return Details) -->
        <!-- This section would render if data.orderDetails is present -->
        <div class="card bg-[#333333] rounded-xl p-4 flex flex-col gap-3">
            <!-- Header -->
            <div class="text-lg font-bold text-white mb-2">Return details</div>
            <!-- Return Date -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Return Date</span>
                <span class="text-white">July 24, 2025 <!-- Example: data.orderDetails.date or 'N/A' as fallback --></span>
            </div>
            <!-- Refund Amount -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Refund Amount</span>
                <span class="text-white">$199.99 <!-- Example: data.orderDetails.price or 'N/A' as fallback --></span>
            </div>
            <!-- Return Method -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Return Method</span>
                <span class="text-white">Courier Pickup <!-- Example: data.orderDetails.shipping or 'N/A' as fallback --></span>
            </div>
            <!-- Refund to -->
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Refund to</span>
                <span class="text-white">
                    <i class="fab fa-cc-mastercard text-xl text-orange-500 mr-1"></i>
                    **** 1234 <!-- Example: data.orderDetails.paymentLastFour or 'N/A' as fallback -->
                </span>
            </div>
        </div>

        <!-- Track Package Button (Modified for Return Tracking) -->
        <!-- This button would render if data.showTrackPackageButton is true -->
        <button class="bg-[#FFFFFF] text-black py-3 px-6 border-none rounded-xl cursor-pointer text-base font-bold text-center transition-colors duration-300 w-[calc(100%-2rem)] self-center mt-2 hover:bg-[#0056b3]">
            Track Return
        </button>

    </div>
</body>
</html>
"`;

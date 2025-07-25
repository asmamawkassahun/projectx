export const emailListPrompt =`"Create a single HTML page with a dark theme. The page should be centered with a maximum width suitable for mobile viewing (e.g., w-full), have overall 1.5rem rounded corners, and a background color of #282828 for the main content area. The main content area should also have a subtle box-shadow (0 4px 10px rgba(0, 0, 0, 0.3)). Use the 'Inter' font, loaded from Google Fonts. The body of the page should have a background color of #1a1a1a, be a flex container to center its content, align items to the start of the cross-axis, , and around the main container.

The UI should consist of the following components, stacked vertically with 1rem spacing between them:

Header/Title

A text-xl sized, font-semibold white text that reads: Emails

Horizontal Spacer Line

A thin horizontal line with a color of rgba(255, 255, 255, 0.1) and vertical margins of 1rem (achieved via my-4 or margin-top: 1rem; margin-bottom: 1rem;). This line should be placed directly after the Header/Title.

Email List (Dynamic Component)

The email list should be dynamically generated. For each email, the following data points should be used to render the component: sender name, sender initials, a sender-specific hex color for the avatar background, email subject, an optional snippet of the email body, an optional relative timestamp (e.g., \"Yesterday\"), an optional specific time (e.g., \"3:31 PM\"), and an optional boolean indicating whether a reply/forward icon should be shown. If an optional component's data is not provided, that component should not be rendered.

For each email, render an email item with the following structure:

Email Item Container: A div with flex items-start gap-4 relative.

Avatar: A 40x40px, rounded avatar (img tag) with the sender's theme color as the background color. The src should be a placeholder image like https://placehold.co/40x40/[SENDER_HEX_COLOR]/FFFFFF?text=[SENDER_INITIALS]).

Email Details: A div with flex-1 flex flex-col gap-2 containing the following:

Sender Name: A span with font-semibold text-sm bg-[#484848] px-3 py-1 rounded-xl w-fit text-white. This will display the sender's name.

Subject: A h2 with text-lg font-bold text-white mt-2. This will display the email subject.

Email Body/Snippet (Optional): A p with text-base text-gray-300. This will display the snippet of the email body.

Status/Timestamp (Optional): A div with flex items-center text-sm text-gray-400.

Custom Blue Double Checkmark SVG Icon: (width=\"22\" height=\"13\" viewBox=\"0 0 22 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (M5.70011 13.0001L0.0501099 7.3501L1.47511 5.9501L7.12511 11.6001L5.70011 13.0001ZM11.3501 13.0001L5.70011 7.3501L7.10011 5.9251L11.3501 10.1751L20.5501 0.975098L21.9501 2.4001L11.3501 13.0001ZM11.3501 7.3501L9.92511 5.9501L14.8751 1.0001L16.3001 2.4001L11.3501 7.3501Z\" fill=\"#1078FF\") preceding the text: \"Received: [Relative Timestamp], [Time]\". The icon should have a mr-2\` class.


SVG Icon: (width=\"16\" height=\"14\" viewBox=\"0 0 16 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\") with a path (\`M7.99954 4.00958V0.182129L0.329407 7.00002L7.99954 13.8179V9.98592C10.2361 9.96191 11.5143 10.2111 12.3264 10.6171C13.1683 11.0381 13.5867 11.665 14.0699 12.6315L15.3329 12.3334C15.3329 9.47717 14.9232 7.32861 13.6125 5.92075C12.3937 4.61169 10.5325 4.08468 7.99954 4.00958Z\` fill=\"white\").

Horizontal Spacer Line

A thin horizontal line with a color of rgba(255, 255, 255, 0.1) and vertical margins of 1rem (achieved via my-4 or margin-top: 1rem; margin-bottom: 1rem;). This line should separate each email item.

Custom CSS Rules:

Define CSS variables --card-custom-rounded: 1.5rem; and --card-custom-inner-rounded: 1rem;.

Apply font-family: 'Inter', sans-serif; to the body.

Ensure text within the main content container (.main-content-container) prevents overflow with overflow: hidden;, word-wrap: break-word;, and overflow-wrap: break-word; for all direct children and specific text elements (paragraphs, headings, spans, and divs).

Add a CSS rule for .spacer-line with height: 1px; background-color: rgba(255, 255, 255, 0.1); and appropriate vertical margins of 1rem.

Negative Prompt:

Do not add any borders to any elements in the UI, including but not limited to the Email Item Container, Avatar, or any other components. Ensure all elements have border: none; to avoid any border styling."`;
      
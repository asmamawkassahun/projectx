import { LinkItem } from "@/types/linkItems";
import { url } from "inspector";

export const linkItems: LinkItem[] = [
  {
    id: "1",
    question: "What Is Calamansi?",
    source: "foodnetwork",
    url: "https://www.foodnetwork.com/recipes/articles/what-is-calamansi",
    content:
      "Calamansi is a citrus fruit native to the Philippines and other parts of Southeast Asia. It's small, round, and has a thin green or orange skin when ripe.",
  },
  {
    id: "2",
    question: "What Is Calamansi And How Do You Cook With It?",
    source: "rezelkealoha",
    url: "https://www.rezelkealoha.com/what-is-calamansi-and-how-do-you-cook-with-it/",
    content: {
      type: "images",
      images: [
        {
          src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "Calamansi dish 1",
        },
        {
          src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "Calamansi dish 2",
        },
        {
          src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "Calamansi dish 3",
        },
      ],
    },
  },
  {
    id: "3",
    question: "Harvested a lot of calamansi(Philippine lemon or lime) this ",
    url: "https://www.reddit.com/r/food/comments/1z5x3y2/harvested_a_lot_of_calamansiphilippine_lemon_or/",
    source: "reddit",
    content:
      "Many people harvest calamansi and use them for juice, preserves, or cooking. They can be stored in the refrigerator or processed into juice concentrate.",
  },
];

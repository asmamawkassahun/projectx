export const dummyRecipes = [
  {
    id: "1",
    image: "/images/placeholder.png?height=80&width=120",
    title: "Easy Baked Salmon",
    description:
      "A simple and delicious recipe for baked salmon with asparagus.",
  },
  {
    id: "2",
    image: "/images/placeholder.png?height=80&width=120",
    title: "Pistachio Crusted Salmon",
    description: "Elevate your salmon with a crunchy pistachio crust.",
  },
  {
    id: "3",
    image: "/images/placeholder.png?height=80&width=120",
    title: "Creamy Garlic Parmesan Chicken",
    description: "Indulgent chicken dish with a rich garlic parmesan sauce.",
  },
  {
    id: "4",
    image: "/images/placeholder.png?height=80&width=120",
    title: "Mediterranean Baked Cod",
    description: "Healthy and flavorful cod baked with tomatoes and olives.",
  },
];

export type Recipe = (typeof dummyRecipes)[number];

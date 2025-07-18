export const dummyIngredients = [
  {
    category: "For the Fish",
    items: [
      "4 cod fillets (6 oz each), skin removed",
      "Salt and freshly ground black pepper, to taste",
      "2 tablespoons olive oil",
      "1 lemon, sliced for garnish",
      "Fresh dill, chopped for garnish",
    ],
  },
  {
    category: "For the Crust",
    items: [
      "1 cup roasted, shelled pistachios",
      "1/2 cup panko breadcrumbs",
      "2 tablespoons fresh calamansi juice (can substitute with 1 tablespoon lime juice + 1 tablespoon orange juice)",
      "Zest of 2 calamansi fruits (can substitute with 1 teaspoon lime zest)",
      "2 cloves garlic, minced",
      "2 tablespoons fresh cilantro, chopped",
      "1/4 teaspoon black pepper",
      "1/4 teaspoon red pepper flakes (optional)",
      "2 tablespoons melted butter",
      "...",
    ],
  },
  {
    category: "For the Sauce",
    items: [
      "1 tablespoon olive oil",
      "1 shallot, finely minced",
      "1/2 cup dry white wine",
      "1/4 cup heavy cream",
      "Salt and pepper to taste",
      "Fresh parsley, chopped",
    ],
  },
  {
    category: "Optional Garnish",
    items: [
      "Lemon wedges",
      "Fresh herbs (dill, parsley, cilantro)",
      "Extra calamansi zest",
    ],
  },
];

export type IngredientCategory = (typeof dummyIngredients)[number];

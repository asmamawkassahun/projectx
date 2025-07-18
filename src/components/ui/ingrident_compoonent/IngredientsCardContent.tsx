"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShadCnButton } from "@/components/ui/shadcnButton";
import { IngredientCategory } from "@/lib/data/dummyIngredients ";
import { useState } from "react";

interface IngredientsCardContentProps {
  ingredients: IngredientCategory[];
}

export function IngredientsCardContent({
  ingredients,
}: IngredientsCardContentProps) {
  const [showAll, setShowAll] = useState(false);

  // Determine how many categories to show initially (e.g., first 2 categories)
  const initialCategoriesToShow = 2;
  const categoriesToShow = showAll
    ? ingredients
    : ingredients.slice(0, initialCategoriesToShow);

  // Check if the "See more" button should be displayed
  const shouldShowButton = ingredients.length > initialCategoriesToShow;

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  return (
    <div className="w-full max-w-[35.75rem] space-y-6 bg-background">
      <h2 className="text-xl font-semibold leading-[135%] text-foreground">
        Ingredients
      </h2>
      <div className="space-y-4">
        {categoriesToShow.map((category, index) => (
          <Card
            key={index}
            className="dark:bg-[#1a1a1a] bg-black/10 border-none p-3"
          >
            <CardHeader className="">
              <h3 className="text-sm font-semibold text-foreground/40">
                {category.category}
              </h3>
            </CardHeader>
            <CardContent className="">
              <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      {shouldShowButton && (
        <ShadCnButton
          onClick={toggleShowAll}
          className="text-xs font-semibold text-foreground hover:bg-transparent rounded-full px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10"
        >
          {showAll ? "See less" : "See more"}
        </ShadCnButton>
      )}
    </div>
  );
}

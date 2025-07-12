"use client";

import {
  dummyIngredients,
  IngredientCategory,
} from "@/lib/data/dummyIngredients ";
import { useState, useEffect } from "react";
import { IngredientsCardSkeleton } from "../ingrident_compoonent/IngredientsCardSkeleton";
import { IngredientsCardContent } from "../ingrident_compoonent/IngredientsCardContent";
import { ShadCnButton } from "@/components/ui/shadcnButton";

export default function IngredientsCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IngredientCategory[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyIngredients);
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  const resetLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full flex min-h-screen justify-center bg-background">
      {isLoading ? (
        <IngredientsCardSkeleton />
      ) : (
        <IngredientsCardContent ingredients={data} />
      )}

      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}

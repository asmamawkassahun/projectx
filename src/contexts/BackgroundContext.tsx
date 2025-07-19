"use client";

import { useTheme } from "next-themes";
import React, { createContext, useContext, useState } from "react";

interface BackgroundContextType {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  isVoiceModeActive: boolean;
  setIsVoiceModeActive: (active: boolean) => void;
  backgroundImage: string;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
};

interface BackgroundProviderProps {
  children: React.ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const { resolvedTheme } = useTheme();
  console.log("isactive", isActive);
  // Determine which background to show based on theme and state
  const backgroundImage = (() => {
    if (isActive || isVoiceModeActive) {
      // Active state - use theme-appropriate background
      return resolvedTheme === "light"
        ? "/icons/background_light.svg"
        : "/icons/background.svg";
    } else {
      // Inactive state - use theme-appropriate first screen background
      return resolvedTheme === "light"
        ? "/icons/background_first_screen_light.svg"
        : "/icons/background_first_screen.svg";
    }
  })();

  return (
    <BackgroundContext.Provider
      value={{
        isActive,
        setIsActive,
        isVoiceModeActive,
        setIsVoiceModeActive,
        backgroundImage,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

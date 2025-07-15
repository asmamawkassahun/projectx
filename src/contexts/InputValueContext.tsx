import React, { createContext, useContext, useState, ReactNode } from "react";

interface InputValueContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const InputValueContext = createContext<InputValueContextType | undefined>(
  undefined
);

export const InputValueProvider = ({ children }: { children: ReactNode }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <InputValueContext.Provider value={{ inputValue, setInputValue }}>
      {children}
    </InputValueContext.Provider>
  );
};

export const useInputValueContext = () => {
  const context = useContext(InputValueContext);
  if (!context) {
    throw new Error("useInputValue must be used within an InputValueProvider");
  }
  return context;
};

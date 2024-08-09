"use client";

import { Prediction } from "@/data-access/prediction";
import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  remainingQuota: number | null;
  setRemainingQuota: React.Dispatch<React.SetStateAction<number | null>>;
  originalImage: File | null;
  setOriginalImage: React.Dispatch<React.SetStateAction<File | null>>;
  prediction: Prediction | null;
  setPrediction: React.Dispatch<React.SetStateAction<Prediction | null>>;
  gradCamName: string | null;
  setGradCamName: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [gradCamName, setGradCamName] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        remainingQuota,
        setRemainingQuota,
        originalImage,
        setOriginalImage,
        prediction,
        setPrediction,
        gradCamName,
        setGradCamName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContext.Provider");
  }
  return context;
}

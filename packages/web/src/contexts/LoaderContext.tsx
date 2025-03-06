import React, { createContext, useContext, useState } from "react";
import Loader from "@/components/ui/Loader";

interface LoaderContextProps {
  showLoader: (message: string, status?: "loading" | "success" | "error") => void;
  hideLoader: () => void;
  loaderState: { message: string; status: "loading" | "success" | "error" } | null;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loaderState, setLoaderState] = useState<{ message: string; status: "loading" | "success" | "error" } | null>(null);

  const showLoader = (message: string, status: "loading" | "success" | "error" = "loading") => {
    setLoaderState({ message, status });
  };

  const hideLoader = () => {
    setLoaderState(null);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, loaderState }}>
      {children}
      <Loader />
    </LoaderContext.Provider>
  );
};

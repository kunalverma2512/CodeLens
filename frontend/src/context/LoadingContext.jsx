import { createContext, useContext, useMemo, useState } from "react";
import GlobalLoadingOverlay from "../components/shared/GlobalLoadingOverlay";

const LoadingContext = createContext(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      isLoading,
      setLoading,
      showLoading: () => setLoading(true),
      hideLoading: () => setLoading(false),
    }),
    [isLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoadingOverlay visible={isLoading} />
    </LoadingContext.Provider>
  );
};

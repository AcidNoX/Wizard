import { createContext, useContext } from "react";

export type ShellContextType = {
  closeShell: () => void;
};

export const ShellContext = createContext<ShellContextType>({
  closeShell: () => {},
});

export const ShellProvider = ShellContext.Provider;

export const useShell = (): ShellContextType => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
};

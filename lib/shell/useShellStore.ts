import { nanoid } from "nanoid";
import "react-native-get-random-values
";
import { create } from "zustand";

type ShellStore = {
  shell?: {
    id: string;
    Element: React.ReactNode;
  };
  openShell: (Element: React.ReactNode) => void;
  closeShell: () => void;
};

export const useShellStore = create<ShellStore>()((set) => ({
  shell: undefined,
  openShell: (Element) => set({ shell: { Element, id: nanoid() } }),
  closeShell: () => set({ shell: undefined }),
}));

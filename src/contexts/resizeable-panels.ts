import { createContext, useContext } from "react";
import { ImperativePanelHandle, PanelOnResize } from "react-resizable-panels";

export type PanelState = {
  isOpen: boolean;
  minSize: number,
  maxSize: number,
};

type Setters = Pick<ImperativePanelHandle, "collapse" | "expand"> & {
  attachHandle: (handle: ImperativePanelHandle) => void;
  onResize: PanelOnResize;
  getSize: () => number;
};

export const getDriveContext = createContext<PanelState>({
  isOpen: true,
  minSize: 10,
  maxSize: 15,
});

export const setDriveContext = createContext<Setters>({
  expand: async () => ({}),
  collapse: () => {
    // todo()!
  },
  getSize: () => 0,
  onResize: () => ({}),
  attachHandle: () => ({}),
});

export const useGetLayout = () => useContext(getDriveContext);
export const useSetLayout = () => useContext(setDriveContext);

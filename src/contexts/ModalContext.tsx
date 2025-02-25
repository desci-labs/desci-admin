import { createContext, PropsWithChildren, useContext } from "react";
import { ImperativePanelHandle, PanelOnResize } from "react-resizable-panels";

export type Modals = 'new-users' | 'active-users'
export type ModalState = {
  isOpen: boolean;
  active?: Modals
  extra?: { [key: string]: string | any }
};

type Setters = {
    showModal: (kind: Modals, extra?: any) => void;
    closeModal: () => void;
};

export const getModalContext = createContext<ModalState>({
  isOpen: false,
});

export const setModalContext = createContext<Setters>({
  showModal: () => ({}),
  closeModal: () => ({}),
});

export const useGetModal = () => useContext(getModalContext);
export const useSetModal = () => useContext(setModalContext);

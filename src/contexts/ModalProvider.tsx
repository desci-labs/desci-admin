import { PropsWithChildren, useState } from "react";
import {
  getModalContext,
  Modals,
  ModalState,
  setModalContext,
} from "@/contexts/ModalContext";

export default function ModalProvider(props: PropsWithChildren<unknown>) {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    active: undefined,
  });

  const showModal = (kind: Modals, extra: any ) => {
    setState((prev) => ({ isOpen: true, active: kind, extra}));
  };

  const closeModal = () => {
    setState((prev) => ({ isOpen: false, active: undefined, extra: undefined }));
  };

  return (
    <getModalContext.Provider value={state}>
      <setModalContext.Provider value={{ showModal, closeModal }}>
        {props.children}
      </setModalContext.Provider>
    </getModalContext.Provider>
  );
}

"use client";

import * as React from "react";

export type ModalType = "login" | "register" | "verify-email" | "logout";

export type ModalState = {
  isOpen: boolean;
  type: ModalType | null;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
};

export const ModalContext = React.createContext<ModalState>({
  isOpen: false,
  type: null,
  onOpen: () => {},
  onClose: () => {},
});

export function useModal() {
  return React.useContext(ModalContext);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState<ModalType | null>(null);

  const onOpen = React.useCallback((type: ModalType) => {
    setType(type);
    setIsOpen(true);
  }, []);

  const onClose = React.useCallback(() => {
    setType(null);
    setIsOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({ isOpen, type, onOpen, onClose }),
    [isOpen, onClose, onOpen, type]
  );

  return (
    <ModalContext.Provider value={value}>
      <Modals />
      {children}
    </ModalContext.Provider>
  );
}

function Modals() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <></>;
}

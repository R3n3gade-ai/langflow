import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const RIGHT_SIDEBAR_COOKIE_NAME = "right-sidebar:state";

interface RightSidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const RightSidebarContext = React.createContext<RightSidebarContextType | null>(null);

export function useRightSidebar() {
  const context = React.useContext(RightSidebarContext);
  if (!context) {
    throw new Error("useRightSidebar must be used within a RightSidebarProvider");
  }
  return context;
}

interface RightSidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function RightSidebarProvider({
  children,
  defaultOpen = true
}: RightSidebarProviderProps) {
  const isMobile = useIsMobile();

  // Get initial state from cookie
  const getInitialState = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const rightSidebarCookie = cookies.find(cookie =>
        cookie.trim().startsWith(`${RIGHT_SIDEBAR_COOKIE_NAME}=`)
      );
      if (rightSidebarCookie) {
        return rightSidebarCookie.split('=')[1] === 'true';
      }
    }
    return defaultOpen && !isMobile;
  };

  const [isOpen, setIsOpen] = React.useState(getInitialState);

  const setOpen = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    // Save to cookie
    if (typeof document !== 'undefined') {
      document.cookie = `${RIGHT_SIDEBAR_COOKIE_NAME}=${newOpen}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  }, []);

  const toggle = React.useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  // Close on mobile by default
  React.useEffect(() => {
    if (isMobile && isOpen) {
      setOpen(false);
    }
  }, [isMobile, isOpen, setOpen]);

  const contextValue = React.useMemo(() => ({
    isOpen,
    toggle,
    setOpen,
  }), [isOpen, toggle, setOpen]);

  return (
    <RightSidebarContext.Provider value={contextValue}>
      {children}
    </RightSidebarContext.Provider>
  );
}

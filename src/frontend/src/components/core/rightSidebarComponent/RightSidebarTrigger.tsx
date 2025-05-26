import React from "react";
import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { cn } from "@/utils/utils";

interface RightSidebarTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function RightSidebarTrigger({ 
  isOpen, 
  onToggle, 
  className 
}: RightSidebarTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-7 w-7 text-muted-foreground hover:text-foreground",
        "fixed top-16 right-4 z-50 bg-background border border-border shadow-sm",
        className
      )}
      onClick={onToggle}
      data-testid="right-sidebar-trigger"
    >
      <ForwardedIconComponent
        name={isOpen ? "PanelRightClose" : "PanelRightOpen"}
        className="h-4 w-4"
      />
      <span className="sr-only">Toggle Right Sidebar</span>
    </Button>
  );
}

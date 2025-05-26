import { useState } from "react";
import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { CustomIOModal } from "@/customization/components/custom-new-modal";
import { PLAYGROUND_BUTTON_NAME } from "@/constants/constants";
import { track } from "@/customization/utils/analytics";
import useFlowStore from "@/stores/flowStore";

export default function HeaderPlaygroundButton(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const hasIO = useFlowStore((state) => state.hasIO);

  const handlePlaygroundOpen = (): void => {
    setOpen(true);
    track("Playground Opened", {
      source: "header_button",
      timestamp: new Date().toISOString()
    });
  };

  const PlayIcon = () => (
    <ForwardedIconComponent
      name="Play"
      className="h-4 w-4"
    />
  );

  const ActiveButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={handlePlaygroundOpen}
      data-testid="header-playground-btn"
      aria-label="Open playground"
    >
      <PlayIcon />
    </Button>
  );

  const DisabledButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 cursor-not-allowed text-muted-foreground"
      disabled
      data-testid="header-playground-btn-disabled"
    >
      <PlayIcon />
    </Button>
  );

  return hasIO ? (
    <ShadTooltip content={PLAYGROUND_BUTTON_NAME} side="bottom">
      <CustomIOModal
        open={open}
        setOpen={setOpen}
        disable={!hasIO}
        canvasOpen={true}
      >
        <ActiveButton />
      </CustomIOModal>
    </ShadTooltip>
  ) : (
    <ShadTooltip content="Add a Chat Input or Chat Output to use the playground" side="bottom">
      <div>
        <DisabledButton />
      </div>
    </ShadTooltip>
  );
}

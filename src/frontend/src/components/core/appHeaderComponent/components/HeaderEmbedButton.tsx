import { useState } from "react";
import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import EmbedModal from "@/modals/EmbedModal/embed-modal";
import { track } from "@/customization/utils/analytics";
import useFlowStore from "@/stores/flowStore";
import { useTweaksStore } from "@/stores/tweaksStore";
import { useParams } from "react-router-dom";

export default function HeaderEmbedButton(): JSX.Element {
  const [openEmbedModal, setOpenEmbedModal] = useState(false);
  const { id: flowId } = useParams();
  const currentFlow = useFlowStore((state) => state.currentFlow);
  const tweaks = useTweaksStore((state) => state.tweaks);
  const activeTweaks = useTweaksStore((state) => state.activeTweaks);

  const handleEmbedModalOpen = (): void => {
    setOpenEmbedModal(true);
    track("Embed Modal Opened", {
      flowId: flowId,
      flowName: currentFlow?.name,
      source: "header_button",
      timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      <ShadTooltip content="Generate embed code for your website" side="bottom">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleEmbedModalOpen}
          data-testid="header-embed-btn"
          aria-label="Open embed code modal"
        >
          <ForwardedIconComponent
            name="Code"
            className="h-4 w-4"
          />
        </Button>
      </ShadTooltip>

      <EmbedModal
        open={openEmbedModal}
        setOpen={setOpenEmbedModal}
        flowId={flowId || ""}
        flowName={currentFlow?.name || ""}
        isAuth={false}
        tweaksBuildedObject={tweaks || {}}
        activeTweaks={activeTweaks}
      />
    </>
  );
}

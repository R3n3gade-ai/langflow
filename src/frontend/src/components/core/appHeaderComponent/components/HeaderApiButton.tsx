import { useState } from "react";
import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import ApiModal from "@/modals/apiModal";
import { track } from "@/customization/utils/analytics";
import useFlowStore from "@/stores/flowStore";

export default function HeaderApiButton(): JSX.Element {
  const [openApiModal, setOpenApiModal] = useState(false);
  const currentFlow = useFlowStore((state) => state.currentFlow);

  const handleApiModalOpen = (): void => {
    setOpenApiModal(true);
    track("API Modal Opened", {
      flowId: currentFlow?.id,
      flowName: currentFlow?.name,
      source: "header_button",
      timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      <ShadTooltip content="View API access and documentation" side="bottom">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleApiModalOpen}
          data-testid="header-api-access-btn"
          aria-label="Open API access modal"
        >
          <ForwardedIconComponent
            name="Code2"
            className="h-4 w-4"
          />
        </Button>
      </ShadTooltip>

      {currentFlow && (
        <ApiModal
          flow={currentFlow}
          open={openApiModal}
          setOpen={setOpenApiModal}
        >
          <></>
        </ApiModal>
      )}
    </>
  );
}

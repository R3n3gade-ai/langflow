import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import useAddFlow from "@/hooks/flows/use-add-flow";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { track } from "@/customization/utils/analytics";
import { toast } from "sonner";
import HeaderApiButton from "./HeaderApiButton";
import HeaderEmbedButton from "./HeaderEmbedButton";
import HeaderMcpButton from "./HeaderMcpButton";
import HeaderPlaygroundButton from "./HeaderPlaygroundButton";
import HeaderShareButton from "./HeaderShareButton";
import useFlowStore from "@/stores/flowStore";
import { useFolderStore } from "@/stores/foldersStore";

export default function HeaderToolbar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [isCreatingFlow, setIsCreatingFlow] = useState<boolean>(false);
  const hasIO = useFlowStore((state) => state.hasIO);
  const location = useLocation();
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);

  const handleCreateNewFlow = async (): Promise<void> => {
    if (isCreatingFlow) return; // Prevent double-clicks

    setIsCreatingFlow(true);

    try {
      const id = await addFlow();
      const folderIdUrl = folderId ?? myCollectionId;

      // Track successful creation
      track("New Flow Created", {
        template: "Blank Flow",
        folderId: folderIdUrl,
        timestamp: new Date().toISOString()
      });

      // Navigate to new flow
      navigate(
        `/flow/${id}${folderIdUrl ? `/folder/${folderIdUrl}` : ""}`,
      );

      // Show success feedback
      toast.success("New flow created successfully!");

    } catch (error) {
      console.error("Failed to create new flow:", error);

      // Track error
      track("New Flow Creation Failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });

      // Show error feedback
      toast.error("Failed to create new flow. Please try again.");
    } finally {
      setIsCreatingFlow(false);
    }
  };

  // Show toolbar on flow pages and main flows page
  const isFlowPage = location.pathname.includes("/flow/");
  const isFlowsPage = location.pathname.includes("/flows") || location.pathname === "/";

  if (!isFlowPage && !isFlowsPage) {
    return <></>;
  }

  return (
    <div className="flex items-center gap-1">
      {/* New Flow Button */}
      <ShadTooltip content="Create a new flow" side="bottom">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3"
          onClick={handleCreateNewFlow}
          disabled={isCreatingFlow}
          data-testid="new-flow-btn"
          aria-label="Create new flow"
        >
          <ForwardedIconComponent
            name={isCreatingFlow ? "Loader2" : "Plus"}
            className={`h-4 w-4 mr-1 ${isCreatingFlow ? "animate-spin" : ""}`}
          />
          {isCreatingFlow ? "Creating..." : "New Flow"}
        </Button>
      </ShadTooltip>

      {/* Playground Button */}
      <HeaderPlaygroundButton />

      {/* API Access Button */}
      <HeaderApiButton />

      {/* MCP Server Button */}
      <HeaderMcpButton />

      {/* Embed Button */}
      <HeaderEmbedButton />

      {/* Shareable Playground Button */}
      <HeaderShareButton />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { CustomLink } from "@/customization/components/custom-link";
import { ENABLE_PUBLISH } from "@/customization/feature-flags";
import { cn } from "@/utils/utils";
import { track } from "@/customization/utils/analytics";
import { toast } from "sonner";
import useFlowStore from "@/stores/flowStore";
import { useParams } from "react-router-dom";
import { usePatchUpdateFlow } from "@/controllers/API/queries/flows/use-patch-update-flow";

export default function HeaderShareButton(): JSX.Element {
  const { id: flowId } = useParams();
  const hasIO = useFlowStore((state) => state.hasIO);
  const currentFlow = useFlowStore((state) => state.currentFlow);

  // Derive isPublished from the flow's endpoint_name
  const isPublished = Boolean(currentFlow?.endpoint_name);

  const setIsPublished = (published: boolean) => {
    // This would need to be implemented to update the flow's endpoint_name
    console.log("Setting published state:", published);
  };

  const { mutate: patchFlow } = usePatchUpdateFlow();
  const domain = window.location.origin; // Use current domain

  const handleShareLinkClick = (): void => {
    track("Share Link Clicked", {
      flowId: flowId,
      flowName: currentFlow?.name,
      source: "header_button",
      timestamp: new Date().toISOString()
    });
  };

  const handlePublishedSwitch = async (currentState: boolean): Promise<void> => {
    if (!flowId) {
      toast.error("Flow ID not found");
      return;
    }

    const newState = !currentState;

    try {
      setIsPublished(newState);

      await patchFlow({
        id: flowId,
        endpoint_name: newState ? flowId : null,
      });

      // Track the action
      track("Flow Publication Toggled", {
        flowId: flowId,
        flowName: currentFlow?.name,
        published: newState,
        source: "header_button",
        timestamp: new Date().toISOString()
      });

      // Show success feedback
      toast.success(
        newState
          ? "Flow published successfully! Share link is now active."
          : "Flow unpublished successfully."
      );

    } catch (error) {
      console.error("Failed to update flow publication status:", error);

      // Revert the state on error
      setIsPublished(currentState);

      // Track error
      track("Flow Publication Failed", {
        flowId: flowId,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });

      // Show error feedback
      toast.error("Failed to update publication status. Please try again.");
    }
  };

  if (!ENABLE_PUBLISH) {
    return <></>;
  }

  return (
    <ShadTooltip
      content={
        hasIO
          ? isPublished
            ? encodeURI(`${domain}/playground/${flowId}`)
            : "Activate to share a public version of this Playground"
          : "Add a Chat Input or Chat Output to access your flow"
      }
      side="bottom"
    >
      <div className="flex items-center gap-1">
        <CustomLink
          className={cn(
            "flex-1",
            !hasIO || !isPublished
              ? "pointer-events-none cursor-default"
              : "",
          )}
          to={`/playground/${flowId}`}
          target="_blank"
          onClick={handleShareLinkClick}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={!hasIO || !isPublished}
            data-testid="header-shareable-playground-btn"
            aria-label={isPublished ? "Open shareable playground" : "Publish flow to enable sharing"}
          >
            <ForwardedIconComponent
              name="Globe"
              className="h-4 w-4"
            />
          </Button>
        </CustomLink>

        <Switch
          data-testid="header-publish-switch"
          className="scale-75"
          checked={isPublished}
          disabled={!hasIO}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePublishedSwitch(isPublished);
          }}
        />
      </div>
    </ShadTooltip>
  );
}

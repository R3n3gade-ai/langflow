import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { CustomLink } from "@/customization/components/custom-link";
import { cn } from "@/utils/utils";
import { track } from "@/customization/utils/analytics";
import { useParams } from "react-router-dom";
import { useFolderStore } from "@/stores/foldersStore";

export default function HeaderMcpButton(): JSX.Element {
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);
  const folderIdUrl = folderId ?? myCollectionId ?? "default";

  const handleMcpClick = (): void => {
    track("MCP Server Accessed", {
      folderId: folderIdUrl,
      source: "header_button",
      timestamp: new Date().toISOString()
    });
  };

  const customMcpOpen = () => {
    return "_blank";
  };

  return (
    <ShadTooltip content="Access MCP Server configuration" side="bottom">
      <CustomLink
        className={cn("flex-1")}
        to={`/mcp/folder/${folderIdUrl}`}
        target={customMcpOpen()}
        onClick={handleMcpClick}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          data-testid="header-mcp-server-btn"
          aria-label="Open MCP Server configuration"
        >
          <ForwardedIconComponent
            name="Zap"
            className="h-4 w-4"
          />
        </Button>
      </CustomLink>
    </ShadTooltip>
  );
}

import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import { useFolderStore } from "@/stores/foldersStore";
import useAddFlow from "@/hooks/flows/use-add-flow";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { track } from "@/customization/utils/analytics";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

type EmptyFolderProps = {
  setOpenModal: (open: boolean) => void;
};

export const EmptyFolder = ({ setOpenModal }: EmptyFolderProps) => {
  const folders = useFolderStore((state) => state.folders);
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();

  // Automatically create a new flow when component mounts
  useEffect(() => {
    const createNewFlow = () => {
      addFlow().then((id) => {
        navigate(
          `/flow/${id}${folderId ? `/folder/${folderId}` : ""}`,
        );
      });
      track("New Flow Created", { template: "Blank Flow", source: "Auto-created" });
    };

    // Small delay to ensure everything is loaded
    const timer = setTimeout(createNewFlow, 100);
    return () => clearTimeout(timer);
  }, [addFlow, navigate, folderId]);

  return (
    <div className="m-0 flex w-full justify-center">
      <div className="absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2">
        <h3
          className="pt-5 font-chivo text-2xl font-semibold"
          data-testid="mainpage_title"
        >
          Creating your first flow...
        </h3>
        <p className="pb-5 text-sm text-secondary-foreground">
          Setting up your canvas workspace.
        </p>
        <div className="flex items-center gap-2">
          <ForwardedIconComponent
            name="Loader2"
            className="h-4 w-4 animate-spin"
          />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyFolder;

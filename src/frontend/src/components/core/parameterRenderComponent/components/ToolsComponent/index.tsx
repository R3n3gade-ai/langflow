import { ICON_STROKE_WIDTH } from "@/constants/constants";
import ToolsModal from "@/modals/toolsModal";
import { cn, testIdCase } from "@/utils/utils";
import { useState } from "react";
import { ForwardedIconComponent } from "../../../../common/genericIconComponent";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Skeleton } from "../../../../ui/skeleton";
import { InputProps, ToolsComponentType } from "../../types";

export default function ToolsComponent({
  description,
  value,
  editNode = false,
  id = "",
  handleOnNewValue,
  isAction = false,
  button_description,
  title,
  icon,
  disabled = false,
  template,
}: InputProps<any[] | undefined, ToolsComponentType>): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actions = value
    ?.filter((action) => action.status === true)
    .map((action) => {
      return {
        name: action.name,
        tags: action.tags,
        description: action.description,
      };
    });

  const visibleActionsQt = isAction ? 20 : 4;

  const visibleActions = actions?.slice(0, visibleActionsQt) || [];
  const remainingCount = actions
    ? Math.max(0, actions.length - visibleActionsQt)
    : 0;

  return (
    <div
      className={cn(
        "flex w-full items-center",
        disabled && "cursor-not-allowed",
      )}
    >
      {value && (
        <ToolsModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          isAction={isAction}
          description={description}
          rows={value}
          handleOnNewValue={handleOnNewValue}
          title={title}
          icon={icon}
        />
      )}
      <div
        className="relative flex w-full items-center gap-3"
        data-testid={"div-" + id}
      >
        {(visibleActions.length > 0 || isAction) && (
          <Button
            variant={"ghost"}
            disabled={!value || disabled}
            size={"iconMd"}
            className={cn(
              "absolute -top-8 right-0 !text-mmd font-normal text-muted-foreground group-hover:text-primary",
            )}
            data-testid="button_open_actions"
            onClick={() => setIsModalOpen(true)}
          >
            <ForwardedIconComponent
              name="Settings2"
              className="icon-size"
              strokeWidth={ICON_STROKE_WIDTH}
            />
            {button_description}
          </Button>
        )}
        {!value ? (
          <div className="flex w-full flex-wrap gap-1 overflow-hidden py-1.5">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        ) : visibleActions.length > 0 ? (
          <div className="grid grid-cols-6 gap-2 w-full py-1.5">
            {visibleActions.map((action, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[60px] aspect-square"
                data-testid={testIdCase(`tool_${action.name}`)}
              >
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mb-1">
                  <ForwardedIconComponent
                    name="Zap"
                    className="h-3 w-3 text-muted-foreground"
                  />
                </div>
                <span className="text-xs font-medium text-center leading-tight px-1 truncate">
                  {action.name}
                </span>
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
            ))}
            {/* Add some placeholder connections */}
            <div className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[60px] aspect-square">
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mb-1">
                <ForwardedIconComponent name="Mail" className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-center leading-tight px-1">Gmail</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[60px] aspect-square">
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mb-1">
                <ForwardedIconComponent name="MessageSquare" className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-center leading-tight px-1">Slack</span>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[60px] aspect-square">
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mb-1">
                <ForwardedIconComponent name="Github" className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-center leading-tight px-1">GitHub</span>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[60px] aspect-square">
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mb-1">
                <ForwardedIconComponent name="FileText" className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-center leading-tight px-1">Notion</span>
            </div>
            {remainingCount > 0 && (
              <div className="flex items-center justify-center col-span-2">
                <span className="text-xs font-normal text-muted-foreground">
                  +{remainingCount} more
                </span>
              </div>
            )}
          </div>
        ) : (
          visibleActions.length === 0 &&
          isAction && (
            <div className="mt-2 flex w-full flex-col items-center gap-2 rounded-md border border-dashed p-8">
              <span className="text-sm text-muted-foreground">
                No actions added to this server
              </span>
              <Button size={"sm"} onClick={() => setIsModalOpen(true)}>
                <span>Add actions</span>
              </Button>
            </div>
          )
        )}

        {visibleActions.length === 0 && !isAction && value && (
          <Button
            disabled={disabled}
            size={editNode ? "xs" : "default"}
            className={
              "w-full " +
              (disabled ? "pointer-events-none cursor-not-allowed" : "")
            }
            onClick={() => setIsModalOpen(true)}
          >
            <span>Select actions</span>
          </Button>
        )}
      </div>
    </div>
  );
}

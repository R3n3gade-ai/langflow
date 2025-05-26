import { Panel } from "@xyflow/react";

export default function FlowToolbar(): JSX.Element {
  console.log("FlowToolbar component is being rendered!");
  
  return (
    <Panel position="top-right" className="m-2">
      <div className="flex gap-2">
        <div>TOOLBAR SHOULD BE REMOVED</div>
      </div>
    </Panel>
  );
}

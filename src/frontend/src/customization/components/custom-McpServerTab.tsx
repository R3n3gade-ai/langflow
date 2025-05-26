import { useState } from "react";
import { Button } from "@/components/ui/button";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

// Sample connection data - you can replace with real data later
const connections = [
  { name: "Gmail", icon: "Mail", connected: true },
  { name: "Google Calendar", icon: "Calendar", connected: false },
  { name: "Notion", icon: "FileText", connected: true },
  { name: "Twitter", icon: "Twitter", connected: false },
  { name: "Slack", icon: "MessageSquare", connected: true },
  { name: "YouTube", icon: "Play", connected: false },
  { name: "GitHub", icon: "Github", connected: true },
  { name: "Supabase", icon: "Database", connected: false },
  { name: "Google Sheets", icon: "Sheet", connected: true },
  { name: "Airtable", icon: "Grid", connected: false },
  { name: "Ringcentral", icon: "Phone", connected: true },
  { name: "Reddit", icon: "MessageCircle", connected: false },
  { name: "Perplexity", icon: "Search", connected: true },
  { name: "Monday", icon: "Calendar", connected: false },
  { name: "Memo", icon: "StickyNote", connected: true },
  { name: "Mailchimp", icon: "Mail", connected: false },
  { name: "Luma", icon: "Volume2", connected: true },
  { name: "LinkedIn", icon: "Linkedin", connected: false },
  { name: "Haystack", icon: "Video", connected: true },
  { name: "Deepgram", icon: "Mic", connected: false },
  { name: "Google Analytics", icon: "BarChart", connected: true },
  { name: "Figma", icon: "Figma", connected: false },
  { name: "Facebook", icon: "Facebook", connected: true },
  { name: "Elevenlabs", icon: "Mic", connected: false },
  { name: "Dropbox", icon: "Cloud", connected: true },
  { name: "Docusign", icon: "FileText", connected: false },
  { name: "Discord", icon: "MessageSquare", connected: true },
  { name: "Datadog", icon: "BarChart", connected: false },
  { name: "Cloudflare", icon: "Cloud", connected: true },
  { name: "Codeinterpreter", icon: "Code", connected: false },
  { name: "Canva", icon: "Palette", connected: true },
  { name: "Calendly", icon: "Calendar", connected: false },
  { name: "Browserbase Tool", icon: "Globe", connected: true },
  { name: "Confluence", icon: "FileText", connected: false },
  { name: "Skype", icon: "Phone", connected: true },
  { name: "Compendium", icon: "Search", connected: false },
  { name: "Continua", icon: "ArrowRight", connected: true },
  { name: "Brave", icon: "Shield", connected: false },
];

export const CustomMcpServerTab = ({ folderName }: { folderName: string }) => {
  const [activeTab, setActiveTab] = useState<"tools" | "connections">("connections");

  return (
    <div className="h-full w-full">
      {/* Header with tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("tools")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tools"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "connections"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Connections
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "connections" && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Integrations</h2>
              <Button variant="outline" size="sm">
                <ForwardedIconComponent name="Plus" className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-8 gap-2">
              {connections.map((connection, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[80px]"
                >
                  <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mb-1">
                    <ForwardedIconComponent
                      name={connection.icon}
                      className="h-3 w-3 text-muted-foreground"
                    />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight px-1">{connection.name}</span>
                  {connection.connected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="text-center py-12">
            <ForwardedIconComponent name="Wrench" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Tools Coming Soon</h3>
            <p className="text-muted-foreground">Tool integrations will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMcpServerTab;

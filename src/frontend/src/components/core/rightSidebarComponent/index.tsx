import { useState, useEffect, useMemo, useRef } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { track } from "@/customization/utils/analytics";
import useAddFlow from "@/hooks/flows/use-add-flow";
import TemplateGetStartedCardComponent from "@/modals/templatesModal/components/TemplateGetStartedCardComponent";
import { TemplateCategoryComponent } from "@/modals/templatesModal/components/TemplateCategoryComponent";
import { useRightSidebar } from "./RightSidebarProvider";
import { useFolderStore } from "@/stores/foldersStore";
import useFlowsManagerStore from "@/stores/flowsManagerStore";
import { Category, CardData } from "@/types/templates/types";
import { cn } from "@/utils/utils";
import Fuse from "fuse.js";
import { useParams } from "react-router-dom";
import { updateIds } from "@/utils/reactflowUtils";
// Import template images
import memoryChatbot from "@/assets/temp-pat-1.png";
import vectorRag from "@/assets/temp-pat-2.png";
import multiAgent from "@/assets/temp-pat-3.png";
import memoryChatbotHorizontal from "@/assets/temp-pat-m-1.png";
import vectorRagHorizontal from "@/assets/temp-pat-m-2.png";
import multiAgentHorizontal from "@/assets/temp-pat-m-3.png";

// Sidebar-specific template components
const SidebarGetStartedComponent = () => {
  const examples = useFlowsManagerStore((state) => state.examples);
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);

  const folderIdUrl = folderId ?? myCollectionId;

  // Define the card data
  const cardData: CardData[] = [
    {
      bgImage: memoryChatbot,
      bgHorizontalImage: memoryChatbotHorizontal,
      icon: "MessagesSquare",
      category: "prompting",
      flow: examples.find((example) => example.name === "Basic Prompting"),
    },
    {
      bgImage: vectorRag,
      bgHorizontalImage: vectorRagHorizontal,
      icon: "Database",
      category: "RAG",
      flow: examples.find((example) => example.name === "Vector Store RAG"),
    },
    {
      bgImage: multiAgent,
      bgHorizontalImage: multiAgentHorizontal,
      icon: "Bot",
      category: "Agents",
      flow: examples.find((example) => example.name === "Simple Agent"),
    },
  ];

  const handleCardClick = (card: CardData) => {
    if (card.flow) {
      updateIds(card.flow.data!);
      addFlow({ flow: card.flow }).then((id) => {
        navigate(`/flow/${id}/folder/${folderIdUrl}`);
      });
      track("New Flow Created", { template: `${card.flow.name} Template` });
    }
  };

  return (
    <div className="space-y-3">
      <div className="px-2">
        <h4 className="text-sm font-semibold mb-2">Get Started</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Start with templates showcasing Langflow's Prompting, RAG, and Agent use cases.
        </p>
      </div>
      <div className="space-y-2">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="p-2 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleCardClick(card)}
          >
            <div className="flex items-center gap-2">
              <ForwardedIconComponent
                name={card.icon}
                className="h-4 w-4 text-primary"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {card.flow?.name || card.category}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {card.flow?.description || `${card.category} template`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SidebarTemplateContentComponent = ({ currentTab, categories }: { currentTab: string; categories: any[] }) => {
  const examples = useFlowsManagerStore((state) => state.examples).filter(
    (example) =>
      example.tags?.includes(currentTab ?? "") ||
      currentTab === "all-templates",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExamples, setFilteredExamples] = useState(examples);
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);

  const folderIdUrl = folderId ?? myCollectionId;

  const fuse = useMemo(
    () => new Fuse(examples, { keys: ["name", "description"] }),
    [examples],
  );

  useEffect(() => {
    setSearchQuery("");
  }, [currentTab]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredExamples(examples);
    } else {
      const searchResults = fuse.search(searchQuery);
      setFilteredExamples(searchResults.map((result) => result.item));
    }
  }, [searchQuery, currentTab, examples, fuse]);

  const handleCardClick = (example: any) => {
    updateIds(example.data);
    addFlow({ flow: example }).then((id) => {
      navigate(`/flow/${id}/folder/${folderIdUrl}`);
    });
    track("New Flow Created", { template: `${example.name} Template` });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-3">
      <div className="px-2">
        <Input
          type="search"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs"
        />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredExamples.length > 0 ? (
          filteredExamples.map((example, index) => (
            <div
              key={index}
              className="p-2 border rounded-lg cursor-pointer hover:bg-muted transition-colors mx-2"
              onClick={() => handleCardClick(example)}
            >
              <div className="flex items-center gap-2">
                <ForwardedIconComponent
                  name={example.icon || "Workflow"}
                  className="h-4 w-4 text-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {example.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {example.description}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-2 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              No templates found.{" "}
              <button
                className="underline underline-offset-4"
                onClick={handleClearSearch}
              >
                Clear search
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample connection data
const connections = [
  { name: "Gmail", icon: "Mail", connected: true },
  { name: "Slack", icon: "MessageSquare", connected: true },
  { name: "GitHub", icon: "Github", connected: true },
  { name: "Notion", icon: "FileText", connected: false },
  { name: "Twitter", icon: "Twitter", connected: false },
  { name: "YouTube", icon: "Play", connected: false },
  { name: "Supabase", icon: "Database", connected: false },
  { name: "Google Sheets", icon: "Sheet", connected: true },
  { name: "Airtable", icon: "Grid", connected: false },
  { name: "Reddit", icon: "MessageCircle", connected: false },
  { name: "Perplexity", icon: "Search", connected: true },
  { name: "Monday", icon: "Calendar", connected: false },
];

// Tab content components
const McpTabContent = () => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">MCP Servers - UPDATED</h3>
    <div className="grid grid-cols-3 gap-2">
      {connections.map((connection, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer relative min-h-[70px]"
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
);

const AgentsTabContent = () => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
    <div className="space-y-2">
      <div className="p-3 border rounded-lg">
        <div className="font-medium">Assistant Agent</div>
        <div className="text-sm text-muted-foreground">General purpose assistant</div>
      </div>
      <div className="p-3 border rounded-lg">
        <div className="font-medium">Code Agent</div>
        <div className="text-sm text-muted-foreground">Code generation and review</div>
      </div>
      <div className="p-3 border rounded-lg">
        <div className="font-medium">Research Agent</div>
        <div className="text-sm text-muted-foreground">Information gathering</div>
      </div>
    </div>
  </div>
);

const FlowsTabContent = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["get-started"]));
  const [searchQuery, setSearchQuery] = useState("");
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);
  const examples = useFlowsManagerStore((state) => state.examples);

  const folderIdUrl = folderId ?? myCollectionId;

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleTemplateClick = (template: any) => {
    updateIds(template.data);
    addFlow({ flow: template }).then((id) => {
      navigate(`/flow/${id}/folder/${folderIdUrl}`);
    });
    track("New Flow Created", { template: `${template.name} Template` });
  };

  // Define template categories with their flows
  const templateCategories = [
    {
      id: "get-started",
      title: "Get Started",
      icon: "SquarePlay",
      flows: [
        examples.find((example) => example.name === "Basic Prompting"),
        examples.find((example) => example.name === "Vector Store RAG"),
        examples.find((example) => example.name === "Simple Agent"),
      ].filter(Boolean),
    },
    {
      id: "assistants",
      title: "Assistants",
      icon: "BotMessageSquare",
      flows: examples.filter((example) => example.tags?.includes("assistants")),
    },
    {
      id: "classification",
      title: "Classification",
      icon: "Tags",
      flows: examples.filter((example) => example.tags?.includes("classification")),
    },
    {
      id: "coding",
      title: "Coding",
      icon: "TerminalIcon",
      flows: examples.filter((example) => example.tags?.includes("coding")),
    },
    {
      id: "content-generation",
      title: "Content Generation",
      icon: "Newspaper",
      flows: examples.filter((example) => example.tags?.includes("content-generation")),
    },
    {
      id: "q-a",
      title: "Q&A",
      icon: "Database",
      flows: examples.filter((example) => example.tags?.includes("q-a")),
    },
    {
      id: "chatbots",
      title: "Prompting",
      icon: "MessagesSquare",
      flows: examples.filter((example) => example.tags?.includes("chatbots")),
    },
    {
      id: "rag",
      title: "RAG",
      icon: "Database",
      flows: examples.filter((example) => example.tags?.includes("rag")),
    },
    {
      id: "agents",
      title: "Agents",
      icon: "Bot",
      flows: examples.filter((example) => example.tags?.includes("agents")),
    },
  ];

  // Filter categories based on search
  const filteredCategories = templateCategories.filter(category => {
    if (!searchQuery) return category.flows.length > 0;

    const categoryMatches = category.title.toLowerCase().includes(searchQuery.toLowerCase());
    const flowMatches = category.flows.some(flow =>
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (categoryMatches || flowMatches) && category.flows.length > 0;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <ForwardedIconComponent
            name="Search"
            className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between h-8 px-2 text-xs font-medium"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-2">
                  <ForwardedIconComponent
                    name={category.icon}
                    className="h-3 w-3"
                  />
                  <span>{category.title}</span>
                  <span className="text-xs text-muted-foreground">
                    ({category.flows.length})
                  </span>
                </div>
                <ForwardedIconComponent
                  name="ChevronRight"
                  className={cn(
                    "h-3 w-3 transition-transform",
                    expandedCategories.has(category.id) && "rotate-90"
                  )}
                />
              </Button>

              {/* Category Flows */}
              {expandedCategories.has(category.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.flows
                    .filter(flow => {
                      if (!searchQuery) return true;
                      return flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             flow.description?.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((flow, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between h-8 px-2 bg-muted/50 hover:bg-muted border border-border rounded-md"
                      onClick={() => handleTemplateClick(flow)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ForwardedIconComponent
                          name={flow.icon || "Workflow"}
                          className="h-3 w-3 flex-shrink-0"
                        />
                        <span className="text-xs font-medium truncate">
                          {flow.name}
                        </span>
                      </div>
                      <ForwardedIconComponent
                        name="MoreHorizontal"
                        className="h-3 w-3 flex-shrink-0 opacity-50"
                      />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RightSidebarComponent(): JSX.Element | null {
  const [activeTab, setActiveTab] = useState("mcp");
  const { isOpen } = useRightSidebar();

  const tabs = [
    {
      id: "mcp",
      label: "MCP",
      icon: "Zap",
      content: <McpTabContent />
    },
    {
      id: "agents",
      label: "Agents",
      icon: "Bot",
      content: <AgentsTabContent />
    },
    {
      id: "flows",
      label: "Flows",
      icon: "Workflow",
      content: <FlowsTabContent />
    }
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(
      "fixed right-0 top-12 bottom-0 w-80 bg-background border-l border-border shadow-lg z-40",
      "transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="h-full flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1 text-xs"
                data-testid={`right-sidebar-tab-${tab.id}`}
              >
                <ForwardedIconComponent
                  name={tab.icon}
                  className="h-3 w-3"
                />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 h-full">
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

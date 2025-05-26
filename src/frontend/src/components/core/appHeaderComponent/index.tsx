import useTheme from "@/customization/hooks/use-custom-theme";
import FlowMenu from "./components/FlowMenu";
import HeaderToolbar from "./components/HeaderToolbar";
import ThemeButtons from "./components/ThemeButtons";

export default function AppHeader(): JSX.Element {
  useTheme();

  return (
    <div
      className={`z-10 flex h-[48px] w-full items-center justify-between border-b px-6 dark:bg-background`}
      data-testid="app-header"
    >
      {/* Left Section - Empty (no logo) */}
      <div className="flex items-center">
        {/* Empty space where logo was */}
      </div>

      {/* Middle Section */}
      <div className="absolute left-1/2 w-full flex-1 -translate-x-1/2">
        <FlowMenu />
      </div>

      {/* Right Section - Toolbar + Theme Toggle */}
      <div className="flex items-center gap-2">
        <HeaderToolbar />
        <ThemeButtons />
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Target, Home } from "lucide-react";

export type DashboardView = "main" | "strategic";

interface NavigationProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Home className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Scoring Navigator</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <Button
              variant={currentView === "main" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("main")}
              className={`flex items-center space-x-2 ${
                currentView === "main"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Main Dashboard</span>
            </Button>

            <Button
              variant={currentView === "strategic" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("strategic")}
              className={`flex items-center space-x-2 ${
                currentView === "strategic"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Strategic Analysis</span>
            </Button>
          </div>

          {/* Right side - could add user info, settings, etc. */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {currentView === "main"
                ? "Comprehensive Company Analysis"
                : "Strategic Positioning Matrix"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Dashboard } from "./Dashboard";
import { StrategicAnalysisDashboard } from "./StrategicAnalysisDashboard";
import { Navigation, DashboardView } from "./Navigation";

export const DashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<DashboardView>("main");

  // Sync with URL changes
  useEffect(() => {
    if (location.pathname === "/strategic") {
      setCurrentView("strategic");
    } else if (location.pathname === "/") {
      setCurrentView("main");
    }
  }, [location.pathname]);

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);

    // Update URL to match the selected view
    if (view === "strategic") {
      navigate("/strategic");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Navigation currentView={currentView} onViewChange={handleViewChange} />

      {/* Dashboard Content */}
      <div className="pt-6">
        {currentView === "main" ? <Dashboard /> : <StrategicAnalysisDashboard />}
      </div>
    </div>
  );
};

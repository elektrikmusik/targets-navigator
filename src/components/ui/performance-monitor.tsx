import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Monitor, X, Activity } from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  lastUpdate: Date;
}

export const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    lastUpdate: new Date(),
  });

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const updateMetrics = () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;

      // Measure current memory usage (if available)
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;

      // Count React components (approximate)
      const componentCount = document.querySelectorAll("[data-reactroot]").length;

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(performance.now()),
        memoryUsage,
        componentCount,
        lastUpdate: new Date(),
      });
    };

    // Update metrics immediately and then every 5 seconds
    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    // Show monitor after a delay
    const timeout = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    return `${bytes} MB`;
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; moderate: number }) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.moderate) return "text-yellow-600";
    return "text-red-600";
  };

  // Don't render in production
  if (process.env.NODE_ENV !== "development" || !isVisible) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="border-gray-300 bg-white shadow-lg hover:bg-gray-50"
        >
          <Activity className="mr-2 h-4 w-4" />
          Performance
        </Button>
      ) : (
        <div className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Performance Monitor</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Page Load Time:</span>
              <span
                className={getPerformanceColor(metrics.loadTime, { good: 1000, moderate: 3000 })}
              >
                {metrics.loadTime}ms
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Render Time:</span>
              <span
                className={getPerformanceColor(metrics.renderTime, { good: 100, moderate: 500 })}
              >
                {metrics.renderTime}ms
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Memory Usage:</span>
              <span
                className={getPerformanceColor(metrics.memoryUsage, { good: 50, moderate: 100 })}
              >
                {formatBytes(metrics.memoryUsage)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Components:</span>
              <span className="text-gray-900">{metrics.componentCount}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Last Updated:</span>
              <span className="text-gray-500">{metrics.lastUpdate.toLocaleTimeString()}</span>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <div className="space-y-1 text-xs text-gray-500">
                <div>🟢 Good: Load &lt;1s, Memory &lt;50MB</div>
                <div>🟡 Moderate: Load &lt;3s, Memory &lt;100MB</div>
                <div>🔴 Poor: Load &gt;3s, Memory &gt;100MB</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

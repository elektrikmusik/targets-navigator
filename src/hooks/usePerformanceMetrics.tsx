import React, { useState, useEffect } from "react";

// Performance measuring hook
export const usePerformanceMetrics = () => {
  const [renderStart] = useState(performance.now());
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, []);

  const getRenderTime = () => performance.now() - renderStart;

  const logPerformance = (component: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`${component} render #${renderCount} took ${getRenderTime().toFixed(2)}ms`);
    }
  };

  return {
    renderCount,
    renderTime: getRenderTime(),
    logPerformance,
  };
};

// Higher-order component for performance tracking
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string,
) => {
  const WrappedComponent = (props: P) => {
    const { logPerformance } = usePerformanceMetrics();

    useEffect(() => {
      logPerformance(componentName || Component.displayName || Component.name || "Component");
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceTracking(${componentName || Component.displayName || Component.name})`;

  return WrappedComponent;
};

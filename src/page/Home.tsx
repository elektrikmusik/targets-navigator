import { DashboardContainer } from "@/components";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface Props extends React.ComponentProps<"div"> {}

export const Home = ({ ...rest }: Props) => {
  return (
    <ErrorBoundary fallback={<DashboardSkeleton />}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContainer {...rest} />
      </Suspense>
      <PerformanceMonitor />
    </ErrorBoundary>
  );
};

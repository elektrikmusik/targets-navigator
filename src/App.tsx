import { BrowserRouter, Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { Home, NotFound, RootErrorBoundary, LinkedChartPage } from "./page";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { DashboardSkeleton } from "./components/ui/skeleton";
import { AppLayout } from "./components/layout/AppLayout";

// Lazy load components for better performance
const CompanyOverviewDashboard = lazy(() =>
  import("./components/CompanyOverviewDashboard").then((module) => ({
    default: module.CompanyOverviewDashboard,
  })),
);

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <Home />
                </Suspense>
              }
              errorElement={<RootErrorBoundary />}
            />
            <Route
              path="/overview"
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <CompanyOverviewDashboard />
                </Suspense>
              }
              errorElement={<RootErrorBoundary />}
            />
            <Route
              path="/charts"
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <LinkedChartPage />
                </Suspense>
              }
              errorElement={<RootErrorBoundary />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <Home />
                </Suspense>
              }
              errorElement={<RootErrorBoundary />}
            />
            <Route
              path="/overview"
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <CompanyOverviewDashboard />
                </Suspense>
              }
              errorElement={<RootErrorBoundary />}
            />
            <Route
              path="/charts"
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <LinkedChartPage />
                </Suspense>
              }
              errorElement={<RootErrorBoundary />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

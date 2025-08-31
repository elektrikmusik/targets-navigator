import { BrowserRouter, Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { Home, NotFound, RootErrorBoundary, StrategicAnalysis } from "./page";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { DashboardSkeleton } from "./components/ui/skeleton";

// Lazy load components for better performance
const TableNavigator = lazy(() =>
  import("./components/TableNavigator").then((module) => ({ default: module.TableNavigator })),
);

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
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
            path="/tables"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <TableNavigator />
              </Suspense>
            }
            errorElement={<RootErrorBoundary />}
          />
          <Route
            path="/strategic"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <StrategicAnalysis />
              </Suspense>
            }
            errorElement={<RootErrorBoundary />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

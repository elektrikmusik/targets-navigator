import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, BarChart3, TrendingUp, Globe } from "lucide-react";

export const Home = () => {
  return (
    <ErrorBoundary fallback={<DashboardSkeleton />}>
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="bg-gray-50">
          <div className="container mx-auto h-full overflow-auto px-6 py-8">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <h1 className="mb-6 text-5xl font-bold text-gray-900">Company Overview Dashboard</h1>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
                Advanced company analysis platform with comprehensive scoring across all dimensions.
                Built with modern React and Supabase for real-time data insights.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href="/overview">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    View Dashboard
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  <Globe className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Building2 className="mb-2 h-8 w-8 text-blue-600" />
                  <CardTitle>Comprehensive Analysis</CardTitle>
                  <CardDescription>
                    Multi-dimensional company scoring across financial, strategic, and operational
                    metrics
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="mb-2 h-8 w-8 text-green-600" />
                  <CardTitle>Real-time Data</CardTitle>
                  <CardDescription>
                    Live data from Supabase with advanced filtering, sorting, and search
                    capabilities
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="mb-2 h-8 w-8 text-purple-600" />
                  <CardTitle>Advanced Table</CardTitle>
                  <CardDescription>
                    Built with TanStack Table and shadcn/ui for enterprise-grade data presentation
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Tech Stack */}
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Built with Modern Technology
              </h2>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">React 19</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                  TypeScript
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800">
                  Supabase
                </span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">
                  TanStack Table
                </span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                  shadcn/ui
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
      <PerformanceMonitor />
    </ErrorBoundary>
  );
};

import React from "react";
import { Card } from "../components/ui/card";
import { BarChart, PieChart } from "../components/charts";
import { RegionalCoverageCard, BusinessTerritoriesCoverage } from "../components/dashboard";
import { Building2, Target, MapPin } from "lucide-react";

const Dashboard: React.FC = () => {
  // Placeholder data - will be replaced with real data later
  const statistics = [
    {
      title: "Total Companies",
      value: "478",
      description: "Companies in database",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Priority leads",
      value: "180",
      description: "High priority targets",
      icon: Target,
      color: "text-[#e87722]",
    },
    {
      title: "Territories",
      value: "8",
      description: "Business territories",
      icon: MapPin,
      color: "text-[#59315F]",
    },
  ];

  const regionalData = [
    {
      region: "ASIA",
      total: 292,
      priority: 133,
      icon: "🌏",
    },
    {
      region: "EUROPE",
      total: 89,
      priority: 19,
      icon: "🌍",
    },
    {
      region: "MIDDLE EAST NORTH AFRICA",
      total: 45,
      priority: 13,
      icon: "🌍",
    },
    {
      region: "AMERICAS",
      total: 52,
      priority: 15,
      icon: "🌎",
    },
  ];

  const territoriesData = [
    { name: "China", total: 71, priority: 41, flag: "🇨🇳" },
    { name: "Japan", total: 40, priority: 30, flag: "🇯🇵" },
    { name: "Korea", total: 41, priority: 25, flag: "🇰🇷" },
    { name: "Rest of APAC", total: 97, priority: 22, flag: "🌏" },
    { name: "Europe", total: 55, priority: 19, flag: "🇪🇺" },
    { name: "Americas", total: 46, priority: 15, flag: "🌎" },
    { name: "India", total: 43, priority: 15, flag: "🇮🇳" },
    { name: "MENA", total: 43, priority: 13, flag: "🌍" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive overview of company analytics and regional coverage
          </p>
        </div>

        {/* Statistics Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Statistics</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {statistics.map((stat, index) => (
              <Card
                key={index}
                className="bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-700">{stat.title}</h3>
                    <div className="mb-2 text-4xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`rounded-lg bg-gray-100 p-3 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Regional Coverage Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Regional Coverage</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {regionalData.map((region, index) => (
              <RegionalCoverageCard
                key={index}
                region={region.region}
                total={region.total}
                priority={region.priority}
                icon={region.icon}
              />
            ))}
          </div>
        </section>

        {/* Business Territories Coverage Section */}
        <section className="mb-12">
          <BusinessTerritoriesCoverage data={territoriesData} />
        </section>

        {/* Additional Analytics Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pie Chart for Regional Distribution */}
            <Card className="bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Regional Distribution</h3>
              <div className="flex h-64 items-center justify-center">
                <PieChart
                  data={{
                    values: regionalData.map((region) => region.total),
                    labels: regionalData.map((region) => region.region),
                    colors: regionalData.map((region) =>
                      region.region === "ASIA"
                        ? "#E87722"
                        : region.region === "EUROPE"
                          ? "#8B5CF6"
                          : region.region === "MIDDLE EAST NORTH AFRICA"
                            ? "#10B981"
                            : "#3B82F6",
                    ),
                  }}
                  width={300}
                  height={200}
                />
              </div>
            </Card>

            {/* Bar Chart for Territory Comparison */}
            <Card className="bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Territory Comparison</h3>
              <div className="flex h-64 items-center justify-center">
                <BarChart
                  data={[
                    {
                      x: territoriesData.map((territory) => territory.name),
                      y: territoriesData.map((territory) => territory.priority),
                      name: "Priority",
                      type: "bar",
                      marker: { color: "#E87722" },
                    },
                    {
                      x: territoriesData.map((territory) => territory.name),
                      y: territoriesData.map((territory) => territory.total - territory.priority),
                      name: "Total",
                      type: "bar",
                      marker: { color: "#8B5CF6" },
                    },
                  ]}
                  width={400}
                  height={200}
                />
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

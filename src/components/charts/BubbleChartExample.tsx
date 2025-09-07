import { useState } from "react";
import { BubbleChart, BubbleDataPoint } from "./BubbleChart";
import { Button } from "../ui/button";

// Sample data for demonstration
const sampleData: BubbleDataPoint[] = [
    {
        name: "Project Alpha",
        strategicFit: 85,
        abilityToExecute: 70,
        overallScore: 78,
        category: "High Priority",
        metadata: { budget: 500000, team: 8 }
    },
    {
        name: "Project Beta",
        strategicFit: 60,
        abilityToExecute: 90,
        overallScore: 75,
        category: "Quick Wins",
        metadata: { budget: 200000, team: 5 }
    },
    {
        name: "Project Gamma",
        strategicFit: 95,
        abilityToExecute: 40,
        overallScore: 68,
        category: "Strategic",
        metadata: { budget: 1000000, team: 12 }
    },
    {
        name: "Project Delta",
        strategicFit: 30,
        abilityToExecute: 80,
        overallScore: 55,
        category: "Operational",
        metadata: { budget: 150000, team: 3 }
    },
    {
        name: "Project Epsilon",
        strategicFit: 70,
        abilityToExecute: 85,
        overallScore: 78,
        category: "High Priority",
        metadata: { budget: 300000, team: 6 }
    },
    {
        name: "Project Zeta",
        strategicFit: 45,
        abilityToExecute: 25,
        overallScore: 35,
        category: "Low Priority",
        metadata: { budget: 50000, team: 2 }
    },
    {
        name: "Project Eta",
        strategicFit: 80,
        abilityToExecute: 60,
        overallScore: 70,
        category: "Strategic",
        metadata: { budget: 750000, team: 10 }
    },
    {
        name: "Project Theta",
        strategicFit: 55,
        abilityToExecute: 75,
        overallScore: 65,
        category: "Quick Wins",
        metadata: { budget: 180000, team: 4 }
    }
];

export const BubbleChartExample = () => {
    const [selectedDataPoint, setSelectedDataPoint] = useState<BubbleDataPoint | null>(null);
    const [showLegend, setShowLegend] = useState(true);
    const [showGrid, setShowGrid] = useState(true);

    const handleBubbleClick = (dataPoint: BubbleDataPoint) => {
        setSelectedDataPoint(dataPoint);
        console.log("Bubble clicked:", dataPoint);
    };

    const handleBubbleHover = (dataPoint: BubbleDataPoint) => {
        // You could show a tooltip or update state here
        console.log("Bubble hovered:", dataPoint);
    };

    const customColorScheme = [
        "#3B82F6", // Blue for High Priority
        "#10B981", // Green for Quick Wins
        "#8B5CF6", // Purple for Strategic
        "#F59E0B", // Yellow for Operational
        "#EF4444", // Red for Low Priority
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Strategic Analysis Dashboard
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLegend(!showLegend)}
                        >
                            {showLegend ? "Hide" : "Show"} Legend
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowGrid(!showGrid)}
                        >
                            {showGrid ? "Hide" : "Show"} Grid
                        </Button>
                    </div>
                </div>

                <div className="h-96">
                    <BubbleChart
                        data={sampleData}
                        title="Project Portfolio Analysis"
                        xAxisTitle="Strategic Fit"
                        yAxisTitle="Ability to Execute"
                        height={400}
                        showLegend={showLegend}
                        showGrid={showGrid}
                        colorScheme={customColorScheme}
                        minBubbleSize={8}
                        maxBubbleSize={40}
                        onBubbleClick={handleBubbleClick}
                        onBubbleHover={handleBubbleHover}
                        xAxisRange={[0, 100]}
                        yAxisRange={[0, 100]}
                    />
                </div>
            </div>

            {selectedDataPoint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                        Selected Project: {selectedDataPoint.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-blue-700">Strategic Fit:</span>
                            <span className="ml-2 text-blue-600">{selectedDataPoint.strategicFit}%</span>
                        </div>
                        <div>
                            <span className="font-medium text-blue-700">Ability to Execute:</span>
                            <span className="ml-2 text-blue-600">{selectedDataPoint.abilityToExecute}%</span>
                        </div>
                        <div>
                            <span className="font-medium text-blue-700">Overall Score:</span>
                            <span className="ml-2 text-blue-600">{selectedDataPoint.overallScore}%</span>
                        </div>
                        <div>
                            <span className="font-medium text-blue-700">Category:</span>
                            <span className="ml-2 text-blue-600">{selectedDataPoint.category}</span>
                        </div>
                    </div>
                    {selectedDataPoint.metadata && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-blue-700">Budget:</span>
                                    <span className="ml-2 text-blue-600">
                                        ${selectedDataPoint.metadata.budget?.toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Team Size:</span>
                                    <span className="ml-2 text-blue-600">{selectedDataPoint.metadata.team} people</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setSelectedDataPoint(null)}
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chart Features
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>X-axis:</strong> Strategic Fit (0-100%)</li>
                    <li>• <strong>Y-axis:</strong> Ability to Execute (0-100%)</li>
                    <li>• <strong>Bubble Size:</strong> Overall Score (0-100%)</li>
                    <li>• <strong>Colors:</strong> Categorized by project type</li>
                    <li>• <strong>Interactive:</strong> Click and hover for details</li>
                    <li>• <strong>Responsive:</strong> Adapts to container size</li>
                    <li>• <strong>Accessible:</strong> Keyboard navigation and screen reader support</li>
                </ul>
            </div>
        </div>
    );
};

import React from "react";
import { TrendingUp, Factory, Atom, Lightbulb, Settings, Scale } from "lucide-react";

const Slide2: React.FC = () => {
  const criteria = [
    {
      icon: TrendingUp,
      title: "Financial Performance",
      description:
        "Assesses financial capacity for investment and long-term stability. Evaluates annual revenue, growth rate, profit margin, and investment capacity.",
    },
    {
      icon: Factory,
      title: "Industry Fit",
      description:
        "Evaluates relevance of markets and products to Ceres Power's offerings. Assesses core business alignment, technology compatibility, and market position.",
    },
    {
      icon: Atom,
      title: "Hydrogen Strategy",
      description:
        "Measures direct involvement and commitment to green hydrogen sector. Analyzes investments, partnerships, technology development, and public commitments.",
    },
    {
      icon: Lightbulb,
      title: "IP Activity",
      description:
        "Assesses intellectual property landscape and relevance to Ceres Power. Examines patents related to key technologies, citation patterns, and portfolio growth.",
    },
    {
      icon: Settings,
      title: "Manufacturing Capabilities",
      description:
        "Evaluates expertise relevant to large-scale manufacturing of SOEC/SOFC. Assesses materials experience, production scale, quality control, and supply chain management.",
    },
    {
      icon: Scale,
      title: "Ownership",
      description:
        "Analyzes ownership structure and its influence on business decisions. Examines ownership type, decision-making processes, strategic alignment, and international partnership history.",
    },
  ];

  return (
    <div className="slide bg-light-gray flex h-full w-full flex-col">
      {/* Header Section */}
      <div className="header bg-orange flex-shrink-0 px-8 py-6">
        <h1 className="animate-fade-in text-center text-2xl text-white lg:text-3xl">
          Partner Evaluation Framework Overview
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="content flex flex-1 flex-col px-4 py-6 lg:px-8">
        {/* Introductory Text */}
        <div className="intro-text animate-fade-in-delay mb-6 text-center">
          <p className="mx-auto max-w-4xl text-sm leading-relaxed text-gray-700 lg:text-base">
            Our comprehensive framework evaluates potential partners across{" "}
            <span className="highlight-orange font-semibold">six key criteria</span> to identify
            optimal licensing partners for Ceres Power's SOFC and SOEC technologies.
          </p>
        </div>

        {/* Criteria Cards */}
        <div className="criteria-grid grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {criteria.map((criterion, index) => {
            const IconComponent = criterion.icon;
            return (
              <div
                key={index}
                className={`criterion-card animate-slide-up border-orange/10 flex flex-col rounded-lg border bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-xl lg:p-6 delay-${index * 100}`}
              >
                <div className="mb-4 flex items-center">
                  <div className="bg-orange mr-4 rounded-lg p-2">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h3 className="flex-1 text-lg text-gray-800 lg:text-xl">{criterion.title}</h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-gray-600 lg:text-base">
                  {criterion.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer animate-fade-in-delay-2 bg-light-orange flex-shrink-0 px-4 py-4 text-right text-xs text-gray-600 lg:px-8 lg:text-sm">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide2;

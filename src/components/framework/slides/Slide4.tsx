import React from "react";
import { Building2, Cpu, Award } from "lucide-react";

const Slide4: React.FC = () => {
  // CSS class mapping for scores
  const getScoreColorClass = (score: number) => {
    switch (score) {
      case 1:
        return "score-red";
      case 3:
        return "score-yellow";
      case 5:
        return "score-yellow";
      case 7:
        return "score-green";
      case 10:
        return "score-green";
      default:
        return "score-purple";
    }
  };

  const metrics = [
    {
      icon: Building2,
      title: "Core Business",
      definition:
        "Measures how closely a company's established customer base matches current or emerging demand in SOFC/SOEC markets.",
      scales: [
        {
          score: 1,
          title: "No overlap",
          description: "Customer base in unrelated sectors (e.g., pure consumer, agriculture)",
        },
        {
          score: 3,
          title: "Marginal relevance",
          description:
            "Primary customers one step removed from energy/hydrogen with indirect links",
        },
        {
          score: 5,
          title: "Moderate overlap",
          description: "Some key customers in industrial, infrastructure, or grid markets",
        },
        {
          score: 7,
          title: "Strong overlap",
          description:
            "Serves utilities, renewable developers, industrial energy infrastructure as core customers",
        },
        {
          score: 10,
          title: "Target market match",
          description: "Majority of customer base in energy, hydrogen, or industrial power sectors",
        },
      ],
    },
    {
      icon: Cpu,
      title: "Technology Platform Compatibility",
      definition:
        "Assesses how well a company's existing technologies align with SOFC/SOEC production and application needs.",
      scales: [
        {
          score: 1,
          title: "No compatibility",
          description: "Technology not relevant to SOFC/SOFC stack, system, or process technology",
        },
        {
          score: 3,
          title: "Partial compatibility",
          description: "Some generic skillsets but lacks key SOFC/SOFC technologies",
        },
        {
          score: 5,
          title: "Moderate compatibility",
          description: "Can contribute subassemblies but lacks specialty SOFC/SOEC platforms",
        },
        {
          score: 7,
          title: "Strong overlap",
          description: "Existing manufacturing platforms directly compatible with SOFC/SOFC needs",
        },
        {
          score: 10,
          title: "Complete match",
          description:
            "Current core business makes SOFC/SOFC stacks or directly translatable technologies",
        },
      ],
    },
    {
      icon: Award,
      title: "Adjacency, Brand Strength, and Market Fit",
      definition:
        "Evaluates the combined strength of a company's adjacency to SOFC/SOEC markets, brand credibility, and market access.",
      scales: [
        {
          score: 1,
          title: "Distant adjacency",
          description: "Unknown brand in energy/industrial, little presence in relevant markets",
        },
        {
          score: 3,
          title: "Emerging adjacency",
          description: "Some strategic statements or pilots in energy, but weak brand presence",
        },
        {
          score: 5,
          title: "Recognized adjacent brand",
          description:
            "Established in adjacent markets but not a leader in high-value energy segments",
        },
        {
          score: 7,
          title: "Strong adjacency",
          description: "Known, trusted energy brand with distribution in most target regions",
        },
        {
          score: 10,
          title: "Category leader",
          description:
            "Top-tier positioning in energy, hydrogen, grid, or large-scale industrial tech",
        },
      ],
    },
  ];

  return (
    <div className="slide slide4-container flex h-full w-full flex-col">
      {/* Header Section */}
      <div className="slide4-header animate-fade-in">
        <h1 className="text-center text-2xl text-white lg:text-3xl">2. Industry Fit</h1>
      </div>

      {/* Main Content Area */}
      <div className="slide4-content">
        {/* Purpose Section */}
        <div className="slide4-purpose animate-fade-in-delay">
          <h3 className="text-orange mb-2 text-lg font-semibold lg:text-xl">Purpose</h3>
          <p className="text-sm leading-relaxed lg:text-base">
            Evaluates the relevance of the company's markets and products to Ceres Power's offerings
            (SOEC and SOFC). A strong industry fit ensures that the partner understands the
            technology's applications and has existing channels to commercialize Ceres' solutions.
          </p>
        </div>

        {/* Metrics Container */}
        <div className="slide4-metrics-container">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const delayClass = `slide4-delay-${(index + 2) * 100}`;
            return (
              <div key={index} className={`slide4-metric-card animate-slide-up ${delayClass}`}>
                <div className="slide4-metric-icon-container">
                  <IconComponent size={32} className="icon-orange" />
                </div>
                <div className="slide4-metric-content">
                  <h3 className="slide4-metric-title">{metric.title}</h3>
                  <p className="slide4-metric-definition">{metric.definition}</p>
                  <div className="slide4-scoring-scale">
                    {metric.scales.map((scale, scaleIndex) => (
                      <div key={scaleIndex} className="slide4-score-item">
                        <div className="slide4-score-header">
                          <div className={`slide4-score-badge ${getScoreColorClass(scale.score)}`}>
                            {scale.score}
                          </div>
                          <div className="slide4-score-title">{scale.title}</div>
                        </div>
                        <p className="slide4-score-description">{scale.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="slide4-footer animate-fade-in-delay-2">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide4;

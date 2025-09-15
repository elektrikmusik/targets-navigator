import React from "react";
import { DollarSign, TrendingUp, Percent, Coins } from "lucide-react";

const Slide3: React.FC = () => {
  // CSS class mapping for scores
  const getScoreClass = (score: number) => {
    switch (score) {
      case 1:
        return "score-red"; // Red for poor performance
      case 3:
        return "score-yellow"; // Yellow for moderate performance
      case 5:
        return "score-yellow"; // Yellow for moderate performance
      case 7:
        return "score-green"; // Green for good performance
      case 10:
        return "score-green"; // Green for excellent performance
      default:
        return "score-purple"; // Purple for other scores
    }
  };

  const metrics = [
    {
      icon: DollarSign,
      title: "Annual Revenue",
      scales: [
        {
          score: 1,
          description: "< $8B USD",
          detail: "(e.g., a small startup with limited capital)",
        },
        {
          score: 3,
          description: "> $200B USD",
          detail: "(e.g., potentially too large or complex to negotiate with)",
        },
        {
          score: 5,
          description: "$20B USD",
          detail: "(e.g., a regional player with steady but not massive revenue)",
        },
        {
          score: 10,
          description: "$200B USD",
          detail: "(e.g., a major industrial conglomerate with significant resources)",
        },
      ],
    },
    {
      icon: TrendingUp,
      title: "3-Year Revenue Growth",
      scales: [
        {
          score: 1,
          description: "Negative or stagnant",
          detail: "(e.g., facing market contraction or internal issues)",
        },
        {
          score: 3,
          description: "Low growth (0-5%)",
          detail: "(e.g., in a mature market with limited expansion)",
        },
        {
          score: 7,
          description: "Moderate growth (5-15%)",
          detail: "(e.g., steadily expanding market share)",
        },
        {
          score: 10,
          description: "High growth (>15%)",
          detail: "(e.g., rapidly expanding into new markets)",
        },
      ],
    },
    {
      icon: Percent,
      title: "Net Profit Margin",
      scales: [
        {
          score: 1,
          description: "Negative or very low (<0%)",
          detail: "(e.g., struggling with profitability)",
        },
        {
          score: 3,
          description: "Low (0-5%)",
          detail: "(e.g., in a highly competitive, low-margin industry)",
        },
        {
          score: 7,
          description: "Moderate (5-10%)",
          detail: "(e.g., maintaining healthy profitability)",
        },
        {
          score: 10,
          description: "High (>10%)",
          detail: "(e.g., strong operational efficiency and pricing power)",
        },
      ],
    },
    {
      icon: Coins,
      title: "Investment Capacity",
      scales: [
        {
          score: 1,
          description: "Low or non-existent",
          detail: "(e.g., limited cash reserves or access to capital)",
        },
        {
          score: 5,
          description: "Moderate",
          detail: "(e.g., some recent investments in related fields)",
        },
        {
          score: 10,
          description: "High",
          detail: "(e.g., history of significant investments in R&D or infrastructure)",
        },
      ],
    },
  ];

  return (
    <div className="slide slide3-container flex h-full w-full flex-col">
      {/* Header Section */}
      <div className="slide3-header animate-fade-in">
        <h1 className="text-2xl text-white lg:text-3xl">1. Financial Performance</h1>
      </div>

      {/* Main Content Area */}
      <div className="slide3-content">
        {/* Purpose Section */}
        <div className="slide3-purpose animate-fade-in-delay">
          <h3 className="highlight-orange mb-2 text-lg lg:text-xl">Purpose</h3>
          <p className="text-sm leading-relaxed lg:text-base">
            Assesses the financial capacity of a company to invest in a licensing agreement and
            factory construction, as well as its overall financial stability. A strong financial
            position indicates a partner's ability to commit resources to a long-term collaboration
            and scale up manufacturing.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="slide3-metrics-container">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const delayClass = `slide3-delay-${(index + 2) * 100}`;
            return (
              <div key={index} className={`slide3-metric-card animate-slide-up ${delayClass}`}>
                <div className="slide3-metric-header">
                  <div className="slide3-metric-icon">
                    <IconComponent size={20} className="icon-orange" />
                  </div>
                  <h3 className="text-base lg:text-lg">{metric.title}</h3>
                </div>

                <div className="slide3-scoring-scale">
                  <div className="space-y-3">
                    {metric.scales.map((scale, scaleIndex) => (
                      <div key={scaleIndex} className="slide3-scale-item">
                        <div className={`slide3-score ${getScoreClass(scale.score)}`}>
                          {scale.score}
                        </div>
                        <div className="slide3-score-description">
                          <span className="slide3-score-title">{scale.description}</span>
                          <br />
                          <span className="slide3-score-detail">{scale.detail}</span>
                        </div>
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
      <div className="slide3-footer animate-fade-in-delay-2">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide3;

import React from "react";
import { Building2, Scale, Award, Shield } from "lucide-react";

const Slide8: React.FC = () => {
  // Color mapping for scores
  const getScoreClass = (score: number) => {
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

  return (
    <div className="slide bg-light-gray">
      {/* Header Section */}
      <div className="slide-header bg-orange animate-fade-in">
        <h1 className="text-center text-2xl text-white lg:text-3xl">6. Ownership and Conclusion</h1>
      </div>

      {/* Main Content Area */}
      <div className="slide-content">
        {/* Ownership Section */}
        <div className="ownership-section">
          {/* Purpose Section */}
          <div className="purpose-section animate-fade-in-delay">
            <h3 className="text-orange mb-2 text-lg lg:text-xl">Purpose</h3>
            <p className="text-sm leading-relaxed lg:text-base">
              Assesses the ownership structure of the company and how it might influence business
              deals and partnerships. Understanding the ownership type helps predict decision-making
              speed, strategic alignment, and potential geopolitical considerations, which are
              crucial for successful long-term collaborations.
            </p>
          </div>

          {/* Metrics Container */}
          <div className="metrics-container grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            {/* Type of Ownership */}
            <div className="metric-card animate-slide-up animate-delay-200">
              <div className="metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <Building2 size={24} className="icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">Type of Ownership</h3>
              </div>
              <div className="scoring-scale flex flex-1 flex-col gap-2">
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      State-Owned Enterprise (SOE)
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      Direct government control, requiring multiple political approvals
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">SOE with Autonomy</div>
                    <div className="score-description text-xs text-gray-600">
                      Commercial board but subject to government strategic directives
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">Publicly Traded</div>
                    <div className="score-description text-xs text-gray-600">
                      Clear profit motive and agile decision-making
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(5)}`}>5</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      Private SME/Startup
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      May lack scale or resources for large-scale partnership
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision-Making Influence */}
            <div className="metric-card animate-slide-up animate-delay-300">
              <div className="metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <Scale size={24} className="icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">Decision-Making Influence</h3>
              </div>
              <div className="scoring-scale flex flex-1 flex-col gap-2">
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">Highly Centralized</div>
                    <div className="score-description text-xs text-gray-600">
                      Multiple government bodies required for major decisions
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      Moderate Bureaucracy
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      Internal decisions with state-appointed board review
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      Agile & Decentralized
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      Empowered management capable of rapid strategic decisions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Alignment */}
            <div className="metric-card animate-slide-up animate-delay-400 flex flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <Award size={24} className="icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">Strategic Alignment</h3>
              </div>
              <div className="scoring-scale flex flex-1 flex-col gap-2">
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">Conflicting Goals</div>
                    <div className="score-description text-xs text-gray-600">
                      Primary goal is to protect legacy fossil fuel business
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">Neutral Alignment</div>
                    <div className="score-description text-xs text-gray-600">
                      General business goals without explicit clean energy focus
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      General Clean Energy
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      Stated commitment to sustainability and renewables
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      Strong Strategic Alignment
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      Strategic pivot towards green hydrogen and decarbonization
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* International Partnerships */}
            <div className="metric-card animate-slide-up animate-delay-500 flex flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <Shield size={24} className="icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">International Partnerships</h3>
              </div>
              <div className="scoring-scale flex flex-1 flex-col gap-2">
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">No History</div>
                    <div className="score-description text-xs text-gray-600">
                      Company has only operated domestically
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">
                      Limited/Problematic
                    </div>
                    <div className="score-description text-xs text-gray-600">
                      Few past international ventures with significant challenges
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">Successful but Few</div>
                    <div className="score-description text-xs text-gray-600">
                      Proven ability to manage international collaborations
                    </div>
                  </div>
                </div>
                <div className="score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className={`score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="score-content flex-1">
                    <div className="score-title mb-1 text-sm font-semibold">Extensive Success</div>
                    <div className="score-description text-xs text-gray-600">
                      Multiple successful international joint ventures and collaborations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion Section */}
        <div className="conclusion-section flex flex-2 flex-col">
          <div className="conclusion-box animate-slide-up animate-delay-600 flex h-full flex-col rounded-lg bg-white p-4 shadow-lg lg:p-5">
            <div className="conclusion-header mb-4 flex items-center">
              <Award size={32} className="icon-orange mr-4" />
              <h3 className="text-xl font-semibold text-gray-800 lg:text-2xl">
                Framework Conclusion
              </h3>
            </div>
            <div className="conclusion-text flex-1 text-lg leading-relaxed text-gray-700">
              <p className="mb-4">
                This comprehensive{" "}
                <span className="text-orange font-semibold">six-criteria evaluation framework</span>{" "}
                provides a structured methodology to identify optimal licensing partners for Ceres
                Power's SOFC and SOEC technologies.
              </p>
              <p className="mb-4">
                By systematically assessing potential partners across{" "}
                <span className="text-orange font-semibold">Financial Performance</span>,{" "}
                <span className="text-orange font-semibold">Industry Fit</span>,{" "}
                <span className="text-orange font-semibold">Hydrogen Strategy</span>,{" "}
                <span className="text-orange font-semibold">IP Activity</span>,{" "}
                <span className="text-orange font-semibold">Manufacturing Capabilities</span>, and{" "}
                <span className="text-orange font-semibold">Ownership</span>, we can identify
                partners who not only have the capacity to scale our technology but also share our
                strategic vision for a decarbonized energy future.
              </p>
              <p>
                This data-driven approach minimizes risk and maximizes the potential for successful,
                long-term collaborations that will accelerate the global adoption of our solid oxide
                technologies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer animate-fade-in-delay-2 flex-shrink-0 bg-gray-100 px-4 py-3 text-right text-xs text-gray-600 lg:px-8 lg:text-sm">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide8;

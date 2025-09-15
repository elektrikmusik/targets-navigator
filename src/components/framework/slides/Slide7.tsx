import React from "react";
import { Atom, Settings, Package, Shield } from "lucide-react";

const Slide7: React.FC = () => {
  // CSS class mapping for scores
  const getScoreClass = (score: number) => {
    switch (score) {
      case 1:
        return "slide7-score-1";
      case 3:
        return "slide7-score-3";
      case 5:
        return "slide7-score-5";
      case 7:
        return "slide7-score-7";
      case 10:
        return "slide7-score-10";
      default:
        return "slide7-score-default";
    }
  };

  return (
    <div className="slide slide7-container flex h-full w-full flex-col">
      {/* Header Section */}
      <div className="header slide7-header animate-fade-in flex-shrink-0 px-4 py-4 lg:px-8">
        <h1 className="text-center text-2xl text-white lg:text-3xl">
          5. Manufacturing Capabilities
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="content flex min-h-0 flex-1 flex-col px-4 py-4 lg:px-8">
        {/* Purpose Section */}
        <div className="purpose slide7-content animate-fade-in-delay mb-4 rounded-r-lg p-4 lg:mb-6">
          <h3 className="slide7-purpose-title mb-2 text-lg lg:text-xl">Purpose</h3>
          <p className="text-sm leading-relaxed lg:text-base">
            Assesses the company's demonstrated expertise relevant to the large-scale manufacturing
            of SOEC or SOFC cells, stacks, and systems. A partner with proven manufacturing prowess
            can rapidly scale production of Ceres' technology, accelerating market penetration and
            revenue generation.
          </p>
        </div>

        {/* Metrics Container */}
        <div className="slide7-metrics-container">
          {/* First Row */}
          <div className="slide7-metric-row">
            {/* Advanced Materials Manufacturing */}
            <div className="slide7-metric-card animate-slide-up slide7-delay-200">
              <div className="slide7-metric-header">
                <Atom size={24} className="slide7-metric-icon" />
                <h3 className="slide7-metric-title">Advanced Materials Manufacturing</h3>
              </div>
              <div className="slide7-scoring-scale">
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">No relevant experience</div>
                    <div className="slide7-score-description">
                      Manufacturing simple plastic components
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Basic materials processing</div>
                    <div className="slide7-score-description">
                      Working with standard metals or polymers
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Advanced ceramics/thin films</div>
                    <div className="slide7-score-description">
                      Producing specialized electronic components
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">High-precision manufacturing</div>
                    <div className="slide7-score-description">
                      Track record in fuel cells, batteries, semiconductors
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Scale and Automation */}
            <div className="slide7-metric-card animate-slide-up slide7-delay-300">
              <div className="slide7-metric-header">
                <Settings size={24} className="slide7-metric-icon" />
                <h3 className="slide7-metric-title">Production Scale and Automation</h3>
              </div>
              <div className="slide7-scoring-scale">
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Small-scale/manual production</div>
                    <div className="slide7-score-description">
                      Producing custom, low-volume prototypes
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Medium-scale/limited automation</div>
                    <div className="slide7-score-description">
                      Batch production with some automated assembly
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Large-scale/significant automation</div>
                    <div className="slide7-score-description">
                      High-volume production lines for complex products
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Mass production capabilities</div>
                    <div className="slide7-score-description">
                      Fully automated lines for millions of units annually
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="slide7-metric-row">
            {/* Quality Control Systems */}
            <div className="slide7-metric-card animate-slide-up slide7-delay-400">
              <div className="slide7-metric-header">
                <Shield size={24} className="slide7-metric-icon" />
                <h3 className="slide7-metric-title">Quality Control Systems</h3>
              </div>
              <div className="slide7-scoring-scale">
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Basic or no formal QC/QA</div>
                    <div className="slide7-score-description">Ad-hoc quality checks</div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Standard QC/QA processes</div>
                    <div className="slide7-score-description">Basic ISO certification</div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Advanced QC/QA systems</div>
                    <div className="slide7-score-description">
                      Statistical process control, digital traceability
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">World-class QC/QA systems</div>
                    <div className="slide7-score-description">
                      Zero-defect policies, real-time monitoring
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Chain Management */}
            <div className="slide7-metric-card animate-slide-up slide7-delay-500">
              <div className="slide7-metric-header">
                <Package size={24} className="slide7-metric-icon" />
                <h3 className="slide7-metric-title">Supply Chain Management</h3>
              </div>
              <div className="slide7-scoring-scale">
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Undeveloped supply chain</div>
                    <div className="slide7-score-description">
                      Frequent material shortages or delivery delays
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Basic supply chain management</div>
                    <div className="slide7-score-description">
                      Limited suppliers, basic inventory management
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Robust supply chain</div>
                    <div className="slide7-score-description">
                      Diversified suppliers, integrated logistics
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Optimized global supply chain</div>
                    <div className="slide7-score-description">
                      Global network, just-in-time delivery, risk management
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row - R&D and Engineering Capabilities (spans full width) */}
          <div className="slide7-metric-row slide7-metric-row-third">
            <div className="slide7-metric-card animate-slide-up slide7-delay-600">
              <div className="slide7-metric-header">
                <Settings size={24} className="slide7-metric-icon" />
                <h3 className="slide7-metric-title">R&D and Engineering Capabilities</h3>
              </div>
              <div className="slide7-scoring-scale">
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(1)}`}>1</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Limited in-house R&D</div>
                    <div className="slide7-score-description">
                      Outsources all process development
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(3)}`}>3</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Basic process engineering</div>
                    <div className="slide7-score-description">
                      Can implement standard manufacturing processes
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(7)}`}>7</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Dedicated R&D team</div>
                    <div className="slide7-score-description">
                      Focus on process optimization and innovation
                    </div>
                  </div>
                </div>
                <div className="slide7-score-item">
                  <div className={`slide7-score-badge ${getScoreClass(10)}`}>10</div>
                  <div className="slide7-score-content">
                    <div className="slide7-score-title">Leading-edge expertise</div>
                    <div className="slide7-score-description">
                      Patents in novel manufacturing techniques
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer slide7-footer animate-fade-in-delay-2 flex-shrink-0 px-4 py-3 text-right text-xs text-gray-600 lg:px-8 lg:text-sm">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide7;

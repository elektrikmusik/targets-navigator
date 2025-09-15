import React from "react";
import { Factory, Settings, Package, Shield } from "lucide-react";

const Slide5: React.FC = () => {
  return (
    <div className="slide slide5-container flex h-full w-full flex-col">
      {/* Header Section */}
      <div className="slide5-header animate-fade-in">
        <h1 className="text-center text-2xl text-white lg:text-3xl">3. Hydrogen Strategy</h1>
      </div>

      {/* Main Content Area */}
      <div className="slide5-content">
        {/* Purpose Section */}
        <div className="slide5-purpose animate-fade-in-delay">
          <h3 className="highlight-orange mb-2 text-lg lg:text-xl">Purpose</h3>
          <p className="text-sm leading-relaxed lg:text-base">
            Evaluates the company's direct involvement and commitment to the green hydrogen sector.
            Given Ceres Power's focus on SOEC and SOFC technologies, a partner with a strong
            existing or developing hydrogen strategy is more likely to successfully integrate and
            commercialize Ceres' solutions.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="slide5-metrics-grid">
          {/* Hydrogen Investments and Projects - Spans 3 columns */}
          <div className="slide5-metric-card slide5-metric-card-wide animate-slide-up slide5-delay-200">
            <div className="slide5-metric-header">
              <Factory size={24} className="slide5-metric-icon icon-orange" />
              <h3 className="text-base font-semibold lg:text-lg">
                Hydrogen Investments and Projects
              </h3>
            </div>
            <div className="slide5-scoring-scale">
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-red`}>1</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">No known investments</div>
                  <div className="slide5-score-description">
                    No publicly announced hydrogen initiatives
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-yellow`}>3</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Minor investments</div>
                  <div className="slide5-score-description">
                    Small-scale pilot projects or minimal R&D budget
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>7</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Moderate investments</div>
                  <div className="slide5-score-description">
                    Mid-scale production facilities or dedicated R&D centers
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>10</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Major investments</div>
                  <div className="slide5-score-description">
                    Gigawatt-scale electrolyzer plants or national hydrogen networks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hydrogen Partnerships */}
          <div className="slide5-metric-card animate-slide-up slide5-delay-300">
            <div className="slide5-metric-header">
              <Settings size={24} className="slide5-metric-icon icon-orange" />
              <h3 className="text-base font-semibold lg:text-lg">Hydrogen Partnerships</h3>
            </div>
            <div className="slide5-scoring-scale">
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-red`}>1</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">No known partnerships</div>
                  <div className="slide5-score-description">
                    Pursuing hydrogen development in isolation
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-yellow`}>3</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Informal partnerships</div>
                  <div className="slide5-score-description">
                    Loose agreements for information exchange
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>7</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Strategic partnerships</div>
                  <div className="slide5-score-description">
                    Collaborating with major energy utilities or equipment suppliers
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>10</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Extensive network</div>
                  <div className="slide5-score-description">
                    Multiple consortia covering hydrogen production, storage, transport
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hydrogen Technology */}
          <div className="slide5-metric-card animate-slide-up slide5-delay-400">
            <div className="slide5-metric-header">
              <Package size={24} className="slide5-metric-icon icon-orange" />
              <h3 className="text-base font-semibold lg:text-lg">Hydrogen Technology</h3>
            </div>
            <div className="slide5-scoring-scale">
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-red`}>1</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">No internal development</div>
                  <div className="slide5-score-description">
                    Relying solely on external technology acquisition
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-yellow`}>3</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Interest without concrete action</div>
                  <div className="slide5-score-description">
                    Expressing interest but no active R&D or deployment
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>7</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Component development</div>
                  <div className="slide5-score-description">
                    Developing hydrogen-related components (excluding SOEC/SOFC)
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>10</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Active deployment</div>
                  <div className="slide5-score-description">
                    Deploying hydrogen solutions or developing key technologies
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Public Commitment */}
          <div className="slide5-metric-card animate-slide-up slide5-delay-500">
            <div className="slide5-metric-header">
              <Shield size={24} className="slide5-metric-icon icon-orange" />
              <h3 className="text-base font-semibold lg:text-lg">Public Commitment</h3>
            </div>
            <div className="slide5-scoring-scale">
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-red`}>1</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">No public mention</div>
                  <div className="slide5-score-description">
                    Communications do not reference hydrogen
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-yellow`}>3</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Generic mentions</div>
                  <div className="slide5-score-description">
                    Including hydrogen in general sustainability reports
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>7</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Defined strategy</div>
                  <div className="slide5-score-description">
                    Dedicated hydrogen section with specific goals and timelines
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>10</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Central pillar</div>
                  <div className="slide5-score-description">
                    CEO frequently speaks about hydrogen as core business driver
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Initiative Participation */}
          <div className="slide5-metric-card slide5-metric-card-wide animate-slide-up slide5-delay-600">
            <div className="slide5-metric-header">
              <Settings size={24} className="slide5-metric-icon icon-orange" />
              <h3 className="text-base font-semibold lg:text-lg">
                Industry Initiative Participation
              </h3>
            </div>
            <div className="slide5-scoring-scale">
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-red`}>1</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">No participation</div>
                  <div className="slide5-score-description">
                    Not involved in any industry associations
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-yellow`}>3</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Passive participation</div>
                  <div className="slide5-score-description">
                    Member of hydrogen associations but not actively contributing
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>7</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Active participation</div>
                  <div className="slide5-score-description">
                    Representatives on technical committees or policy development
                  </div>
                </div>
              </div>
              <div className="slide5-score-item">
                <div className={`slide5-score-badge score-green`}>10</div>
                <div className="slide5-score-content">
                  <div className="slide5-score-title">Leadership role</div>
                  <div className="slide5-score-description">
                    Chairing major industry consortia or leading national task forces
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="slide5-footer animate-fade-in-delay-2">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide5;

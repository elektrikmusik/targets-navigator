import React from "react";
import { FileText, TrendingUp, Award } from "lucide-react";

const Slide6: React.FC = () => {
  return (
    <div className="slide6-container slide flex h-full w-full flex-col">
      {/* Header Section */}
      <div className="slide6-header header animate-fade-in flex-shrink-0 px-4 py-4 lg:px-8">
        <h1 className="text-center text-2xl text-white lg:text-3xl">4. IP Activity</h1>
      </div>

      {/* Main Content Area */}
      <div className="slide6-content content flex min-h-0 flex-1 flex-col px-4 py-4 lg:px-8">
        {/* Purpose Section */}
        <div className="slide6-purpose purpose animate-fade-in-delay mb-4 rounded-r-lg p-4 lg:mb-6">
          <h3 className="text-orange mb-2 text-lg lg:text-xl">Purpose</h3>
          <p className="text-sm leading-relaxed lg:text-base">
            Assesses the company's intellectual property landscape, specifically focusing on
            technologies relevant to Ceres Power. A strong and relevant IP portfolio indicates
            innovation, a commitment to the technology space, and potential for synergistic
            collaboration or reduced IP conflict.
          </p>
        </div>

        {/* Metrics Container */}
        <div className="slide6-metrics-container metrics-container flex flex-1 flex-col gap-4 overflow-y-auto lg:gap-5">
          {/* First Row */}
          <div className="slide6-metric-row metric-row flex flex-1 flex-col gap-4 lg:flex-row lg:gap-5">
            {/* Patents Related to Key Technologies */}
            <div className="slide6-metric-card metric-card animate-slide-up slide6-delay-200 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="slide6-metric-header metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <FileText size={24} className="slide6-metric-icon icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">
                  Patents Related to Key Technologies
                </h3>
              </div>
              <div className="slide6-scoring-scale scoring-scale flex flex-1 flex-col gap-2">
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-red mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    1
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      No relevant patents
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      No patents in energy conversion or hydrogen technologies
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-yellow mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    3
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Few generic patents
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      General power generation patents, not specific to fuel cells
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    7
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Moderate portfolio
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Decent number of patents in fuel cell components
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    10
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Extensive strategic portfolio
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Numerous recent patents on SOEC/SOFC stack design
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Citation of Ceres Power Patents */}
            <div className="slide6-metric-card metric-card animate-slide-up slide6-delay-300 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="slide6-metric-header metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <TrendingUp size={24} className="slide6-metric-icon icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">
                  Citation of Ceres Power Patents
                </h3>
              </div>
              <div className="slide6-scoring-scale scoring-scale flex flex-1 flex-col gap-2">
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-red mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    1
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      No citations
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      No intellectual connection to Ceres Power
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-yellow mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    3
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Indirect citations
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Citing broad review papers mentioning Ceres Power
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    7
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Few direct citations
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Citing one or two foundational Ceres Power patents
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    10
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Frequent significant citations
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Portfolio frequently builds upon Ceres Power's core IP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="slide6-metric-row metric-row flex flex-1 gap-5">
            {/* IP Portfolio Size and Growth */}
            <div className="slide6-metric-card metric-card animate-slide-up slide6-delay-400 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="slide6-metric-header metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <Award size={24} className="slide6-metric-icon icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">IP Portfolio Size and Growth</h3>
              </div>
              <div className="slide6-scoring-scale scoring-scale flex flex-1 flex-col gap-2">
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-red mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    1
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Stagnant or declining
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      No new patents in relevant areas for many years
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-yellow mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    3
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Stable portfolio
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Few patents annually, maintaining existing IP position
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    7
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Moderate growth
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Consistent, but not explosive, growth in patent filings
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    10
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Rapid significant growth
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Aggressively expanding IP protection with numerous filings
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recency of Patent Filings */}
            <div className="slide6-metric-card metric-card animate-slide-up slide6-delay-500 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="slide6-metric-header metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <Award size={24} className="slide6-metric-icon icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">Recency of Patent Filings</h3>
              </div>
              <div className="slide6-scoring-scale scoring-scale flex flex-1 flex-col gap-2">
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-red mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    1
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Last filings &gt; 5 years ago
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      IP activity is outdated
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-yellow mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    3
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Last filings 3-5 years ago
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Some recent activity, but not consistently innovating
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    7
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Last filings 1-3 years ago
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Ongoing, but not cutting-edge, IP development
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    10
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Recent filings (&lt; 1 year ago)
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Continuously filing new patents, active R&D
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row - Quality and Strength of Patents (spans full width) */}
          <div className="slide6-metric-row slide6-metric-row-third metric-row flex gap-5">
            <div className="slide6-metric-card metric-card animate-slide-up slide6-delay-600 flex flex-1 flex-col rounded-lg bg-white p-4 shadow-lg">
              <div className="slide6-metric-header metric-header mb-3 flex items-center border-b border-gray-200 pb-2">
                <FileText size={24} className="slide6-metric-icon icon-orange mr-3" />
                <h3 className="text-base font-semibold lg:text-lg">
                  Quality and Strength of Patents
                </h3>
              </div>
              <div className="slide6-scoring-scale scoring-scale flex gap-4">
                <div className="slide6-score-item score-item flex flex-1 items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-red mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    1
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Weak patents
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Narrow claims, easily circumvented
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex flex-1 items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-yellow mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    3
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Average quality
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Some protection but might be challenged
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex flex-1 items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    7
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Solid patents
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Broad claims, meaningful protection
                    </div>
                  </div>
                </div>
                <div className="slide6-score-item score-item flex flex-1 items-start rounded-md bg-gray-50 p-2">
                  <div className="slide6-score-badge score-badge score-green mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    10
                  </div>
                  <div className="slide6-score-content score-content flex-1">
                    <div className="slide6-score-title score-title mb-1 text-sm font-semibold">
                      Very strong patents
                    </div>
                    <div className="slide6-score-description score-description text-xs text-gray-600">
                      Foundational, broad claims, robust against challenges
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="slide6-footer footer animate-fade-in-delay-2 flex-shrink-0 px-4 py-3 text-right text-xs text-gray-600 lg:px-8 lg:text-sm">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide6;

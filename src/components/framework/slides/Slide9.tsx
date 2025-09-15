import React from "react";
import { Zap, Shield, Building, Lightbulb } from "lucide-react";

const Slide9: React.FC = () => {
  return (
    <div className="slide bg-light-gray">
      {/* Header Section */}
      <div className="slide-header bg-orange animate-fade-in">
        <h1 className="text-center text-2xl text-white lg:text-3xl">
          Strategic Partner Selection Framework
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="slide-content">
        {/* Main Content Grid */}
        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <h2 className="animate-fade-in-delay text-orange mb-4 text-xl font-semibold lg:text-2xl">
              Strategic Partner Selection Framework
            </h2>

            <div className="mb-4 space-y-4 lg:mb-6">
              <div className="animate-slide-up animate-delay-200 flex items-start space-x-3">
                <Zap size={24} className="icon-orange mt-1" />
                <p className="text-sm lg:text-base">
                  Ceres Power's success is{" "}
                  <span className="highlight-orange">inextricably linked</span> to the success of
                  our licensing partners
                </p>
              </div>

              <div className="animate-slide-up animate-delay-300 flex items-start space-x-3">
                <Shield size={24} className="icon-orange mt-1" />
                <p className="text-sm lg:text-base">
                  Undisciplined partner selection introduces{" "}
                  <span className="highlight-orange">significant risk</span> and threatens our
                  ability to scale
                </p>
              </div>

              <div className="animate-slide-up animate-delay-400 flex items-start space-x-3">
                <Building size={24} className="icon-orange mt-1" />
                <p className="text-sm lg:text-base">
                  The four-pillar framework provides a{" "}
                  <span className="highlight-orange">robust, quantitative methodology</span> for
                  identifying committed partners
                </p>
              </div>
            </div>

            <div className="framework-card animate-slide-up animate-delay-500">
              <h3 className="mb-3 flex items-center text-base font-semibold lg:text-lg">
                <Lightbulb size={20} className="icon-orange mr-2" />
                Recommendation
              </h3>
              <p className="text-xs text-gray-700 lg:text-sm">
                Immediate adoption of this framework for all future business development activities.
                By rigorously applying these criteria, we will build a global network of licensees
                that can drive mass adoption, transition to a high-margin royalty model, and
                solidify our position as a global leader in clean energy.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="framework-pillar animate-slide-up animate-delay-600">
                <Building size={32} className="icon-orange mx-auto mb-2" />
                <p className="text-xs font-semibold lg:text-sm">Manufacturing Prowess</p>
              </div>
              <div className="framework-pillar animate-slide-up animate-delay-700">
                <Shield size={32} className="icon-orange mx-auto mb-2" />
                <p className="text-xs font-semibold lg:text-sm">Market Access</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="framework-pillar animate-slide-up animate-delay-800">
                <Zap size={32} className="icon-orange mx-auto mb-2" />
                <p className="text-xs font-semibold lg:text-sm">Financial Strength</p>
              </div>
              <div className="framework-pillar animate-slide-up animate-delay-900">
                <Lightbulb size={32} className="icon-orange mx-auto mb-2" />
                <p className="text-xs font-semibold lg:text-sm">Strategic Alignment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="slide-footer bg-light-orange animate-fade-in-delay-2">
        Ceres Power: Partner Evaluation Framework
      </div>
    </div>
  );
};

export default Slide9;

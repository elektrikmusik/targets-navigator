import React from "react";
import { TrendingUp, Factory, Atom, Lightbulb, Settings, Scale } from "lucide-react";

const Slide1: React.FC = () => {
  const criteria = [
    { icon: TrendingUp, title: "Financial Performance" },
    { icon: Factory, title: "Industry Fit" },
    { icon: Atom, title: "Hydrogen Strategy" },
    { icon: Lightbulb, title: "IP Activity" },
    { icon: Settings, title: "Manufacturing Capabilities" },
    { icon: Scale, title: "Ownership" },
  ];

  return (
    <div className="slide slide1-container relative flex h-full w-full flex-col">
      <div className="content flex flex-grow flex-col items-center justify-center px-8 py-8 lg:px-15 lg:py-15">
        <h1 className="animate-fade-in mb-5 text-center text-4xl leading-tight text-white lg:text-6xl">
          Target <span className="text-orange">Evaluation</span> Framework
        </h1>
        <h2 className="animate-fade-in-delay mb-10 text-center text-xl text-gray-200 lg:mb-15 lg:text-2xl">
          Ceres Power's SOFC and SOEC Technologies
        </h2>

        <div className="criteria-container grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {criteria.map((criterion, index) => {
            const IconComponent = criterion.icon;
            return (
              <div
                key={index}
                className={`criterion animate-slide-up group slide1-criterion cursor-pointer rounded-xl p-6 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-105 hover:transform hover:shadow-2xl slide1-delay-${index}`}
              >
                <div className="icon-container mb-4 transition-all duration-300 group-hover:scale-110">
                  <IconComponent size={40} className="text-orange mx-auto" />
                </div>
                <h3 className="text-lg text-white transition-all duration-300 group-hover:text-white">
                  {criterion.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
      <div className="footer animate-fade-in-delay-2 px-8 py-5 text-right text-gray-400 lg:px-16">
        August 2025
      </div>
    </div>
  );
};

export default Slide1;

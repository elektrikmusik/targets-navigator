import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
} from "../components/framework/slides";

interface Slide {
  id: number;
  title: string;
  component: React.ComponentType;
}

const Framework: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Strategic Framework for Selecting Licensing Partners",
      component: Slide1,
    },
    {
      id: 2,
      title: "Executive Summary",
      component: Slide2,
    },
    {
      id: 3,
      title: "The Strategic Imperative of Partner Selection",
      component: Slide3,
    },
    {
      id: 4,
      title: "Partner Selection Criteria",
      component: Slide4,
    },
    {
      id: 5,
      title: "Pillar 1: Manufacturing Prowess & Scalability",
      component: Slide5,
    },
    {
      id: 6,
      title: "Pillar 2: Market Access & Commercialization Capability",
      component: Slide6,
    },
    {
      id: 7,
      title: "Pillar 3: Financial Strength & Commitment",
      component: Slide7,
    },
    {
      id: 8,
      title: "Pillar 4: Strategic and Technological Alignment",
      component: Slide8,
    },
    {
      id: 9,
      title: "Implementation Framework",
      component: Slide9,
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide]);

  // Mouse wheel navigation with debouncing
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (event: Event) => {
      const wheelEvent = event as WheelEvent;
      wheelEvent.preventDefault();

      if (isScrolling) {
        return;
      }

      isScrolling = true;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        if (wheelEvent.deltaY > 0) {
          if (currentSlide < slides.length - 1) {
            nextSlide();
          }
        } else if (wheelEvent.deltaY < 0) {
          if (currentSlide > 0) {
            prevSlide();
          }
        }

        setTimeout(() => {
          isScrolling = false;
        }, 300);
      }, 150);
    };

    const container = document.querySelector(".framework-slideshow");
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [currentSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="framework-slideshow relative h-screen w-full overflow-hidden bg-black">
      {/* Slide Content */}
      <div className="h-full w-full">
        <CurrentSlideComponent />
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform">
        <div className="flex items-center gap-4 rounded-full border border-white/20 bg-black/20 px-6 py-3 backdrop-blur-xl">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="rounded-full p-2 transition-all duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`slide-indicator ${index === currentSlide ? "active" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="rounded-full p-2 transition-all duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Slide Counter */}
        <div className="mt-2 text-center">
          <span className="text-sm text-white/60">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed top-8 left-8 z-50">
        <div className="space-y-1 text-sm text-white/60">
          <div>← → Arrow keys to navigate</div>
          <div>Space bar for next slide</div>
        </div>
      </div>
    </div>
  );
};

export default Framework;

/**
 * Dimension constants for responsive design
 * Centralizes all hardcoded values to ensure consistency and maintainability
 */

// Viewport breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Spacing scale (matching Tailwind CSS)
export const SPACING = {
  xs: "0.25rem", // 1
  sm: "0.5rem", // 2
  md: "0.75rem", // 3
  lg: "1rem", // 4
  xl: "1.25rem", // 5
  "2xl": "1.5rem", // 6
  "3xl": "1.75rem", // 7
  "4xl": "2rem", // 8
  "5xl": "2.25rem", // 9
  "6xl": "2.5rem", // 10
  "7xl": "3rem", // 12
  "8xl": "3.5rem", // 14
  "9xl": "4rem", // 16
} as const;

// Icon sizes
export const ICON_SIZES = {
  xs: "h-3 w-3", // 12px
  sm: "h-4 w-4", // 16px
  md: "h-5 w-5", // 20px
  lg: "h-6 w-6", // 24px
  xl: "h-8 w-8", // 32px
  "2xl": "h-10 w-10", // 40px
} as const;

// Avatar sizes
export const AVATAR_SIZES = {
  sm: "w-6 h-6", // 24px
  md: "w-8 h-8", // 32px
  lg: "w-10 h-10", // 40px
  xl: "w-12 h-12", // 48px
} as const;

// Button sizes
export const BUTTON_SIZES = {
  sm: "h-8", // 32px
  md: "h-9", // 36px
  lg: "h-10", // 40px
  xl: "h-11", // 44px
} as const;

// Chart dimensions
export const CHART_DIMENSIONS = {
  // Default heights
  default: 400,
  large: 500,
  small: 300,

  // Responsive height calculations
  getResponsiveHeight: (viewportHeight: number, headerSpace = 0, footerSpace = 0) => {
    const availableHeight = viewportHeight - headerSpace - footerSpace;
    return Math.max(300, availableHeight);
  },

  // Chart viewport ratios
  getChartRatio:
    (ratio: number = 0.8) =>
    (viewportHeight: number) => {
      return Math.max(300, viewportHeight * ratio);
    },
} as const;

// Loading state dimensions
export const LOADING_DIMENSIONS = {
  // Viewport-relative heights
  small: "min-h-[20vh]", // 20% of viewport height
  medium: "min-h-[40vh]", // 40% of viewport height
  large: "min-h-[50vh]", // 50% of viewport height
  full: "min-h-[80vh]", // 80% of viewport height

  // Spinner sizes
  spinner: {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  },
} as const;

// Grid configurations
export const GRID_CONFIGS = {
  // Responsive grid columns
  stats: "grid gap-4 md:grid-cols-2 lg:grid-cols-5",
  details: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
  companyInfo: "grid gap-4 md:grid-cols-2",
  chartLayout: "grid gap-6 lg:grid-cols-3 h-full",

  // Gap sizes
  gap: {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },
} as const;

// Container dimensions
export const CONTAINER_DIMENSIONS = {
  // Max widths
  maxWidth: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  },

  // Padding
  padding: {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  },

  // Margins
  margin: {
    sm: "m-2",
    md: "m-4",
    lg: "m-6",
    xl: "m-8",
  },
} as const;

// Chart axis ranges
export const CHART_RANGES = {
  // Score ranges (0-10 scale)
  score: {
    min: 0,
    max: 10,
  },

  // Percentage ranges (0-100 scale)
  percentage: {
    min: 0,
    max: 100,
  },

  // Custom ranges
  custom: (min: number, max: number) => ({
    min,
    max,
  }),
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: "duration-150",
  normal: "duration-300",
  slow: "duration-500",
} as const;

// Z-index scale
export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  tooltip: 200,
  notification: 300,
} as const;

// Border radius
export const BORDER_RADIUS = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

// Shadow sizes
export const SHADOWS = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  none: "shadow-none",
} as const;

// Utility functions
export const getResponsiveHeight = (baseHeight: number, viewportHeight: number, ratio = 0.8) => {
  return Math.max(baseHeight, viewportHeight * ratio);
};

export const getViewportHeight = () => {
  if (typeof window !== "undefined") {
    return window.innerHeight;
  }
  return 800; // Fallback for SSR
};

export const getViewportWidth = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth;
  }
  return 1024; // Fallback for SSR
};

// Chart-specific calculations
export const calculateChartHeight = (
  viewportHeight: number,
  headerHeight = 120,
  statsHeight = 100,
  controlsHeight = 200,
  padding = 100,
) => {
  const availableHeight = viewportHeight - headerHeight - statsHeight - controlsHeight - padding;
  return Math.max(300, availableHeight);
};

// Responsive text sizes
export const TEXT_SIZES = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;

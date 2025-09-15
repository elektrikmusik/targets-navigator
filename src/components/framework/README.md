# Framework Slideshow Structure

This directory contains the modular slideshow components for the Framework section.

## 📁 Directory Structure

```
src/components/framework/
├── slides/
│   ├── Slide1.tsx      # Title slide
│   ├── Slide2.tsx      # Executive Summary
│   ├── Slide3.tsx      # Strategic Imperative
│   ├── Slide4.tsx      # Partner Selection Criteria
│   ├── Slide5.tsx      # Placeholder for future content
│   ├── Slide6.tsx      # Placeholder for future content
│   ├── Slide7.tsx      # Placeholder for future content
│   ├── Slide8.tsx      # Placeholder for future content
│   ├── Slide9.tsx      # Conclusion and Recommendation
│   └── index.ts        # Exports all slide components
└── README.md           # This documentation
```

## 🎯 Benefits of Modular Structure

1. **Easy Maintenance**: Each slide is in its own file, making it easy to find and edit specific content
2. **Better Organization**: Clear separation of concerns with individual slide components
3. **Scalability**: Easy to add new slides or modify existing ones without affecting others
4. **Reusability**: Slide components can be reused or imported elsewhere if needed
5. **Version Control**: Better git history with individual file changes

## 🎨 Styling

All slides use the dedicated CSS framework from `src/styles/framework.css` with:

- Consistent color scheme using CSS custom properties
- Responsive design with mobile breakpoints
- Smooth animations and transitions
- Professional typography system

## 📝 Adding New Slides

1. Create a new slide component in `slides/SlideX.tsx`
2. Export it in `slides/index.ts`
3. Import and add it to the slides array in `src/page/Framework.tsx`

## 🎭 Available CSS Classes

- `framework-fade-in` - Smooth fade transitions
- `framework-slide-in-left/right` - Directional slides
- `framework-bounce-in` - Bouncy entrance effects
- `framework-text-primary/secondary/accent` - Text color classes
- `framework-pillar` - Pillar card styling
- `framework-card` - General card styling
- `framework-keyword` - Keyword tag styling

## 🔧 Usage Example

```tsx
import React from "react";

const MyNewSlide: React.FC = () => {
  return (
    <div className="framework-slide-content framework-fade-in">
      <h2 className="framework-text-2xl framework-text-primary">My New Slide</h2>
      <p className="framework-text-lg">Content goes here...</p>
    </div>
  );
};

export default MyNewSlide;
```

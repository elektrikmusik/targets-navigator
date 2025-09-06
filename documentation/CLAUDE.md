# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Run lint-staged (usually triggered by pre-commit hooks)
npm run lint-staged
```

## Project Architecture

This is a **Company Scoring Navigator** - a React-based dashboard application for comprehensive company evaluation and data visualization built on a React-TS starter template.

### Core Architecture Layers

1. **Frontend**: React 19 + TypeScript + Vite with Tailwind CSS
2. **Data Visualization**: Plotly.js integration for interactive charts
3. **Authentication**: Supabase Auth with protected routes
4. **Database**: Supabase PostgreSQL with 22+ tables for comprehensive company analysis
5. **State Management**: Custom React hooks with context patterns

### Key Application Features

- **Multi-dimensional Company Scoring**: 6 evaluation categories (Hydrogen, Industry, Manufacturing, Finance, Ownership, IP/Patents)
- **Interactive Dashboard**: Real-time charts, analytics, and company comparisons
- **Advanced Table Views**: Specialized data tables for each evaluation dimension
- **Authentication System**: User registration, login, and session management
- **Data Management**: Sample data generation, analytics tracking, and export capabilities

### Database Schema

The application works with a comprehensive Supabase database containing:

- **Company Tables**: `companies_profile`, `companies_hydrogen`, `companies_industry`, `companies_manufacturing`, `companies_ownership`, `companies_ip`, `company_financial`
- **Document Tables**: AI-powered document analysis with vector embeddings
- **SEC Data**: Financial filings and metrics integration
- **Analytics**: User behavior tracking and session management

All company tables are linked via a `key` foreign key relationship and contain 488 companies with detailed scoring data.

### Tech Stack Details

**Core Dependencies**:

- React 19 with React Router for navigation
- TypeScript with strict configuration
- Tailwind CSS 4+ with animations
- Plotly.js for data visualization
- Supabase for backend services
- Radix UI components for accessible UI elements
- Framer Motion for animations

**Build Tools**:

- Vite with SWC for fast compilation
- unplugin-auto-import for automatic React/component imports
- ESLint + TypeScript ESLint for code quality
- Husky for git hooks and lint-staged for pre-commit checks

### File Structure Conventions

```
src/
├── components/
│   ├── ui/           # Reusable UI components (auto-imported)
│   ├── auth/         # Authentication components
│   ├── charts/       # Plotly.js chart components
│   ├── tables/       # Specialized data table components
│   ├── Dashboard.tsx # Main analytics dashboard
│   └── TableNavigator.tsx # Table navigation interface
├── hooks/            # Custom React hooks for data management
├── context/          # React context providers
├── lib/              # Utilities and Supabase client
└── types/            # TypeScript type definitions
```

### Special Configuration Notes

- **Auto-imports**: React, React Router, and `src/components/ui` components are auto-imported
- **Path aliases**: Use `@/` for `src/` directory imports
- **SVG handling**: Use `?react` query to import SVGs as React components
- **Environment variables**: Supabase credentials required in `.env`

### Development Workflow

1. **Local Data**: Application supports both Supabase integration and local mock data
2. **Authentication**: Optional - can be disabled for development (see NO-AUTH-SETUP.md)
3. **Database Setup**: Run `supabase-setup.sql` for full database schema
4. **Chart Development**: Create new chart components in `src/components/charts/`
5. **Table Extensions**: Add new evaluation tables in `src/components/tables/`

### Performance Considerations

- Components use React 19 features including automatic batching
- Large datasets handled with virtual scrolling (@tanstack/react-virtual)
- Chart rendering optimized with Plotly.js-dist-min
- Image optimization via unplugin-imagemin
- Production builds use compression and tree-shaking

### Testing and Quality

- ESLint configured with TypeScript and React rules
- Prettier integration for code formatting
- Pre-commit hooks ensure code quality
- No test framework currently configured - add as needed

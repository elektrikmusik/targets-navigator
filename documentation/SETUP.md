# Targets Navigator Setup Guide

## Overview

This enhanced React-TS starter kit now includes Supabase authentication and Plotly.js data visualization capabilities, transforming it into a powerful dashboard application for tracking targets and goals.

## New Features Added

### 🔐 Authentication with Supabase

- User registration and login
- Password reset functionality
- Session management
- Protected routes

### 📊 Data Visualization with Plotly.js

- Interactive line charts
- Bar charts with customization
- Pie charts for distribution analysis
- Scatter plots for correlation analysis
- Responsive chart layouts

### 🎯 Target/Goal Tracking

- Sample data generation
- Category-based analytics
- Real-time data updates
- User-specific data isolation

## Setup Instructions

### 1. Install Dependencies

All required packages have been installed:

- `@supabase/supabase-js` - Supabase client
- `plotly.js-dist-min` - Plotly.js core
- `react-plotly.js` - React wrapper for Plotly
- `@types/plotly.js` & `@types/react-plotly.js` - TypeScript definitions

### 2. Environment Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com)

3. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Database Setup

Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script

This will create:

- `profiles` table for user profiles
- `analytics` table for event tracking
- `sample_data` table for demonstration data
- Row Level Security (RLS) policies
- Automatic profile creation triggers

### 4. Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   └── SignUpForm.tsx
│   ├── charts/         # Plotly.js chart components
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   └── ScatterPlot.tsx
│   └── Dashboard.tsx   # Main dashboard component
├── context/
│   └── AuthContext.tsx # Authentication context
├── hooks/
│   ├── useAnalytics.ts # Analytics data management
│   └── useSampleData.ts # Sample data operations
└── lib/
    └── supabase.ts     # Supabase client configuration
```

## Usage

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Features Available

#### Authentication Flow

1. Users see a landing page with app features
2. Click "Get Started" to open the auth modal
3. Sign up with email/password or sign in if already registered
4. After authentication, users are redirected to the dashboard

#### Dashboard Features

1. **Generate Sample Data**: Creates demo data for visualization
2. **Interactive Charts**: View data through different chart types
3. **Real-time Analytics**: Track user events and interactions
4. **Category Management**: Organize data by categories
5. **Data Table**: View raw data in tabular format

#### Chart Types Available

- **Line Charts**: Time series data visualization
- **Bar Charts**: Category comparisons
- **Pie Charts**: Distribution analysis
- **Scatter Plots**: Correlation analysis

## Security Features

- Row Level Security (RLS) ensures users only see their own data
- Automatic user profile creation on signup
- Secure environment variable handling
- Protected API endpoints through Supabase

## Customization

### Adding New Chart Types

1. Create a new component in `src/components/charts/`
2. Follow the existing pattern with TypeScript interfaces
3. Export from `src/components/charts/index.ts`

### Extending Database Schema

1. Add new tables to `supabase-setup.sql`
2. Update TypeScript types in `src/lib/supabase.ts`
3. Create corresponding hooks in `src/hooks/`

### Styling

- Uses Tailwind CSS for consistent styling
- Chart components accept custom styling props
- Responsive design built-in

## Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure `.env` file is properly configured
2. **Database Setup**: Verify all SQL scripts ran successfully
3. **CORS Issues**: Check Supabase project settings for allowed origins

### Development Tips

- Use browser dev tools to inspect Supabase network requests
- Check Supabase logs for authentication issues
- Verify RLS policies are working correctly

## Next Steps

- Add more chart types (heatmaps, 3D plots, etc.)
- Implement data export functionality
- Add real-time collaboration features
- Integrate with external APIs for data import

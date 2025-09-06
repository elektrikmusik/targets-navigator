# Company Scoring Navigator - Setup Guide

## Overview

This React-TS application has been transformed into a **Company Scoring Navigator** - a comprehensive dashboard for evaluating and analyzing company performance across multiple dimensions. Based on the actual Supabase schema with 22 tables containing data for 488 companies, this dashboard provides powerful analytics for company evaluation.

## Business Domain: Company Evaluation & Scoring

### **Core Evaluation Dimensions**

The application evaluates companies across 6 key dimensions:

1. **🔋 Hydrogen Score** - Investment focus, partnerships, technology readiness, market participation
2. **🏭 Industry Score** - Core business model, technology capabilities, market position
3. **⚙️ Manufacturing Score** - Materials handling, scale, quality, supply chain, R&D capabilities
4. **💰 Finance Score** - Revenue performance, profitability, investment capacity
5. **🏛️ Ownership Score** - Ownership structure, decision-making, strategic alignment
6. **📋 IP Activity Score** - Patent portfolio, citations, filing activity, IP strategy

### **Data Schema Understanding**

The application works with the following core tables:

- `companies_profile` (488 companies) - Core company information
- `companies_hydrogen` - Hydrogen technology evaluation and scores
- `companies_industry` - Industry analysis and business evaluation
- `companies_manufacturing` - Manufacturing capabilities assessment
- `company_financial` - Financial performance metrics
- `companies_ownership` - Ownership structure analysis
- `companies_ip` - Intellectual property assessment

## Features Implemented

### 📊 **Interactive Dashboard**

- **Dynamic Category Selection** - Switch between different scoring dimensions
- **Real-time Analytics** - Key metrics and performance indicators
- **Multi-dimensional Visualization** - 4 different chart types with company data

### 📈 **Advanced Visualizations**

- **Top Performers Bar Chart** - Shows top 10 companies in selected category
- **Score Distribution Pie Chart** - Breakdown of companies by score ranges (0-20, 21-40, etc.)
- **Correlation Scatter Plot** - Multi-dimensional analysis (Hydrogen vs Industry, with Finance as bubble size, Manufacturing as color)
- **Multi-Category Line Chart** - Compare all scoring dimensions for top companies

### 🔍 **Company Analysis Tools**

- **Company Rankings Table** - Color-coded scores across all dimensions
- **Search & Filter** - Find companies by name
- **Performance Metrics** - Average scores, top performers, high-performer counts

### 💾 **Data Management**

- **Local Storage** - No database required for demo
- **Mock Data Generation** - 10 real hydrogen/clean energy companies with realistic scores
- **Data Persistence** - Survives browser sessions

## Quick Start

### 1. Development Setup

```bash
npm install
npm run dev
```

### 2. Production Build

```bash
npm run build
npm run preview
```

### 3. First Use

1. Click "Load Demo Data" to populate with sample companies
2. Explore different score categories using the tab buttons
3. Use search to find specific companies
4. Hover over charts for detailed information

## Demo Companies Included

The application includes realistic data for major clean energy/hydrogen companies:

- **Tesla Inc.** - EV manufacturer with hydrogen exploration
- **Toyota Motor Corporation** - Automotive leader with hydrogen fuel cells
- **Ballard Power Systems** - Fuel cell technology specialist
- **Air Liquide** - Industrial gas and hydrogen production
- **Plug Power Inc.** - Hydrogen fuel cell systems
- **Linde plc** - Industrial gas and hydrogen infrastructure
- **Nel Hydrogen** - Pure-play hydrogen technology company
- **ITM Power** - Electrolyzer manufacturer
- **FuelCell Energy** - Fuel cell power generation
- **Bloom Energy** - Solid oxide fuel cells

## Technical Architecture

### **React + TypeScript**

- Fully typed interfaces matching Supabase schema
- Component-based architecture with proper separation of concerns
- Custom hooks for data management

### **Data Layer**

```
useLocalCompanyData Hook
├── Company Profiles (basic info)
├── Company Scores (all dimensions)
├── Search & Filtering
├── Analytics Functions
└── Local Storage Persistence
```

### **Chart Components**

```
Plotly.js Integration
├── BarChart (Top Performers)
├── PieChart (Score Distribution)
├── ScatterPlot (Multi-dimensional)
└── LineChart (Category Comparison)
```

### **Scoring System**

- **Scale**: 0-100 points per dimension
- **Color Coding**:
  - 🟢 Green (80-100): High Performance
  - 🟡 Yellow (60-79): Medium Performance
  - 🔴 Red (0-59): Needs Improvement

## Customization Options

### **Adding New Companies**

```typescript
// Update mock data in useLocalCompanyData.ts
const newCompany = {
  id: 11,
  key: 11,
  englishName: "New Company Name",
  companyName: "Company Name",
  basicInformation: "Company description",
  productServices: "Products/services",
  marketPosition: "Market position",
};
```

### **Adding New Score Categories**

```typescript
// Add to scoreCategories in Dashboard.tsx
{
  key: 'new_score' as keyof CompanyScores,
  label: 'New Score Category',
  color: '#hexcolor'
}
```

### **Customizing Chart Appearance**

- Modify chart components in `src/components/charts/`
- Update color schemes in Dashboard component
- Adjust chart dimensions and styling

## Supabase Integration (Optional)

### **For Real Data Connection**

1. Set up environment variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

2. Switch to real data hooks:

   ```typescript
   // Replace useLocalCompanyData with useCompanyData
   import { useCompanyData } from "@/hooks/useCompanyData";
   ```

3. Run SQL setup:
   ```bash
   # Execute supabase-setup.sql in your Supabase SQL editor
   ```

## Performance & Scalability

### **Current Capacity**

- **Demo Data**: 10 companies with full scoring
- **Real Data**: Designed for 488+ companies
- **Charts**: Optimized for 100+ data points
- **Storage**: ~1MB local storage usage

### **Optimization Features**

- Lazy loading of chart data
- Efficient filtering and search
- Memoized calculations
- Responsive design for all screen sizes

## Use Cases

### **Investment Analysis**

- Compare companies across multiple dimensions
- Identify top performers in specific categories
- Analyze correlation between different scores

### **Market Research**

- Industry landscape analysis
- Competitive positioning
- Technology readiness assessment

### **Due Diligence**

- Comprehensive company evaluation
- Multi-faceted scoring analysis
- Performance benchmarking

---

**🚀 Ready to Explore Company Analytics!**

The application is now a sophisticated company evaluation platform that provides deep insights into business performance across multiple critical dimensions. Perfect for investors, analysts, and researchers in the clean energy and industrial sectors.

# Strategic Analysis Dashboard

## Overview

The Strategic Analysis Dashboard is a comprehensive analytical tool that provides strategic insights into companies within the Hydrogen and Manufacturing sectors. It implements the scoring methodology outlined in `calculation.md` and presents data in an intuitive quadrant-based visualization system.

## Features

### 1. Summary Statistics Section

- **Total Companies**: Count of companies in the database
- **Average Scores**: Across all 6 evaluation dimensions (Hydrogen, Industry, Manufacturing, Financial, Ownership, IP Activity)
- **Top Performer**: Company with the highest Hydrogen score
- **High Performers**: Count of companies with scores 80+

### 2. Quadrant Analysis Chart

The main scatter plot categorizes companies into four strategic quadrants:

- **Priority leads (Investigate now)**: High ability to execute + high strategic fit
- **Monitor / Opportunistic**: High ability to execute + lower strategic fit
- **Nurture with Support**: Lower ability to execute + high strategic fit
- **Not a focus**: Lower ability to execute + lower strategic fit

### 3. Flag Market Section

Visual representation of market analysis with:

- Purple bars: Total companies analyzed
- Orange bars: Priority targets identified

### 4. Company Examples

- **Priority Leads**: Top companies requiring immediate attention
- **Monitor & Nurture**: Companies for strategic monitoring and support

## Technical Implementation

### Components

#### StrategicAnalysisDashboard

Main dashboard component that orchestrates all sections and data visualization.

#### useStrategicAnalysis Hook

Custom hook that:

- Fetches company data from Supabase
- Calculates strategic positioning scores
- Provides real-time statistics and metrics

### Data Structure

```typescript
interface StrategicCompanyData {
  id: string;
  name: string;
  abilityToExecute: number; // 0-10 scale
  strategicFit: number; // 0-10 scale
  quadrant: string; // Quadrant classification
  scores: {
    hydrogen: number; // 0-100 scale
    industry: number; // 0-100 scale
    manufacturing: number; // 0-100 scale
    financial: number; // 0-100 scale
    ownership: number; // 0-100 scale
    ip: number; // 0-100 scale
  };
  key: number; // Database key
}
```

### Scoring Algorithm

#### Ability to Execute Score

Based on IP, Revenue, and Ownership with bonus/demerit system:

- **IP Score (40%)**: Innovation capability and patent activity
- **Financial Score (40%)**: Revenue performance and investment capacity
- **Ownership Score (20%)**: Governance and decision-making structure

**Bonus System:**

- IP Score ≥ 7.0: +0.5 bonus
- IP Score ≥ 8.0: +0.5 additional bonus
- Financial Score ≥ 7.0: +0.3 bonus
- Financial Score ≥ 8.0: +0.3 additional bonus

**Demerit System:**

- IP Score ≤ 3.0: -0.5 penalty
- IP Score ≤ 2.0: -0.5 additional penalty
- Financial Score ≤ 3.0: -0.3 penalty
- Financial Score ≤ 2.0: -0.3 additional penalty

#### Strategic Fit Score

Based on Industry alignment, Hydrogen strategy, and Manufacturing capability:

- **Industry Score (40%)**: Business model and market positioning
- **Hydrogen Score (40%)**: H2 focus and commitment level
- **Manufacturing Score (20%)**: Production capabilities and scale

**Bonus System:**

- Industry Score ≥ 7.0: +0.4 bonus
- Industry Score ≥ 8.0: +0.4 additional bonus
- Hydrogen Score ≥ 7.0: +0.4 bonus
- Hydrogen Score ≥ 8.0: +0.4 additional bonus
- Manufacturing Score ≥ 7.0: +0.2 bonus
- Manufacturing Score ≥ 8.0: +0.2 additional bonus

**Demerit System:**

- Manufacturing Score ≤ 3.0: -0.3 penalty
- Manufacturing Score ≤ 2.0: -0.3 additional penalty

### Quadrant Classification

```typescript
const determineQuadrant = (abilityToExecute: number, strategicFit: number): string => {
  if (abilityToExecute >= 7.0 && strategicFit >= 7.0) {
    return "Priority leads (Investigate now)";
  } else if (abilityToExecute >= 7.0 && strategicFit < 7.0) {
    return "Monitor / Opportunistic";
  } else if (abilityToExecute < 7.0 && strategicFit < 7.0) {
    return "Not a focus";
  } else {
    return "Nurture with Support";
  }
};
```

## Usage

### Basic Implementation

```tsx
import { StrategicAnalysisDashboard } from "@/components";

function App() {
  return (
    <div>
      <StrategicAnalysisDashboard />
    </div>
  );
}
```

### With Custom Hook

```tsx
import { useStrategicAnalysis } from "@/hooks";

function CustomDashboard() {
  const { companies, stats, loading, error, refresh } = useStrategicAnalysis();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Custom Dashboard</h1>
      <p>Total Companies: {stats.totalCompanies}</p>
      <button onClick={refresh}>Refresh Data</button>
    </div>
  );
}
```

## Data Sources

The dashboard integrates data from multiple Supabase tables:

- `companies_profile`: Company basic information
- `companies_hydrogen`: Hydrogen focus evaluation scores
- `companies_industry`: Industry analysis scores
- `companies_manufacturing`: Manufacturing capability scores
- `company_financial`: Financial performance scores
- `companies_ownership`: Ownership structure scores
- `companies_ip`: Intellectual property activity scores

## Customization

### Styling

The dashboard uses Tailwind CSS classes and can be customized by:

- Modifying color schemes in the quadrant labels
- Adjusting card layouts and spacing
- Customizing chart colors and themes

### Data Processing

Modify the scoring algorithms in `useStrategicAnalysis.ts`:

- Adjust bonus/demerit thresholds
- Change weighting percentages
- Add new scoring dimensions

### Chart Configuration

Customize the scatter plot by modifying:

- Axis ranges and labels
- Marker sizes and colors
- Chart dimensions and layout

## Performance Considerations

- **Data Fetching**: Uses Promise.all for parallel data retrieval
- **Memoization**: Implements useMemo for expensive calculations
- **Lazy Loading**: Data is fetched only when component mounts
- **Refresh Control**: Manual refresh button for data updates

## Error Handling

The dashboard includes comprehensive error handling:

- Loading states with spinner animations
- Error messages with retry functionality
- Graceful fallbacks for missing data
- Network error recovery

## Future Enhancements

### Planned Features

- **Real-time Updates**: WebSocket integration for live data
- **Export Functionality**: PDF/Excel report generation
- **Advanced Filtering**: Company search and filtering
- **Historical Trends**: Score progression over time
- **Custom Dashboards**: User-configurable layouts

### Integration Opportunities

- **Notification System**: Alert for new priority leads
- **CRM Integration**: Export to sales/marketing tools
- **Analytics Tracking**: User interaction metrics
- **Mobile Responsiveness**: Optimized mobile experience

## Troubleshooting

### Common Issues

1. **No Data Displayed**
   - Check Supabase connection
   - Verify table permissions
   - Check console for error messages

2. **Scores Not Calculating**
   - Ensure all required tables exist
   - Verify score field names match
   - Check for null/undefined values

3. **Chart Not Rendering**
   - Verify Plotly.js dependency
   - Check data structure format
   - Ensure valid numeric values

### Debug Mode

Enable debug logging by adding to the hook:

```typescript
const useStrategicAnalysis = () => {
  // ... existing code ...

  console.log("Companies:", companies);
  console.log("Stats:", stats);
  console.log("Scatter Data:", getScatterData());

  // ... rest of code ...
};
```

## Contributing

When modifying the dashboard:

1. **Update Types**: Ensure TypeScript interfaces reflect changes
2. **Test Calculations**: Verify scoring algorithms remain accurate
3. **Document Changes**: Update this README with new features
4. **Performance**: Monitor impact on data loading and rendering
5. **Accessibility**: Maintain keyboard navigation and screen reader support

## License

This component is part of the Scoring Navigator application and follows the same licensing terms.

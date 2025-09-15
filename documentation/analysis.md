Comprehensive analysis combining data from `companies_profile`, `company_financial`, and `companies_ip` to provide insightful statistics on IP, revenues, tiers, regions, and countries.

[1 tool called]

Let me first check the structure of the `companies_ip` table to see what columns are available:

[1 tool called]

Now let me create the comprehensive analysis with the correct column names:

[1 tool called]

Now let me create detailed breakdowns by different dimensions:

[5 tools called]

## 📊 **Comprehensive Analysis: IP, Revenue, Tiers, Regions & Countries**

### �� **Overall Portfolio Statistics**

- **Total Companies**: 478
- **Tier 1**: 185 (38.7%) | **Tier 2**: 37 (7.7%) | **Tier 3**: 159 (33.3%) | **Tier 4**: 91 (19.0%) | **Partner**: 6 (1.3%)
- **Average Scores**: Overall: 5.40 | Finance: 4.76 | IP: 3.08 | Max Revenue: $32.26M

---

## 🏆 **Tier Performance Analysis**

| Tier        | Companies | %     | Avg Overall | Avg Finance | Avg IP   | Avg Revenue | Max Revenue |
| ----------- | --------- | ----- | ----------- | ----------- | -------- | ----------- | ----------- |
| **Tier 1**  | 185       | 38.7% | **6.71**    | **6.79**    | **4.26** | **$57.67M** | $638M       |
| **Tier 2**  | 37        | 7.7%  | 5.21        | 6.84        | 1.66     | $54.76M     | $476M       |
| **Tier 3**  | 159       | 33.3% | 4.99        | 2.98        | 2.81     | $13.89M     | $546M       |
| **Tier 4**  | 91        | 19.0% | 3.46        | 2.79        | 1.45     | $3.44M      | $16.44M     |
| **Partner** | 6         | 1.3%  | **6.77**    | 6.13        | **7.28** | $33.93M     | $98M        |

**Key Insights:**

- **Tier 1** dominates in overall performance and revenue
- **Partners** excel in IP activity (7.28) despite lower revenue
- **Tier 2** has surprisingly high finance scores but low IP scores

---

## 🌍 **Regional Analysis**

| Region           | Companies | %     | Tier 1 | Tier 1%   | Avg Overall | Avg Finance | Avg IP   | Avg Revenue |
| ---------------- | --------- | ----- | ------ | --------- | ----------- | ----------- | -------- | ----------- |
| **Japan**        | 40        | 8.4%  | 29     | **72.5%** | **6.72**    | **6.99**    | 4.38     | **$62.15M** |
| **Korea**        | 41        | 8.6%  | 24     | **58.5%** | **5.99**    | 5.40        | 4.06     | $48.87M     |
| **China**        | 71        | 14.9% | 39     | **54.9%** | 5.86        | 5.32        | 4.03     | $46.35M     |
| **Europe**       | 55        | 11.5% | 23     | 41.8%     | 5.54        | 4.73        | 3.53     | $19.96M     |
| **Americas**     | 46        | 9.6%  | 13     | 28.3%     | 4.94        | 5.06        | 2.30     | $44.83M     |
| **MENA**         | 43        | 9.0%  | 10     | 23.3%     | 4.76        | 4.43        | 1.65     | $49.25M     |
| **India**        | 43        | 9.0%  | 16     | 37.2%     | 5.41        | 4.40        | 2.33     | $13.37M     |
| **Rest of APAC** | 97        | 20.3% | 19     | 19.6%     | 4.60        | 3.93        | 1.45     | $15.02M     |
| **Fuel Cells**   | 36        | 7.5%  | 12     | 33.3%     | 5.43        | 2.91        | **5.49** | $3.54M      |

**Key Insights:**

- **Japan** leads in Tier 1 percentage (72.5%) and overall performance
- **Fuel Cells** sector has highest IP activity despite low revenue
- **Asia-Pacific** (Japan + Korea + China) dominates with 152 companies

---

## 🏛️ **Top Countries Analysis**

| Country         | Companies | Tier 1 | Tier 1%   | Avg Overall | Avg Finance | Avg IP   | Avg Revenue | Max Revenue |
| --------------- | --------- | ------ | --------- | ----------- | ----------- | -------- | ----------- | ----------- |
| **China**       | 81        | 43     | **53.1%** | 5.81        | 5.05        | 4.32     | $41.17M     | $546M       |
| **Japan**       | 43        | 30     | **69.8%** | **6.69**    | **6.95**    | 4.44     | **$60.29M** | $314M       |
| **South Korea** | 43        | 25     | **58.1%** | 6.00        | 5.36        | 4.06     | $47.20M     | $229M       |
| **USA**         | 49        | 15     | 30.6%     | 5.05        | 4.78        | 3.07     | $40.95M     | $638M       |
| **India**       | 43        | 15     | 34.9%     | 5.39        | 4.39        | 2.35     | $13.38M     | $125M       |
| **Germany**     | 15        | 8      | **53.3%** | 6.22        | 5.55        | **5.28** | $47.69M     | $349M       |

**Key Insights:**

- **Japan** has highest Tier 1 percentage (69.8%) and performance
- **Germany** leads in IP activity (5.28) among major countries
- **China** has most companies (81) but moderate Tier 1 percentage

---

## 💰 **Revenue vs IP Performance Correlation**

| Revenue Category              | Companies | Avg IP | Avg Finance | Avg Overall | Tier 1 | Tier 1%   |
| ----------------------------- | --------- | ------ | ----------- | ----------- | ------ | --------- |
| **High Revenue (≥$200M)**     | 16        | 4.47   | 4.46        | 5.94        | 11     | **68.8%** |
| **Medium Revenue ($50-199M)** | 70        | 4.34   | 8.22        | 6.82        | 58     | **82.9%** |
| **Low Revenue ($10-49M)**     | 125       | 3.52   | 6.90        | 6.26        | 83     | 66.4%     |
| **Very Low Revenue (<$10M)**  | 267       | 2.46   | 2.87        | 4.60        | 33     | 12.4%     |

**Key Insights:**

- **Medium revenue companies** ($50-199M) have highest Tier 1 percentage (82.9%)
- **IP performance** correlates with revenue tiers
- **Finance scores** peak in medium revenue range

---

## 🔬 **IP Performance by Tier**

| Tier        | Avg IP Activity | Avg Patents | Avg Citations | Avg Growth | Avg Recency | IP Ratings          |
| ----------- | --------------- | ----------- | ------------- | ---------- | ----------- | ------------------- |
| **Partner** | **7.28**        | **8.50**    | **4.00**      | **8.00**   | **8.50**    | 0 Excellent, 0 Good |
| **Tier 1**  | 4.26            | 4.75        | 1.22          | 5.19       | 5.98        | 0 Excellent, 1 Good |
| **Tier 3**  | 2.81            | 3.11        | 1.14          | 3.30       | 3.72        | 0 Excellent, 0 Good |
| **Tier 2**  | 1.66            | 1.59        | 1.00          | 1.73       | 2.35        | 0 Excellent, 1 Good |
| **Tier 4**  | 1.45            | 1.45        | 1.00          | 1.60       | 1.79        | 0 Excellent, 0 Good |

**Key Insights:**

- **Partners** excel across all IP metrics
- **Tier 1** companies show strong IP activity but limited excellent ratings
- **IP performance** generally correlates with tier ranking

---

## 🎯 **Strategic Insights**

1. **Geographic Concentration**: Asia-Pacific (Japan, Korea, China) dominates with high-performing companies
2. **Revenue Sweet Spot**: Medium revenue companies ($50-199M) show highest Tier 1 conversion rates
3. **IP Excellence**: Partners and Tier 1 companies lead in IP activity, but overall IP ratings are conservative
4. **Performance Correlation**: Strong correlation between finance scores, IP activity, and tier rankings
5. **Regional Specialization**: Japan excels in overall performance, Germany in IP, Fuel Cells sector in IP innovation

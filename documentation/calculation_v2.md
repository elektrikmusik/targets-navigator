revenueScoreRev:

1. revenue = MAX(annual_revenue;group_revenue)
2. scoring revenueScoreRev

- if revenue less than 8 then revenueScoreRev is 1
- if revenue greater or equal to 8 and less than 20 then revenueScoreRev is 5
- if revenue greater or equal to 20 and less than 200 then revenueScoreRev is 10
- if revenue greater or equal to 200 then revenueScoreRev is 7

3Y_growth_score:

- if growthRate less than 0 then 3Y_growth_score is 1
- if growthRate is greater or equal to 0 and less than 5 then 3Y_growth_score is 3
- if growthRate is greater or equal to 5 and less than 15 then 3Y_growth_score is 7
- if growthRate is greater than 15 then 3Y_growth_score is 10

net_profit_margin_score

- if netProftMargin less than 0 then net_profit_margin_score is 1
- if netProftMargin is greater or equal to 0 and less than 5 then net_profit_margin_score is 3
- if netProftMargin is greater or equal to 5 and less than 10 then net_profit_margin_score is 7
- if netProftMargin is greater than 10 then net_profit_margin_score is 10

finance_score = (revenueScoreRev × scoring_weights.annual_revenue) +
(3Y_growth_score × scoring_weights.revenue_growth_3y) +
(net_profit_margin_score × scoring_weights.net_profit_margin) +
(investment_capacity_score × scoring_weights.investment_capacity)

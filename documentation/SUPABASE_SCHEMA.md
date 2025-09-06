.# Supabase Database Schema Documentation

## Overview

This document describes the complete database schema for the Scoring Navigator application. The database contains comprehensive company evaluation data across multiple dimensions including profile information, financial metrics, industry analysis, IP assessment, manufacturing capabilities, ownership structure, and hydrogen focus areas.

## Database Tables

### 1. companies_profile

**Purpose**: Core company information and basic details  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (bigint)

| Column                | Type        | Nullable | Description                                       |
| --------------------- | ----------- | -------- | ------------------------------------------------- |
| `id`                  | bigint      | No       | Primary key, auto-increment                       |
| `created_at`          | timestamptz | No       | Record creation timestamp                         |
| `englishName`         | text        | Yes      | Company name in English                           |
| `companyName`         | text        | Yes      | Company name in original language                 |
| `EvaluationDate`      | timestamp   | Yes      | Date of company evaluation                        |
| `basicInformation`    | text        | Yes      | Basic company information                         |
| `missionVisionValues` | text        | Yes      | Company mission, vision, and values               |
| `historyBackground`   | text        | Yes      | Company history and background                    |
| `productServices`     | text        | Yes      | Products and services offered                     |
| `productTags`         | text        | Yes      | Product/service tags/categories                   |
| `marketPosition`      | text        | Yes      | Market positioning information                    |
| `visualElement`       | text        | Yes      | Visual representation elements                    |
| `narrative`           | text        | Yes      | Company narrative/story                           |
| `key`                 | bigint      | Yes      | Unique company identifier (foreign key reference) |

**Foreign Key Relationships**:

- Referenced by: `companies_manufacturing`, `company_financial`, `companies_ownership`, `companies_ip`, `companies_industry`, `companies_hydrogen`

---

### 2. companies_hydrogen

**Purpose**: Hydrogen-focused company evaluation and scoring  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (bigint)

| Column                         | Type        | Nullable | Description                                  |
| ------------------------------ | ----------- | -------- | -------------------------------------------- |
| `id`                           | bigint      | No       | Primary key, auto-increment                  |
| `created_at`                   | timestamptz | No       | Record creation timestamp                    |
| `englishName`                  | text        | Yes      | Company name in English                      |
| `companyName`                  | text        | Yes      | Company name in original language            |
| `EvaluationDate`               | timestamptz | Yes      | Date of hydrogen evaluation                  |
| `H2investScore`                | numeric     | Yes      | Investment focus score                       |
| `H2investJustification`        | text        | Yes      | Investment focus justification               |
| `H2partnersScore`              | numeric     | Yes      | Partnership strategy score                   |
| `H2partnersJustification`      | text        | Yes      | Partnership strategy justification           |
| `H2TechScore`                  | numeric     | Yes      | Technology readiness score                   |
| `H2TechJustification`          | text        | Yes      | Technology readiness justification           |
| `H2CommitScore`                | numeric     | Yes      | Commitment level score                       |
| `H2CommitJustification`        | text        | Yes      | Commitment level justification               |
| `H2ParticipationScore`         | numeric     | Yes      | Market participation score                   |
| `H2ParticipationJustification` | text        | Yes      | Market participation justification           |
| `H2OverallRating`              | text        | Yes      | Overall hydrogen rating                      |
| `H2Summary`                    | text        | Yes      | Hydrogen strategy summary                    |
| `H2investmentFocus`            | text        | Yes      | Investment focus areas                       |
| `H2partnershipStrategy`        | text        | Yes      | Partnership strategy details                 |
| `H2technologyReadiness`        | text        | Yes      | Technology readiness assessment              |
| `H2marketPositioning`          | text        | Yes      | Market positioning in hydrogen               |
| `H2Research`                   | text        | Yes      | Research activities and findings             |
| `key`                          | bigint      | Yes      | Company identifier (FK to companies_profile) |
| `H2Score`                      | numeric     | Yes      | Overall hydrogen score                       |

**Foreign Key Relationships**:

- `key` → `companies_profile.key`

---

### 3. companies_industry

**Purpose**: Industry analysis and business evaluation  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (bigint)

| Column                        | Type        | Nullable | Description                                  |
| ----------------------------- | ----------- | -------- | -------------------------------------------- |
| `id`                          | bigint      | No       | Primary key, auto-increment                  |
| `created_at`                  | timestamptz | No       | Record creation timestamp                    |
| `companyName`                 | text        | Yes      | Company name in original language            |
| `evaluation_date`             | timestamp   | Yes      | Date of industry evaluation                  |
| `core_business_score`         | numeric     | Yes      | Core business model score                    |
| `core_business_justification` | text        | Yes      | Core business justification                  |
| `technology_score`            | numeric     | Yes      | Technology capabilities score                |
| `technology_justification`    | text        | Yes      | Technology justification                     |
| `market_score`                | numeric     | Yes      | Market position score                        |
| `market_justification`        | text        | Yes      | Market position justification                |
| `rationale`                   | text        | Yes      | Overall evaluation rationale                 |
| `opportunities`               | text        | Yes      | Identified opportunities                     |
| `industry_output`             | json        | Yes      | Industry analysis output (JSON)              |
| `englishName`                 | text        | Yes      | Company name in English                      |
| `key`                         | bigint      | Yes      | Company identifier (FK to companies_profile) |
| `industry_score`              | numeric     | Yes      | Overall industry score                       |

**Foreign Key Relationships**:

- `key` → `companies_profile.key`

---

### 4. companies_ip

**Purpose**: Intellectual property assessment and patent analysis  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (bigint)

| Column                           | Type        | Nullable | Description                                  |
| -------------------------------- | ----------- | -------- | -------------------------------------------- |
| `id`                             | bigint      | No       | Primary key, auto-increment                  |
| `created_at`                     | timestamptz | No       | Record creation timestamp                    |
| `englishName`                    | text        | Yes      | Company name in English                      |
| `companyName`                    | text        | Yes      | Company name in original language            |
| `IPRelevantPatentsScore`         | numeric     | Yes      | Relevant patents score                       |
| `IPRelevantPatentsJustification` | text        | Yes      | Relevant patents justification               |
| `IPCeresCitationsScore`          | numeric     | Yes      | CERES citations score                        |
| `IPCeresCitationsJustification`  | text        | Yes      | CERES citations justification                |
| `IPPortfolioGrowthScore`         | numeric     | Yes      | Portfolio growth score                       |
| `IPPortfolioGrowthJustification` | text        | Yes      | Portfolio growth justification               |
| `IPFilingRecencyScore`           | numeric     | Yes      | Filing recency score                         |
| `IPFilingRecencyJustification`   | text        | Yes      | Filing recency justification                 |
| `IPOverallRating`                | text        | Yes      | Overall IP rating                            |
| `IPStrategySummary`              | text        | Yes      | IP strategy summary                          |
| `IPResearch`                     | json        | Yes      | IP research data (JSON)                      |
| `IPActivityScore`                | numeric     | Yes      | IP activity score                            |
| `key`                            | bigint      | Yes      | Company identifier (FK to companies_profile) |
| `evaluationDate`                 | timestamp   | Yes      | Date of IP evaluation                        |

**Foreign Key Relationships**:

- `key` → `companies_profile.key`

---

### 5. companies_manufacturing

**Purpose**: Manufacturing capabilities and supply chain evaluation  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (bigint)

| Column                                  | Type      | Nullable | Description                                  |
| --------------------------------------- | --------- | -------- | -------------------------------------------- |
| `id`                                    | bigint    | No       | Primary key, auto-increment                  |
| `englishName`                           | text      | Yes      | Company name in English                      |
| `companyName`                           | text      | Yes      | Company name in original language            |
| `EvaluationDate`                        | timestamp | Yes      | Date of manufacturing evaluation             |
| `ManufacturingMaterialsScore`           | numeric   | Yes      | Materials handling score                     |
| `ManufacturingMaterialsJustification`   | text      | Yes      | Materials justification                      |
| `ManufacturingScaleScore`               | numeric   | Yes      | Manufacturing scale score                    |
| `ManufacturingScaleJustification`       | text      | Yes      | Scale justification                          |
| `ManufacturingQualityScore`             | numeric   | Yes      | Quality management score                     |
| `ManufacturingQualityJustification`     | text      | Yes      | Quality justification                        |
| `ManufacturingSupplyChainScore`         | numeric   | Yes      | Supply chain score                           |
| `ManufacturingSupplyChainJustification` | text      | Yes      | Supply chain justification                   |
| `ManufacturingRDScore`                  | numeric   | Yes      | R&D capabilities score                       |
| `ManufacturingRDJustification`          | text      | Yes      | R&D justification                            |
| `ManufacturingOverallRating`            | text      | Yes      | Overall manufacturing rating                 |
| `ManufacturingSummary`                  | text      | Yes      | Manufacturing summary                        |
| `ManufacturingResearch`                 | text      | Yes      | Manufacturing research data                  |
| `key`                                   | bigint    | Yes      | Company identifier (FK to companies_profile) |
| `manufacturing_score`                   | numeric   | Yes      | Overall manufacturing score                  |

**Foreign Key Relationships**:

- `key` → `companies_profile.key`

---

### 6. companies_ownership

**Purpose**: Ownership structure and decision-making analysis  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (bigint)

| Column                                 | Type        | Nullable | Description                                  |
| -------------------------------------- | ----------- | -------- | -------------------------------------------- |
| `id`                                   | bigint      | No       | Primary key, auto-increment                  |
| `englishName`                          | text        | Yes      | Company name in English                      |
| `companyName`                          | text        | Yes      | Company name in original language            |
| `EvaluationDate`                       | timestamptz | Yes      | Date of ownership evaluation                 |
| `OwnershipTypeScore`                   | numeric     | Yes      | Ownership type score                         |
| `OwnershipTypeJustification`           | text        | Yes      | Ownership type justification                 |
| `OwnershipDecisionMakingScore`         | numeric     | Yes      | Decision-making score                        |
| `OwnershipDecisionMakingJustification` | text        | Yes      | Decision-making justification                |
| `OwnershipAlignmentScore`              | numeric     | Yes      | Strategic alignment score                    |
| `OwnershipAlignmentJustification`      | text        | Yes      | Alignment justification                      |
| `OwnershipPartnershipsScore`           | numeric     | Yes      | Partnership capabilities score               |
| `OwnershipPartnershipsJustification`   | text        | Yes      | Partnerships justification                   |
| `OwnershipOverallRating`               | text        | Yes      | Overall ownership rating                     |
| `OwnershipSummary`                     | text        | Yes      | Ownership summary                            |
| `OwnershipResearch`                    | text        | Yes      | Ownership research data                      |
| `key`                                  | bigint      | Yes      | Company identifier (FK to companies_profile) |
| `OwnershipScore`                       | numeric     | Yes      | Overall ownership score                      |

**Foreign Key Relationships**:

- `key` → `companies_profile.key`

---

### 7. company_financial

**Purpose**: Financial performance and investment readiness  
**Record Count**: 488  
**Primary Key**: `id` (bigint, auto-increment)  
**Unique Constraint**: `key` (integer)

| Column                        | Type        | Nullable | Description                                  |
| ----------------------------- | ----------- | -------- | -------------------------------------------- |
| `id`                          | bigint      | No       | Primary key, auto-increment                  |
| `created_at`                  | timestamptz | No       | Record creation timestamp                    |
| `companyName`                 | text        | Yes      | Company name in original language            |
| `englishName`                 | text        | Yes      | Company name in English                      |
| `annual_revenue`              | numeric     | Yes      | Annual revenue amount                        |
| `revenue_score`               | numeric     | Yes      | Revenue performance score                    |
| `revenue_justification`       | text        | Yes      | Revenue score justification                  |
| `3Y_score`                    | numeric     | Yes      | 3-year performance score                     |
| `3Y_justification`            | text        | Yes      | 3-year performance justification             |
| `netProfitScore`              | numeric     | Yes      | Net profit score                             |
| `netProfitJustification`      | text        | Yes      | Net profit justification                     |
| `investCapacityScore`         | numeric     | Yes      | Investment capacity score                    |
| `investCapacityJustification` | text        | Yes      | Investment capacity justification            |
| `overallRating`               | text        | Yes      | Overall financial rating                     |
| `financialSummary`            | text        | Yes      | Financial performance summary                |
| `revenueTrend`                | text        | Yes      | Revenue trend analysis                       |
| `profitabilityAssessment`     | text        | Yes      | Profitability assessment                     |
| `investmentReadiness`         | text        | Yes      | Investment readiness evaluation              |
| `financialReserach`           | jsonb       | Yes      | Financial research data (JSONB)              |
| `evaluation_date`             | timestamp   | Yes      | Date of financial evaluation                 |
| `finance_score`               | numeric     | Yes      | Overall finance score                        |
| `key`                         | integer     | Yes      | Company identifier (FK to companies_profile) |

**Foreign Key Relationships**:

- `key` → `companies_profile.key`

---

## Document Tables

### 8. profile_documents

**Purpose**: Company profile-related documents for AI analysis  
**Record Count**: 614  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

### 9. manufacturing_documents

**Purpose**: Manufacturing-related documents for AI analysis  
**Record Count**: 190  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

### 10. hydrogen_documents

**Purpose**: Hydrogen-related documents for AI analysis  
**Record Count**: 190  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

### 11. industry_documents

**Purpose**: Industry-related documents for AI analysis  
**Record Count**: 188  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

### 12. ip_documents

**Purpose**: IP-related documents for AI analysis  
**Record Count**: 190  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

### 13. ownership_documents

**Purpose**: Ownership-related documents for AI analysis  
**Record Count**: 190  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

### 14. financial_documents

**Purpose**: Financial-related documents for AI analysis  
**Record Count**: 190  
**Primary Key**: `id` (bigint, auto-increment)

| Column       | Type        | Nullable | Description                    |
| ------------ | ----------- | -------- | ------------------------------ |
| `id`         | bigint      | No       | Primary key, auto-increment    |
| `content`    | text        | No       | Document content text          |
| `metadata`   | jsonb       | Yes      | Document metadata (JSONB)      |
| `embedding`  | vector      | Yes      | AI embedding vector            |
| `created_at` | timestamptz | No       | Document creation timestamp    |
| `updated_at` | timestamptz | No       | Document last update timestamp |

---

## SEC Data Tables

### 15. sec_companies

**Purpose**: SEC filing company information  
**Record Count**: 6  
**Primary Key**: `id` (uuid)

| Column            | Type        | Nullable | Description                             |
| ----------------- | ----------- | -------- | --------------------------------------- |
| `id`              | uuid        | No       | Primary key, auto-generated             |
| `cik`             | varchar     | No       | Central Index Key (unique)              |
| `ticker`          | varchar     | Yes      | Stock ticker symbol                     |
| `company_name`    | varchar     | No       | Company name                            |
| `sic_code`        | varchar     | Yes      | Standard Industrial Classification code |
| `sic_description` | text        | Yes      | SIC code description                    |
| `industry`        | varchar     | Yes      | Industry classification                 |
| `sector`          | varchar     | Yes      | Sector classification                   |
| `created_at`      | timestamptz | No       | Record creation timestamp               |
| `updated_at`      | timestamptz | No       | Record last update timestamp            |

### 16. sec_financial_metrics

**Purpose**: Raw financial data from SEC filings  
**Record Count**: 2,240  
**Primary Key**: `id` (uuid)

| Column             | Type        | Nullable | Description                             |
| ------------------ | ----------- | -------- | --------------------------------------- |
| `id`               | uuid        | No       | Primary key, auto-generated             |
| `company_id`       | uuid        | No       | Company reference (FK to sec_companies) |
| `metric_name`      | varchar     | No       | Financial metric name                   |
| `metric_value`     | numeric     | Yes      | Metric value                            |
| `unit`             | varchar     | No       | Value unit (default: USD)               |
| `period_end_date`  | date        | No       | Period end date                         |
| `filing_date`      | date        | No       | SEC filing date                         |
| `form_type`        | varchar     | No       | SEC form type                           |
| `accession_number` | varchar     | Yes      | SEC accession number                    |
| `fiscal_year`      | integer     | Yes      | Fiscal year                             |
| `fiscal_period`    | varchar     | Yes      | Fiscal period                           |
| `source_url`       | text        | Yes      | Source URL                              |
| `created_at`       | timestamptz | No       | Record creation timestamp               |

### 17. sec_filing_metadata

**Purpose**: SEC filing metadata and document information  
**Record Count**: 5,161  
**Primary Key**: `id` (uuid)

| Column             | Type        | Nullable | Description                             |
| ------------------ | ----------- | -------- | --------------------------------------- |
| `id`               | uuid        | No       | Primary key, auto-generated             |
| `company_id`       | uuid        | No       | Company reference (FK to sec_companies) |
| `accession_number` | varchar     | No       | SEC accession number (unique)           |
| `form_type`        | varchar     | No       | SEC form type                           |
| `filing_date`      | date        | No       | Filing date                             |
| `report_date`      | date        | Yes      | Report date                             |
| `primary_document` | varchar     | Yes      | Primary document identifier             |
| `file_size`        | bigint      | Yes      | File size in bytes                      |
| `source_url`       | text        | Yes      | Source URL                              |
| `created_at`       | timestamptz | No       | Record creation timestamp               |

### 18. sec_derived_metrics

**Purpose**: Calculated financial ratios and derived values  
**Record Count**: 147  
**Primary Key**: `id` (uuid)

| Column               | Type        | Nullable | Description                             |
| -------------------- | ----------- | -------- | --------------------------------------- |
| `id`                 | uuid        | No       | Primary key, auto-generated             |
| `company_id`         | uuid        | No       | Company reference (FK to sec_companies) |
| `metric_name`        | varchar     | No       | Derived metric name                     |
| `metric_value`       | numeric     | Yes      | Calculated metric value                 |
| `period_end_date`    | date        | No       | Period end date                         |
| `fiscal_year`        | integer     | Yes      | Fiscal year                             |
| `fiscal_period`      | varchar     | Yes      | Fiscal period                           |
| `calculation_method` | text        | Yes      | Calculation methodology                 |
| `source_metrics`     | text[]      | Yes      | Array of source metrics used            |
| `created_at`         | timestamptz | No       | Record creation timestamp               |

### 19. sec_industry_classifications

**Purpose**: Industry and sector classifications based on SIC codes  
**Record Count**: 1,006  
**Primary Key**: `id` (uuid)

| Column            | Type        | Nullable | Description                 |
| ----------------- | ----------- | -------- | --------------------------- |
| `id`              | uuid        | No       | Primary key, auto-generated |
| `sic_code`        | varchar     | No       | SIC code (unique)           |
| `sic_description` | text        | Yes      | SIC code description        |
| `industry`        | varchar     | Yes      | Industry classification     |
| `sector`          | varchar     | Yes      | Sector classification       |
| `subsector`       | varchar     | Yes      | Subsector classification    |
| `created_at`      | timestamptz | No       | Record creation timestamp   |

### 20. sec_ingestion_logs

**Purpose**: Data ingestion process monitoring and debugging  
**Record Count**: 23  
**Primary Key**: `id` (uuid)

| Column                    | Type        | Nullable | Description                  |
| ------------------------- | ----------- | -------- | ---------------------------- |
| `id`                      | uuid        | No       | Primary key, auto-generated  |
| `process_name`            | varchar     | No       | Ingestion process name       |
| `status`                  | varchar     | No       | Process status               |
| `records_processed`       | integer     | No       | Number of records processed  |
| `records_created`         | integer     | No       | Number of records created    |
| `records_updated`         | integer     | No       | Number of records updated    |
| `errors`                  | text[]      | Yes      | Array of error messages      |
| `started_at`              | timestamptz | No       | Process start timestamp      |
| `completed_at`            | timestamptz | Yes      | Process completion timestamp |
| `processing_time_seconds` | numeric     | Yes      | Total processing time        |

---

## N8N Integration Tables

### 21. n8n_chat_histories

**Purpose**: Chat conversation history for N8N workflows  
**Record Count**: 10,218  
**Primary Key**: `id` (integer, auto-increment)

| Column       | Type    | Nullable | Description                  |
| ------------ | ------- | -------- | ---------------------------- |
| `id`         | integer | No       | Primary key, auto-increment  |
| `session_id` | varchar | No       | Chat session identifier      |
| `message`    | jsonb   | No       | Chat message content (JSONB) |

### 22. n8n_company_enrichement_histories

**Purpose**: Company enrichment process history for N8N workflows  
**Record Count**: 34  
**Primary Key**: `id` (integer, auto-increment)

| Column       | Type    | Nullable | Description                        |
| ------------ | ------- | -------- | ---------------------------------- |
| `id`         | integer | No       | Primary key, auto-increment        |
| `session_id` | varchar | No       | Enrichment session identifier      |
| `message`    | jsonb   | No       | Enrichment message content (JSONB) |

---

## Database Relationships

### Primary Company Data Flow

```
companies_profile (key)
    ↓
├── companies_hydrogen (key)
├── companies_industry (key)
├── companies_ip (key)
├── companies_manufacturing (key)
├── companies_ownership (key)
└── company_financial (key)
```

### Document Analysis Flow

```
profile_documents
manufacturing_documents
hydrogen_documents
industry_documents
ip_documents
ownership_documents
financial_documents
    ↓
AI Embedding Vectors
    ↓
Semantic Search & Analysis
```

### SEC Data Integration

```
sec_companies (id)
    ↓
├── sec_financial_metrics (company_id)
├── sec_filing_metadata (company_id)
└── sec_derived_metrics (company_id)
```

---

## Data Types Summary

### Numeric Scoring

- **Score ranges**: Typically 0-100 or similar scales
- **Data type**: `numeric` for precise decimal values
- **Usage**: Evaluation scores across all company dimensions

### Text Content

- **Justifications**: Detailed explanations for scores
- **Summaries**: High-level assessments and conclusions
- **Research data**: Raw analysis and findings

### JSON/JSONB Data

- **Industry output**: Structured industry analysis results
- **IP research**: Patent and IP analysis data
- **Financial research**: Financial analysis and metrics
- **Document metadata**: Document processing information

### Timestamps

- **Evaluation dates**: When assessments were performed
- **Creation dates**: Record creation timestamps
- **Update dates**: Last modification timestamps

---

## Security & Access Control

### Row Level Security (RLS)

- **Enabled**: All company tables have RLS enabled
- **Purpose**: Secure access control for company data
- **Implementation**: User-based access restrictions

### Foreign Key Constraints

- **Referential integrity**: All company tables reference `companies_profile.key`
- **Cascade behavior**: Proper deletion and update handling
- **Data consistency**: Ensures data integrity across tables

---

## Performance Considerations

### Indexing

- **Primary keys**: Auto-indexed for fast lookups
- **Foreign keys**: Indexed for join performance
- **Unique constraints**: Additional performance optimization

### Vector Operations

- **AI embeddings**: Optimized for similarity searches
- **Document analysis**: Fast semantic search capabilities
- **Scaling**: Designed for large document collections

---

## Maintenance & Monitoring

### Data Consistency

- **Record counts**: All company tables maintain 488 records
- **Key synchronization**: Foreign key relationships ensure consistency
- **Validation**: Regular checks for orphaned or missing records

### Ingestion Monitoring

- **Process logs**: Track data import and update processes
- **Error handling**: Comprehensive error logging and reporting
- **Performance metrics**: Monitor processing times and volumes

---

_Last Updated: December 2024_  
_Database Version: PostgreSQL 17.4.1.45_  
_Total Tables: 22_  
_Total Records: ~25,000+_

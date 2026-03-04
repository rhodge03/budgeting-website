# Household Financial Planner
### Product Requirements Document
**Version 1.0**

---

## Overview

A responsive web application for household budgeting, savings tracking, and retirement projection. The app supports multiple income earners within a single household, with shared expense tracking and per-earner income and retirement settings. Data is persisted to the cloud and accessible via login from any device.

---

## 1. Authentication & Household

| ID | Requirement | Notes |
|----|-------------|-------|
| AUTH-01 | Users can create an account with email and password. | |
| AUTH-02 | Users can log in and log out of their household account. | |
| AUTH-03 | A household supports multiple earner profiles under one login. | |
| AUTH-04 | All data is auto-saved to the cloud as the user types. | No manual save needed |
| AUTH-05 | Data persists across sessions and devices. | Fully cloud-backed |

---

## 2. Navigation

| ID | Requirement | Notes |
|----|-------------|-------|
| NAV-01 | The app uses a persistent tab bar visible on every page. | Always one click away |
| NAV-02 | Three primary tabs: **Income & Retirement**, **Budgeting**, **Projections**. | |
| NAV-03 | Active tab is clearly highlighted. Switching tabs is instant. | |
| NAV-04 | Layout is fully responsive across desktop, tablet, and mobile. | All devices equally |

---

## 3. Earner Management

| ID | Requirement | Notes |
|----|-------------|-------|
| EARN-01 | Household can have multiple named earner profiles (e.g., Person 1, Person 2). | |
| EARN-02 | Each earner has independent: income fields, 401(k) settings, savings balances, and retirement settings. | |
| EARN-03 | Expenses and household-level projections are shared across all earners. | |
| EARN-04 | When removing an earner, user is offered both options: permanent delete (with confirmation prompt) or archive/hide. | |
| EARN-05 | Archived earners can be restored. Deleted earner data is permanently removed. | |

---

## 4. Income Fields *(Per Earner)*

### Taxable Income

| ID | Requirement | Notes |
|----|-------------|-------|
| INC-01 | Multiple taxable income entry fields per earner (for multiple jobs or revenue streams). | |
| INC-02 | Each taxable income field has a label (e.g., Job 1, Side Business) and a dollar amount. | |

### Non-Taxable Income

| ID | Requirement | Notes |
|----|-------------|-------|
| INC-03 | Multiple non-taxable income entry fields per earner. | |
| INC-04 | Each non-taxable income field has a label and a dollar amount. | |

### 401(k) Settings

| ID | Requirement | Notes |
|----|-------------|-------|
| INC-05 | User sets their 401(k) contribution percentage per earner. | |
| INC-06 | User sets their employer match percentage per earner. | |
| INC-07 | App calculates and displays the dollar value of employer match based on salary and percentages. | |

### Salary Growth

| ID | Requirement | Notes |
|----|-------------|-------|
| INC-08 | Salary is assumed flat by default in projections. | |
| INC-09 | Optional: user can input an annual raise percentage per earner to model salary growth over time. | |

---

## 5. Savings & Account Balances *(Per Earner)*

| ID | Requirement | Notes |
|----|-------------|-------|
| SAV-01 | User enters current general savings balance as a starting value. | |
| SAV-02 | User enters current 401(k) balance as a starting value. | |
| SAV-03 | General savings and 401(k) are tracked and projected as separate values throughout the app. | |

---

## 6. Retirement Settings *(Per Earner)*

| ID | Requirement | Notes |
|----|-------------|-------|
| RET-01 | User sets a target retirement age per earner. | |
| RET-02 | Years until retirement is shown as both a draggable slider and a numeric input field. Both stay in sync. | |
| RET-03 | User sets a 401(k) withdrawal age separately from retirement age. | Accounts for penalty rules |
| RET-04 | When multiple earners exist, user can select whose retirement date drives the household projection. | |
| RET-05 | User can set a retirement savings goal (target dollar amount). | |
| RET-06 | The app shows current progress toward the retirement savings goal as a percentage and visual indicator. | |

---

## 7. Social Security

| ID | Requirement | Notes |
|----|-------------|-------|
| SS-01 | The app auto-estimates Social Security benefit per earner based on income history entered in the app. | |
| SS-02 | Estimated Social Security benefit is factored into retirement projections. | |
| SS-03 | The estimate and its assumptions are displayed transparently to the user. | |

---

## 8. Rate of Return

| ID | Requirement | Notes |
|----|-------------|-------|
| ROR-01 | User can manually enter any annual rate of return percentage. | |
| ROR-02 | Three clickable benchmark buttons are shown: S&P 500, Dow Jones, Gold. | |
| ROR-03 | Clicking a benchmark fills the rate of return field with its historical average. | User can still override |
| ROR-04 | S&P 500 rate is auto-populated as the default if the field has no value already set. | |
| ROR-05 | Benchmark rates are dynamically matched to the earner's years until retirement (e.g., 30-year average if retiring in 30 years). | |

---

## 9. Tax Calculation

| ID | Requirement | Notes |
|----|-------------|-------|
| TAX-01 | Tax calculation uses full marginal bracket calculation (not just an effective rate). | |
| TAX-02 | User can choose between standard deduction or itemized deductions. | |
| TAX-03 | Federal tax brackets are applied per earner based on their total taxable income. | |
| TAX-04 | User selects their state; state-specific income tax rates are applied. | |
| TAX-05 | Tax estimate is displayed per earner and reflected in net take-home calculations. | |
| TAX-06 | Only taxable income sources are included in tax calculations. | Non-taxable income excluded |

---

## 10. Expense Budgeting *(Shared / Household-Level)*

### Structure

| ID | Requirement | Notes |
|----|-------------|-------|
| BUD-01 | Expenses are organized in a two-tier hierarchy: top-level category (e.g., Housing) and sub-category (e.g., Homeowner's Insurance). | |
| BUD-02 | Categories and sub-categories are pre-populated with common household expenses. | |
| BUD-03 | Users can add custom categories and sub-categories. | |
| BUD-04 | Users can rename existing categories and sub-categories. | |
| BUD-05 | Each top-level category is collapsible and expandable. | |

### Entry & Display

| ID | Requirement | Notes |
|----|-------------|-------|
| BUD-06 | User types a dollar amount for each sub-category expense. | |
| BUD-07 | Expenses can be toggled between monthly and annual entry. Both views stay in sync. | |
| BUD-08 | The top of the Budgeting tab shows a summary panel with total monthly and annual spend. | |
| BUD-09 | Below the summary, a breakdown by top-level category shows totals per category. | |

---

## 11. Projections & Output

### Chart

| ID | Requirement | Notes |
|----|-------------|-------|
| PROJ-01 | Projection chart shows three lines: (1) 401(k) only, (2) general savings only, (3) combined total. | |
| PROJ-02 | Chart shows both inflation-adjusted and nominal (raw) projections simultaneously. | |
| PROJ-03 | A retirement goal target line is displayed on the chart if a goal has been set. | |
| PROJ-04 | Household-level view combines all earners. Per-earner breakdown is also available. | |

### Inputs Driving Projections

| ID | Requirement | Notes |
|----|-------------|-------|
| PROJ-05 | Projections are driven by: salary, 401(k) contributions, employer match, rate of return, years until retirement, salary growth rate, and Social Security estimates. | |
| PROJ-06 | Projections update dynamically as the user changes any input. | |

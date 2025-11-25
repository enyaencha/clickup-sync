# Logframe Integration Guide
## How Indicators, Activities, Beneficiaries & Process Connect

## 1. COMPLETE WORKFLOW EXAMPLE

### Scenario: Agricultural Training Program

```
LEVEL 1: PROGRAM MODULE (IMPACT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Module: Food Security Enhancement Program
Goal: "Improved food security for 10,000 households in Nairobi"

Impact Indicator:
  - Name: "Percentage of food-secure households"
  - Baseline: 45% (measured Jan 2024)
  - Target: 75% (by Dec 2025)
  - Current: 52% (as of Oct 2024)
  - Achievement: 30% towards target

Assumptions:
  - Political stability maintained
  - No major climate disasters
  - Market prices remain stable

Means of Verification:
  - Annual household food security surveys
  - Market price monitoring reports
  - Government statistics


LEVEL 2: SUB-PROGRAM (OUTCOME)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sub-Program: Sustainable Agriculture Initiative
Outcome: "Increased agricultural productivity among smallholder farmers"

Outcome Indicator:
  - Name: "Average crop yield per hectare"
  - Baseline: 2.5 tons/ha
  - Target: 4.5 tons/ha
  - Current: 3.2 tons/ha
  - Achievement: 35%

Assumptions:
  - Adequate and timely rainfall
  - Access to agricultural inputs
  - Farmers adopt new techniques

Means of Verification:
  - Farmer harvest records
  - Field surveys
  - Agricultural extension reports


LEVEL 3: PROJECT COMPONENT (OUTPUT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component: Farmer Training & Capacity Building
Output: "500 farmers trained in climate-smart agriculture"

Output Indicator:
  - Name: "Number of farmers completing training"
  - Baseline: 0
  - Target: 500 farmers
  - Current: 320 farmers
  - Achievement: 64%

Assumptions:
  - Farmers available during training periods
  - Transportation accessible
  - Training materials available

Means of Verification:
  - Training attendance sheets
  - Training completion certificates
  - Photos from training sessions
  - Pre/post-test results


LEVEL 4: ACTIVITIES (PROCESS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Activity: "Conduct 3-day Climate-Smart Agriculture Workshop"
Date: Oct 15-17, 2024
Location: Kibera Community Center

Process Indicator:
  - Name: "Number of training workshops conducted"
  - Target: 15 workshops
  - Current: 8 workshops
  - Achievement: 53%

Beneficiaries (linked to Activity):
  - Direct: 35 farmers (25 women, 10 men)
  - Names: John Kamau, Mary Wanjiku, Peter Omondi, etc.
  - Ages: 18-65 years
  - Location: Kibera, Kawangware areas

Activity Checklist (Process Monitoring):
  ✅ Secure training venue (Completed)
  ✅ Prepare training materials (Completed)
  ✅ Send invitations to farmers (Completed)
  ✅ Arrange transportation (Completed)
  ⬜ Conduct Day 1 training (In Progress)
  ⬜ Conduct Day 2 training (Pending)
  ⬜ Conduct Day 3 training (Pending)
  ⬜ Distribute certificates (Pending)
  ⬜ Collect feedback forms (Pending)

Activity Status: In Progress
Approval Status: Approved by Program Manager
```

## 2. DATA LINKAGES & RELATIONSHIPS

### How Data Flows Through the System:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACTIVITY EXECUTION                            │
├─────────────────────────────────────────────────────────────────┤
│ 1. Create Activity in System                                    │
│    - Name: "Climate-Smart Agriculture Workshop"                 │
│    - Component: "Farmer Training"                                │
│    - Dates, Location, Budget                                     │
│                                                                  │
│ 2. Register Beneficiaries                                        │
│    - Add 35 farmers to activity                                  │
│    - Record demographics (age, gender, location)                 │
│    - Track attendance                                            │
│                                                                  │
│ 3. Monitor Process (Checklist)                                   │
│    - Mark tasks as complete                                      │
│    - Track progress percentage                                   │
│                                                                  │
│ 4. Record Process Indicator                                      │
│    - Workshop conducted ✅                                        │
│    - Update count: 8 workshops done                              │
│                                                                  │
│ 5. Submit for Approval                                           │
│    - Approver reviews checklist                                  │
│    - Verifies beneficiary data                                   │
│    - Approves/rejects activity                                   │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│               OUTPUT INDICATOR MEASUREMENT                       │
├─────────────────────────────────────────────────────────────────┤
│ Component Level: "Farmer Training"                              │
│                                                                  │
│ After Workshop Completion:                                       │
│ - Record measurement: +35 farmers trained                        │
│ - Update indicator current value: 320 → 355                      │
│ - System auto-calculates achievement: 71%                        │
│ - Add means of verification:                                     │
│   • Attendance sheet (document)                                  │
│   • Training photos (photo)                                      │
│   • Certificates issued (document)                               │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│              OUTCOME INDICATOR MEASUREMENT                       │
├─────────────────────────────────────────────────────────────────┤
│ Sub-Program Level: "Sustainable Agriculture"                    │
│                                                                  │
│ After Harvest Season (3 months later):                           │
│ - Survey trained farmers                                         │
│ - Measure crop yields                                            │
│ - Record average: 3.8 tons/ha                                    │
│ - Update indicator: Achievement 65%                              │
│ - Add verification: Field survey reports                         │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│               IMPACT INDICATOR MEASUREMENT                       │
├─────────────────────────────────────────────────────────────────┤
│ Program Level: "Food Security Enhancement"                      │
│                                                                  │
│ Annual Assessment (Dec 2024):                                    │
│ - Conduct household surveys                                      │
│ - Measure food security status                                   │
│ - Record: 58% households food secure                             │
│ - Update indicator: Achievement 45%                              │
│ - Add verification: Survey data, reports                         │
└─────────────────────────────────────────────────────────────────┘
```

## 3. PRACTICAL STEP-BY-STEP GUIDE

### STEP 1: Set Up Logframe Structure (ONE TIME)

#### A. Create Impact Indicators (Module Level)
```
Navigate to: /logframe/indicators
Select: Program Module
Click: "+ Add Indicator"

Fill in:
  Type: Impact
  Name: "Percentage of food-secure households"
  Code: IND-IMP-001
  Baseline: 45% (measured Jan 2024)
  Target: 75% (by Dec 2025)
  Unit: Percentage (%)
  Collection Frequency: Annually
  Responsible: M&E Officer
```

#### B. Create Outcome Indicators (Sub-Program Level)
```
Navigate to: /logframe/indicators/sub_program/[ID]
Click: "+ Add Indicator"

Fill in:
  Type: Outcome
  Name: "Average crop yield per hectare"
  Code: IND-OUT-001
  Baseline: 2.5 tons/ha
  Target: 4.5 tons/ha
  Unit: Tons per hectare
  Collection Frequency: Annually (after harvest)
```

#### C. Create Output Indicators (Component Level)
```
Navigate to: /logframe/indicators/component/[ID]
Click: "+ Add Indicator"

Fill in:
  Type: Output
  Name: "Number of farmers completing training"
  Code: IND-OPT-001
  Baseline: 0
  Target: 500
  Unit: Farmers
  Collection Frequency: Monthly
```

#### D. Create Process Indicators (Activity Level)
```
Navigate to: /logframe/indicators/activity/[ID]
Click: "+ Add Indicator"

Fill in:
  Type: Process
  Name: "Number of training workshops conducted"
  Code: IND-PRO-001
  Target: 15
  Unit: Workshops
  Collection Frequency: Weekly
```

#### E. Document Assumptions
```
Navigate to: /logframe/assumptions
Click: "+ Add Assumption"

For Module:
  Text: "Political stability maintained throughout program"
  Category: Political
  Likelihood: Medium
  Impact: High
  Risk Level: Medium (auto-calculated)
  Mitigation: "Monitor political situation, have contingency plans"

For Component:
  Text: "Farmers available during training periods"
  Category: Social
  Likelihood: High
  Impact: Medium
  Risk Level: Medium
  Mitigation: "Schedule trainings during off-peak farming season"
```

### STEP 2: Execute Activities (ONGOING)

#### A. Plan Activity
```
Navigate to: /program/[ID]/project/[ID]/component/[ID]
Click: "+ Add Activity"

Fill in:
  Name: "Climate-Smart Agriculture Workshop"
  Description: "3-day hands-on training"
  Start Date: Oct 15, 2024
  End Date: Oct 17, 2024
  Location: Kibera Community Center
  Budget: 50,000 KES
  Assigned To: John Doe
```

#### B. Register Beneficiaries
```
In Activity Details:
Click: "Manage Beneficiaries"
Click: "+ Add Beneficiary"

For each farmer:
  Name: Mary Wanjiku
  Age: 35
  Gender: Female
  Location: Kibera
  Phone: +254 712 345 678
  Group: Training Cohort 1
```

#### C. Create Activity Checklist
```
In Activity Details:
Click: "Edit" → Enable Checklist
Add Items:
  - Secure training venue
  - Prepare training materials
  - Send invitations to farmers
  - Arrange transportation
  - Conduct Day 1 training
  - Conduct Day 2 training
  - Conduct Day 3 training
  - Distribute certificates
  - Collect feedback forms
```

#### D. Monitor Progress
```
During Implementation:
- Check off completed items
- Progress updates automatically: 3/9 = 33%
- Status changes based on progress
```

#### E. Submit for Approval
```
After Activity Completion:
Click: "Submit for Approval"
Approver receives notification
Approver can:
  - View activity details
  - See beneficiary list
  - Check checklist completion
  - Approve/Reject
```

### STEP 3: Record Measurements (AFTER COMPLETION)

#### A. Update Process Indicator
```
Navigate to: /logframe/indicators/activity/[ID]
Find: "Number of workshops conducted"
Click: "Add Measurement"

Fill in:
  Reporting Period: Oct 15-17, 2024
  Value: 1 (workshop completed)
  Collection Date: Oct 17, 2024
  Data Collector: John Doe
  Notes: "35 farmers attended, all received certificates"

System automatically:
  - Updates current value: 8 → 9
  - Recalculates achievement: 60%
  - Updates status: "on-track"
```

#### B. Update Output Indicator
```
Navigate to: /logframe/indicators/component/[ID]
Find: "Number of farmers completing training"
Click: "Add Measurement"

Fill in:
  Reporting Period: Oct 2024
  Value: 35 (new farmers trained)
  Disaggregation:
    - Female: 25
    - Male: 10
    - Age 18-35: 15
    - Age 36-50: 12
    - Age 51+: 8
```

#### C. Add Means of Verification
```
Navigate to: /logframe/verification
Click: "+ Add Verification"

Select: Component - "Farmer Training"

Document 1:
  Method: "Training attendance sheets"
  Evidence Type: Document
  Document Name: "Training_Attendance_Oct2024.pdf"
  Path: Upload file or enter URL
  Status: Verified

Document 2:
  Method: "Training photos"
  Evidence Type: Photo
  Document Name: "Training_Photos_Oct2024.zip"
  Status: Verified
```

## 4. REPORTING & MONITORING

### View Progress Dashboard
```
Navigate to: /logframe

You'll see:

┌─────────────────────────────────────────┐
│     INDICATORS OVERVIEW                 │
├─────────────────────────────────────────┤
│ Total: 45                               │
│ On Track: 28 (62%)                      │
│ At Risk: 12 (27%)                       │
│ Off Track: 5 (11%)                      │
│ Avg Achievement: 58%                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│     RISK MANAGEMENT                     │
├─────────────────────────────────────────┤
│ Total Assumptions: 23                   │
│ Critical Risk: 2                        │
│ High Risk: 5                            │
│ Valid: 18                               │
│ Needs Review: 3                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│     VERIFICATION STATUS                 │
├─────────────────────────────────────────┤
│ Total Evidence: 156                     │
│ Verified: 89 (57%)                      │
│ Pending: 52 (33%)                       │
│ Rejected: 15 (10%)                      │
└─────────────────────────────────────────┘
```

## 5. API ENDPOINTS FOR INTEGRATION

If you need to automate or integrate:

```javascript
// Create indicator
POST /api/indicators
{
  "name": "Number of farmers trained",
  "type": "output",
  "component_id": 123,
  "baseline_value": 0,
  "target_value": 500,
  "unit_of_measure": "farmers"
}

// Add measurement
POST /api/indicators/45/measurements
{
  "reporting_period_start": "2024-10-01",
  "reporting_period_end": "2024-10-31",
  "value": 35,
  "disaggregation": {
    "female": 25,
    "male": 10
  }
}

// Get statistics
GET /api/indicators/statistics/module/1

// Create assumption
POST /api/assumptions
{
  "entity_type": "component",
  "entity_id": 123,
  "assumption_text": "Farmers available for training",
  "likelihood": "high",
  "impact": "medium"
}
```

## 6. BEST PRACTICES

1. **Set up logframe BEFORE activities start**
   - Define all indicators upfront
   - Document assumptions early
   - Plan verification methods

2. **Regular measurement**
   - Process indicators: Weekly/Monthly
   - Output indicators: Monthly/Quarterly
   - Outcome indicators: Annually
   - Impact indicators: Annually/End of project

3. **Keep evidence**
   - Always upload supporting documents
   - Take photos during activities
   - Keep beneficiary sign-in sheets
   - Store survey data

4. **Review assumptions regularly**
   - Monthly risk review meetings
   - Update mitigation strategies
   - Mark assumptions as valid/invalid

5. **Link everything**
   - Every activity should contribute to an output
   - Every output should contribute to an outcome
   - Every outcome should contribute to impact

## 7. TROUBLESHOOTING

**Q: How do I know which indicator to use for an activity?**
A: Match indicator level to hierarchy level:
   - Activity → Process indicator
   - Component → Output indicator
   - Sub-Program → Outcome indicator
   - Module → Impact indicator

**Q: When should I update indicators?**
A:
   - Process: After each activity
   - Output: After activities complete
   - Outcome: After outputs are delivered (3-6 months)
   - Impact: Annually or at project end

**Q: How do beneficiaries connect to indicators?**
A:
   - Register beneficiaries at activity level
   - Activity contributes to process indicator
   - Aggregated in output indicator
   - E.g., 35 beneficiaries → +35 to "farmers trained" indicator

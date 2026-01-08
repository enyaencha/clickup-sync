# Budget Request Workflow - UI Integration Guide

This guide shows how to integrate the new budget request workflow UI components into your existing application.

## 📦 Available Components

### 1. **BudgetRequestForm** - Request Budget for Activities
### 2. **FinanceBudgetReview** - Finance Dashboard for Reviews
### 3. **ActivityBudgetWidget** - Display Budget Status
### 4. **LocationSelector** - Hierarchical Location Picker

---

## 🚀 Quick Start Integration

### Integration 1: Add Budget Widget to Activity Detail Page

**File**: `frontend/src/components/ActivityDetail.tsx` (or similar)

```typescript
import ActivityBudgetWidget from './ActivityBudgetWidget';

function ActivityDetail({ activityId }: { activityId: number }) {
  return (
    <div className="activity-detail">
      {/* Existing activity details */}
      <h1>Activity Information</h1>

      {/* Add Budget Widget */}
      <div className="budget-section">
        <h2>Budget Status</h2>
        <ActivityBudgetWidget activityId={activityId} />
      </div>

      {/* Rest of activity details */}
    </div>
  );
}
```

**Result**: Shows budget status with progress bar, spending info, and "Request Additional Budget" button.

---

### Integration 2: Add Budget Request to Activity Management

**File**: `frontend/src/components/ActivityManagement.tsx`

```typescript
import { useState } from 'react';
import BudgetRequestForm from './BudgetRequestForm';

function ActivityManagement() {
  const [showBudgetRequestModal, setShowBudgetRequestModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  const handleRequestBudget = (activityId: number) => {
    setSelectedActivityId(activityId);
    setShowBudgetRequestModal(true);
  };

  return (
    <div>
      {/* Activity table/list */}
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>{activity.name}</td>
              <td>{activity.status}</td>
              <td>
                <button onClick={() => handleRequestBudget(activity.id)}>
                  💰 Request Budget
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Budget Request Modal */}
      {showBudgetRequestModal && selectedActivityId && (
        <BudgetRequestForm
          activityId={selectedActivityId}
          onClose={() => setShowBudgetRequestModal(false)}
          onSuccess={() => {
            setShowBudgetRequestModal(false);
            // Refresh your data here
            loadActivities();
          }}
        />
      )}
    </div>
  );
}
```

**Result**: Adds "Request Budget" button for each activity that opens the request form.

---

### Integration 3: Add Finance Review Dashboard to Navigation

**File**: `frontend/src/App.tsx` or your router configuration

```typescript
import FinanceBudgetReview from './components/FinanceBudgetReview';

// If using React Router
<Route path="/finance/budget-reviews" element={<FinanceBudgetReview />} />

// Or add to navigation menu
const navigationItems = [
  // ... existing items
  {
    path: '/finance/budget-reviews',
    label: 'Budget Requests',
    icon: '💰',
    component: FinanceBudgetReview,
    module: 'finance',
    permission: 'READ'
  }
];
```

**File**: `frontend/src/components/FinanceDashboard.tsx`

```typescript
function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('programs')}>Programs</button>
        <button onClick={() => setActiveTab('approvals')}>Approvals</button>
        <button onClick={() => setActiveTab('budget-requests')}>
          Budget Requests {/* NEW TAB */}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && <FinanceOverview />}
        {activeTab === 'programs' && <ProgramBudgets />}
        {activeTab === 'approvals' && <FinanceApprovals />}
        {activeTab === 'budget-requests' && <FinanceBudgetReview />}
      </div>
    </div>
  );
}
```

**Result**: Finance team can access budget request review dashboard from navigation.

---

### Integration 4: Use Location Selector in Forms

**File**: `frontend/src/components/ActivityForm.tsx`

```typescript
import { useState } from 'react';
import LocationSelector from './LocationSelector';

function ActivityForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_id: null,
    // ... other fields
  });

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const handleLocationChange = (locationId: number | null, location: any) => {
    setFormData(prev => ({
      ...prev,
      location_id: locationId
    }));
    setSelectedLocation(location);
  };

  return (
    <form>
      <div className="form-group">
        <label>Activity Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* Location Selector */}
      <div className="form-group">
        <label>Location</label>
        <LocationSelector
          value={formData.location_id}
          onChange={handleLocationChange}
          maxLevel="ward" // Only show up to ward level
        />

        {/* Display selected path */}
        {selectedLocation && (
          <div className="selected-location-info">
            <small className="text-muted">
              Selected: {selectedLocation.name} ({selectedLocation.type})
            </small>
          </div>
        )}
      </div>

      {/* Rest of form fields */}
    </form>
  );
}
```

**Result**: Users can select hierarchical locations with cascading dropdowns.

---

## 🎨 Component Props Reference

### ActivityBudgetWidget

```typescript
interface ActivityBudgetWidgetProps {
  activityId: number;  // Required: Activity to show budget for
}
```

**Features**:
- Auto-loads budget data from API
- Shows remaining, allocated, spent, committed amounts
- Color-coded progress bar
- "Request Additional Budget" button
- Expandable detailed view

---

### BudgetRequestForm

```typescript
interface BudgetRequestFormProps {
  activityId: number;                              // Required: Activity to request budget for
  onClose?: () => void;                            // Optional: Callback when modal closes
  onSuccess?: (requestId: number) => void;        // Optional: Callback on successful submission
}
```

**Features**:
- Amount input with validation
- Priority selection (low, medium, high, urgent)
- Justification text area
- Dynamic budget breakdown editor
- Default categories: Materials, Personnel, Venue, Transport, Other
- Can add custom categories
- Total validation

**Breakdown Format**:
```json
{
  "materials": 20000,
  "venue": 15000,
  "facilitators": 15000,
  "transport": 5000
}
```

---

### FinanceBudgetReview

```typescript
// No props required - standalone component
```

**Features**:
- Lists all budget requests
- Filter by status
- View request details
- 4 action types:
  1. **Approve** - Enter approved amount (can be partial), add notes
  2. **Reject** - Enter rejection reason (required)
  3. **Return** - Enter amendment notes (required)
  4. **Edit** - Modify amount/justification (finance only)
- Priority and status badges
- Timestamps and user info

**Status Flow**:
```
submitted → under_review → approved
                        → rejected
                        → returned_for_amendment → (team resubmits) → submitted
```

---

### LocationSelector

```typescript
interface LocationSelectorProps {
  value: number | null;                            // Current location ID
  onChange: (id: number | null, location: any) => void;  // Change callback
  maxLevel?: 'country' | 'county' | 'sub_county' | 'ward' | 'parish';  // Optional: Max level
  showAllLevels?: boolean;                         // Optional: Show all dropdowns
}
```

**Features**:
- Cascading dropdowns for 5 levels
- Auto-loads parent hierarchy for existing value
- Displays selected path
- Configurable max level
- Returns both ID and full location object

**Location Hierarchy**:
```
Kenya (country)
  └── Nairobi (county)
      └── Kibra (sub_county)
          └── Laini Saba (ward)
              └── Laini Saba Central (parish)
```

---

## 🔌 Backend API Endpoints Used

### Budget Requests
```
GET    /api/budget-requests                        - List all requests
POST   /api/budget-requests                        - Create request
PUT    /api/budget-requests/:id/approve           - Approve request
PUT    /api/budget-requests/:id/reject            - Reject request
PUT    /api/budget-requests/:id/return            - Return for amendments
PUT    /api/budget-requests/:id/edit              - Edit request (finance)
GET    /api/budget-requests/activity/:id/budget   - Get activity budget
```

### Locations
```
GET    /api/locations                              - Get all locations
GET    /api/locations/:id                          - Get location with hierarchy
GET    /api/locations/children/:parentId           - Get child locations
GET    /api/locations/type/:type                   - Get by type
```

---

## 📊 Sample Data Flow

### Scenario: Team Requests Budget

1. **User clicks "Request Budget" button** in activity management
   ```typescript
   <button onClick={() => handleRequestBudget(activityId)}>
     Request Budget
   </button>
   ```

2. **BudgetRequestForm opens** with activity pre-selected
   ```typescript
   <BudgetRequestForm
     activityId={123}
     onSuccess={handleSuccess}
   />
   ```

3. **User fills form**:
   - Amount: KES 50,000
   - Priority: High
   - Justification: "Training materials needed"
   - Breakdown:
     - Materials: 20,000
     - Venue: 15,000
     - Facilitators: 15,000

4. **Form submits to API**:
   ```
   POST /api/budget-requests
   {
     "activity_id": 123,
     "requested_amount": 50000,
     "justification": "Training materials needed",
     "breakdown": {...},
     "priority": "high"
   }
   ```

5. **Request created** with status: `submitted`

6. **Finance team sees request** in FinanceBudgetReview dashboard

7. **Finance approves** (partial amount):
   ```
   PUT /api/budget-requests/456/approve
   {
     "approved_amount": 45000,
     "finance_notes": "Approved with slight reduction"
   }
   ```

8. **Budget automatically allocated** to activity:
   - `activity_budgets` updated
   - `approved_budget` increased by 45,000
   - `remaining_budget` calculated automatically

9. **ActivityBudgetWidget updates** showing new budget

---

## 🎯 Common Integration Patterns

### Pattern 1: Activity Page with Budget

```typescript
function ActivityPage({ activityId }: { activityId: number }) {
  return (
    <div className="container">
      <div className="row">
        {/* Left column - Activity details */}
        <div className="col-md-8">
          <ActivityDetails activityId={activityId} />
          <ActivityTimeline activityId={activityId} />
        </div>

        {/* Right column - Budget widget */}
        <div className="col-md-4">
          <div className="sidebar">
            <ActivityBudgetWidget activityId={activityId} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Pattern 2: Finance Module with Tabs

```typescript
function FinanceModule() {
  return (
    <div>
      <h1>Finance Management</h1>
      <Tabs>
        <Tab label="Program Budgets">
          <ProgramBudgetList />
        </Tab>
        <Tab label="Finance Approvals">
          <FinanceApprovals />
        </Tab>
        <Tab label="Budget Requests">
          <FinanceBudgetReview />
        </Tab>
      </Tabs>
    </div>
  );
}
```

---

### Pattern 3: Activity Dashboard with Quick Actions

```typescript
function ActivityDashboard() {
  const [showBudgetRequest, setShowBudgetRequest] = useState(false);

  return (
    <div>
      <h2>My Activities</h2>

      {/* Quick actions */}
      <div className="quick-actions">
        <button onClick={() => setShowNewActivity(true)}>
          + New Activity
        </button>
        <button onClick={() => setShowBudgetRequest(true)}>
          💰 Request Budget
        </button>
      </div>

      {/* Activities grid */}
      <div className="activities-grid">
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <h3>{activity.name}</h3>
            <ActivityBudgetWidget activityId={activity.id} />
          </div>
        ))}
      </div>

      {showBudgetRequest && (
        <BudgetRequestForm
          activityId={selectedActivityId}
          onClose={() => setShowBudgetRequest(false)}
        />
      )}
    </div>
  );
}
```

---

## 🔐 Permissions & Access Control

### Finance Module Access

```typescript
// Check if user has finance module access
const hasFinanceAccess = userModules.some(
  m => m.module_name === 'Finance Management' && m.has_access
);

// Show finance budget review only to finance users
{hasFinanceAccess && (
  <FinanceBudgetReview />
)}
```

### Budget Request Permissions

```typescript
// Activity managers can request budgets for their activities
const canRequestBudget = (activityId: number) => {
  return userActivities.some(a => a.id === activityId);
};

// Finance team can approve/reject
const canApproveRequests = userModules.some(
  m => m.module_name === 'Finance Management' &&
       m.permissions.includes('APPROVE')
);
```

---

## 🎨 Styling & Customization

All components use standard CSS classes. You can customize by adding CSS:

```css
/* Budget widget customization */
.budget-widget {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Budget request form */
.budget-request-modal {
  max-width: 800px;
}

/* Finance review dashboard */
.finance-budget-review {
  padding: 20px;
}

/* Location selector */
.location-selector select {
  min-width: 200px;
}
```

---

## 🐛 Troubleshooting

### Issue 1: Budget Widget Not Loading

**Symptom**: Widget shows loading spinner forever

**Solution**:
- Check if activity exists in database
- Verify `/api/budget-requests/activity/:id/budget` endpoint is accessible
- Check browser console for 404/500 errors
- Ensure activity_budgets table exists

### Issue 2: Budget Request Submission Fails

**Symptom**: Form submits but returns error

**Solution**:
- Check if `req.user.id` is available (authentication middleware)
- Verify activity_id exists in activities table
- Check if amount is positive number
- Ensure breakdown is valid JSON

### Issue 3: Location Selector Shows No Data

**Symptom**: Dropdowns are empty

**Solution**:
- Run `populate_reference_data.sql` migration
- Check `/api/locations` endpoint returns data
- Verify locations table has data
- Check is_active = 1 on locations

### Issue 4: Finance Review Dashboard Empty

**Symptom**: No requests shown but data exists

**Solution**:
- Check status filter - default shows all
- Verify user has finance module access
- Check if requests have deleted_at = NULL
- Look for JOIN errors in backend logs

---

## 📈 Performance Optimization

### Optimize Budget Widget Loading

```typescript
// Use React Query for caching
import { useQuery } from '@tanstack/react-query';

function ActivityBudgetWidget({ activityId }: { activityId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['activity-budget', activityId],
    queryFn: () => fetchActivityBudget(activityId),
    staleTime: 60000, // Cache for 1 minute
  });

  // ... rest of component
}
```

### Optimize Location Loading

```typescript
// Load all locations once and cache
const { data: allLocations } = useQuery({
  queryKey: ['locations'],
  queryFn: fetchAllLocations,
  staleTime: 3600000, // Cache for 1 hour
});

// Filter locally instead of multiple API calls
const counties = allLocations?.filter(l => l.type === 'county');
```

---

## ✅ Testing Checklist

### Budget Request Flow
- [ ] Team can open budget request form from activity
- [ ] Form validates required fields
- [ ] Breakdown total must equal requested amount
- [ ] Request submits successfully
- [ ] Success message appears
- [ ] Request appears in finance dashboard

### Finance Review Flow
- [ ] Finance can see all submitted requests
- [ ] Filters work correctly
- [ ] Approve action updates status and allocates budget
- [ ] Reject action requires reason
- [ ] Return action requires amendment notes
- [ ] Edit action updates request details

### Budget Widget
- [ ] Widget loads budget data correctly
- [ ] Progress bar shows correct percentage
- [ ] Colors change based on spend percentage
- [ ] "Request Budget" button opens form
- [ ] Budget updates after approval

### Location Selector
- [ ] Countries load on mount
- [ ] Selecting country loads counties
- [ ] Cascade works through all levels
- [ ] Existing value loads full hierarchy
- [ ] Selected path displays correctly

---

## 🚀 Deployment Steps

1. **Run Database Migrations**:
   ```bash
   mysql -u root -p me_clickup_system < database/migrations/add_budget_request_workflow.sql
   mysql -u root -p me_clickup_system < database/migrations/populate_reference_data.sql
   ```

2. **Restart Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Verify Routes Registered**:
   Look for console output:
   ```
   💰 Budget Requests routes registered at /api/budget-requests
   📍 Locations routes registered at /api/locations
   ```

4. **Build Frontend** (if needed):
   ```bash
   cd frontend
   npm run build
   ```

5. **Verify Components Import**:
   Check no TypeScript errors in components

6. **Test End-to-End**:
   - Submit a budget request
   - Approve it from finance dashboard
   - Verify budget widget updates

---

## 📚 Additional Resources

- **Backend API Documentation**: See `backend/routes/budget-requests.routes.js`
- **Database Schema**: See `database/migrations/add_budget_request_workflow.sql`
- **Workflow Documentation**: See `BUDGET_WORKFLOW_FEATURES.md`
- **Component Source**: See `frontend/src/components/`

---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend logs for API errors
3. Check browser console for frontend errors
4. Verify database migrations ran successfully

---

**Last Updated**: 2026-01-08
**Version**: 1.0
**Status**: Ready for Integration

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../config/api';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Psychology as AIIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

interface ProgramModule {
  id: number;
  name: string;
}

interface ComponentOption {
  id: number;
  name: string;
}

interface ReportData {
  [key: string]: any;
}

interface AIInsight {
  type: string;
  category: 'positive' | 'warning' | 'alert' | 'info';
  title: string;
  description: string;
  metric: string;
  recommendation: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<ProgramModule[]>([]);
  const [components, setComponents] = useState<ComponentOption[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData>({});
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Safely get auth context
  let user;
  try {
    const authContext = useAuth();
    user = authContext?.user;
  } catch (e) {
    console.error('Auth context error:', e);
  }

  useEffect(() => {
    const init = async () => {
      try {
        await fetchModules();
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to load modules. Please refresh the page.');
      }
    };
    init();
    // Note: loadExecutiveSummary is called by the tab change useEffect below
  }, []);

  const fetchModules = async () => {
    try {
      const response = await authFetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setModules(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const fetchComponents = async (moduleId: string) => {
    if (!moduleId || moduleId === 'all') {
      setComponents([]);
      return;
    }
    try {
      const response = await authFetch(`/api/components?moduleId=${moduleId}`);
      if (response.ok) {
        const data = await response.json();
        setComponents(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch components:', error);
    }
  };

  useEffect(() => {
    fetchComponents(selectedModule);
  }, [selectedModule]);

  const loadExecutiveSummary = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await authFetch(`/api/reports/executive-summary?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, executiveSummary: data.data }));
      }
    } catch (error) {
      console.error('Failed to load executive summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgramPerformance = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedModule !== 'all') params.append('moduleId', selectedModule);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await authFetch(`/api/reports/program-performance?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, programPerformance: data.data }));
      }
    } catch (error) {
      console.error('Failed to load program performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedModule !== 'all') params.append('moduleId', selectedModule);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('groupBy', 'module');

      const response = await authFetch(`/api/reports/financial?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, financial: data.data }));
      }
    } catch (error) {
      console.error('Failed to load financial report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBeneficiaryReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedModule !== 'all') params.append('moduleId', selectedModule);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await authFetch(`/api/reports/beneficiaries?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, beneficiaries: data.data }));
      }
    } catch (error) {
      console.error('Failed to load beneficiary report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIndicatorReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedModule !== 'all') params.append('moduleId', selectedModule);

      const response = await authFetch(`/api/reports/indicator-achievement?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, indicators: data.data }));
      }
    } catch (error) {
      console.error('Failed to load indicator report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRiskReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedModule !== 'all') params.append('moduleId', selectedModule);

      const response = await authFetch(`/api/reports/risk?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, risk: data.data }));
      }
    } catch (error) {
      console.error('Failed to load risk report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDataQualityReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedModule !== 'all') params.append('moduleId', selectedModule);

      const response = await authFetch(`/api/reports/data-quality?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, dataQuality: data.data }));
      }
    } catch (error) {
      console.error('Failed to load data quality report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    if (selectedModule === 'all') {
      alert('Please select a specific program module for AI insights');
      return;
    }

    try {
      setAiLoading(true);
      setShowAIDialog(true);

      const response = await authFetch(`/api/reports/ai/smart-insights?moduleId=${selectedModule}`);
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const loadAIPredictions = async (type: 'budget' | 'activity' | 'beneficiary') => {
    if (type === 'budget' && selectedModule === 'all') {
      alert('Please select a specific program module for budget predictions');
      return;
    }

    try {
      setLoading(true);
      let endpoint = '';
      const params = new URLSearchParams();

      if (type === 'budget') {
        endpoint = '/api/reports/ai/predict-budget-burn';
        params.append('moduleId', selectedModule);
        params.append('forecastDays', '90');
      } else if (type === 'activity') {
        if (selectedComponent === 'all') {
          alert('Please select a specific component for activity predictions');
          return;
        }
        endpoint = '/api/reports/ai/predict-activity-completion';
        params.append('componentId', selectedComponent);
      } else if (type === 'beneficiary') {
        endpoint = '/api/reports/ai/predict-beneficiary-reach';
        params.append('moduleId', selectedModule);
        params.append('forecastMonths', '6');
      }

      const response = await authFetch(`${endpoint}?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, [type + 'Prediction']: data.data }));
      }
    } catch (error) {
      console.error(`Failed to load ${type} prediction:`, error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnomalyDetection = async () => {
    if (selectedModule === 'all') {
      alert('Please select a specific program module for anomaly detection');
      return;
    }

    try {
      setLoading(true);
      const response = await authFetch(`/api/reports/ai/detect-spending-anomalies?moduleId=${selectedModule}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(prev => ({ ...prev, anomalies: data.data }));
      }
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    switch (activeTab) {
      case 0:
        loadExecutiveSummary();
        break;
      case 1:
        loadProgramPerformance();
        break;
      case 2:
        loadFinancialReport();
        break;
      case 3:
        loadBeneficiaryReport();
        break;
      case 4:
        loadIndicatorReport();
        break;
      case 5:
        loadRiskReport();
        break;
      case 6:
        loadDataQualityReport();
        break;
      default:
        break;
    }
  }, [activeTab, selectedModule, startDate, endDate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'on-track': '#4caf50',
      'at-risk': '#ff9800',
      'delayed': '#f44336',
      'off-track': '#f44336',
      'completed': '#4caf50',
      'achieved': '#4caf50',
      'high': '#f44336',
      'medium': '#ff9800',
      'low': '#4caf50',
    };
    return colors[status.toLowerCase()] || '#757575';
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'positive':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'alert':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196f3' }} />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon fontSize="large" />
          Reports & Analytics Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AIIcon />}
          onClick={loadAIInsights}
          disabled={selectedModule === 'all'}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
          }}
        >
          AI Insights
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Program Module</InputLabel>
              <Select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                label="Program Module"
              >
                <MenuItem value="all">All Modules</MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id.toString()}>
                    {module.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Component</InputLabel>
              <Select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                label="Component"
                disabled={selectedModule === 'all' || components.length === 0}
              >
                <MenuItem value="all">All Components</MenuItem>
                {components.map((comp) => (
                  <MenuItem key={comp.id} value={comp.id.toString()}>
                    {comp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSelectedModule('all');
                setSelectedComponent('all');
                setStartDate('');
                setEndDate('');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="report tabs"
        >
          <Tab icon={<AssessmentIcon />} label="Executive Summary" />
          <Tab icon={<TimelineIcon />} label="Program Performance" />
          <Tab icon={<BarChartIcon />} label="Financial Reports" />
          <Tab icon={<PieChartIcon />} label="Beneficiary Reports" />
          <Tab icon={<TrendingUpIcon />} label="Indicator Achievement" />
          <Tab icon={<WarningIcon />} label="Risk Analysis" />
          <Tab icon={<InfoIcon />} label="Data Quality" />
          <Tab icon={<AIIcon />} label="AI Predictions" />
        </Tabs>
      </Box>

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <ExecutiveSummaryPanel data={reportData.executiveSummary} formatCurrency={formatCurrency} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ProgramPerformancePanel data={reportData.programPerformance} formatCurrency={formatCurrency} getStatusColor={getStatusColor} />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <FinancialReportPanel data={reportData.financial} formatCurrency={formatCurrency} getStatusColor={getStatusColor} />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <BeneficiaryReportPanel data={reportData.beneficiaries} />
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <IndicatorReportPanel data={reportData.indicators} getStatusColor={getStatusColor} />
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <RiskReportPanel data={reportData.risk} formatCurrency={formatCurrency} getStatusColor={getStatusColor} />
      </TabPanel>

      <TabPanel value={activeTab} index={6}>
        <DataQualityPanel data={reportData.dataQuality} />
      </TabPanel>

      <TabPanel value={activeTab} index={7}>
        <AIPredictionsPanel
          budgetPrediction={reportData.budgetPrediction}
          activityPrediction={reportData.activityPrediction}
          beneficiaryPrediction={reportData.beneficiaryPrediction}
          anomalies={reportData.anomalies}
          onLoadPrediction={loadAIPredictions}
          onLoadAnomalies={loadAnomalyDetection}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
          selectedModule={selectedModule}
          selectedComponent={selectedComponent}
        />
      </TabPanel>

      {/* AI Insights Dialog */}
      <Dialog open={showAIDialog} onClose={() => setShowAIDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#2196F3' }} />
          AI-Generated Insights
        </DialogTitle>
        <DialogContent>
          {aiLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : aiInsights.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>No Insights Available</AlertTitle>
              There is not enough data to generate insights for this module.
            </Alert>
          ) : (
            <Box>
              {aiInsights.map((insight, index) => (
                <Alert
                  key={index}
                  severity={insight.category === 'positive' ? 'success' : insight.category === 'alert' ? 'error' : insight.category === 'warning' ? 'warning' : 'info'}
                  icon={getInsightIcon(insight.category)}
                  sx={{ mb: 2 }}
                >
                  <AlertTitle sx={{ fontWeight: 'bold' }}>{insight.title}</AlertTitle>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {insight.description}
                  </Typography>
                  {insight.recommendation && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                      <LightbulbIcon fontSize="small" sx={{ mt: 0.5 }} />
                      <Typography variant="body2">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </Typography>
                    </Box>
                  )}
                </Alert>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAIDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Sub-components for each report type
function ExecutiveSummaryPanel({ data, formatCurrency }: { data: any; formatCurrency: any }) {
  if (!data) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Modules</Typography>
            <Typography variant="h4">{data.total_modules || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Activities</Typography>
            <Typography variant="h4">{data.total_activities || 0}</Typography>
            <Typography variant="caption" color="success.main">
              {data.completed_activities || 0} completed ({data.completion_rate || 0}%)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Beneficiaries</Typography>
            <Typography variant="h4">{data.total_beneficiaries || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Budget Utilization</Typography>
            <Typography variant="h4">{data.budget_utilization || 0}%</Typography>
            <Typography variant="caption">
              {formatCurrency(data.total_spent || 0)} / {formatCurrency(data.total_budget || 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Budget Remaining</Typography>
            <Typography variant="h5" color="primary">{formatCurrency(data.budget_remaining || 0)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Strategic Goals</Typography>
            <Typography variant="h5">{data.total_goals || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Indicators Tracked</Typography>
            <Typography variant="h5">{data.total_indicators || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

function ProgramPerformancePanel({ data, formatCurrency, getStatusColor }: { data: any[]; formatCurrency: any; getStatusColor: any }) {
  if (!data || data.length === 0) {
    return <Alert severity="info">No data available</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Module</strong></TableCell>
            <TableCell align="right"><strong>Activities</strong></TableCell>
            <TableCell align="right"><strong>Completion %</strong></TableCell>
            <TableCell align="right"><strong>Beneficiaries</strong></TableCell>
            <TableCell align="right"><strong>Budget</strong></TableCell>
            <TableCell align="right"><strong>Spent</strong></TableCell>
            <TableCell align="right"><strong>Utilization %</strong></TableCell>
            <TableCell align="right"><strong>High Risk</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.module_name}</TableCell>
              <TableCell align="right">
                {row.total_activities} ({row.completed_activities} completed)
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(row.completion_percentage)}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                  />
                  {row.completion_percentage}%
                </Box>
              </TableCell>
              <TableCell align="right">{row.total_beneficiaries}</TableCell>
              <TableCell align="right">{formatCurrency(row.total_budget)}</TableCell>
              <TableCell align="right">{formatCurrency(row.total_spent)}</TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.budget_utilization}%`}
                  size="small"
                  color={parseFloat(row.budget_utilization) > 90 ? 'error' : parseFloat(row.budget_utilization) > 75 ? 'warning' : 'success'}
                />
              </TableCell>
              <TableCell align="right">
                {row.high_risk_activities > 0 ? (
                  <Chip label={row.high_risk_activities} size="small" color="error" />
                ) : (
                  <Chip label="0" size="small" color="success" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function FinancialReportPanel({ data, formatCurrency, getStatusColor }: { data: any[]; formatCurrency: any; getStatusColor: any }) {
  if (!data || data.length === 0) {
    return <Alert severity="info">No financial data available</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Program/Sub-program</strong></TableCell>
            <TableCell align="right"><strong>Budget Allocated</strong></TableCell>
            <TableCell align="right"><strong>Amount Spent</strong></TableCell>
            <TableCell align="right"><strong>Remaining</strong></TableCell>
            <TableCell align="right"><strong>Utilization</strong></TableCell>
            <TableCell align="right"><strong>Activities</strong></TableCell>
            <TableCell align="right"><strong>Cost/Beneficiary</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.module_name || row.subprogram_name || row.component_name}</TableCell>
              <TableCell align="right">{formatCurrency(row.total_budget)}</TableCell>
              <TableCell align="right">{formatCurrency(row.total_spent)}</TableCell>
              <TableCell align="right">
                <Typography color={row.budget_remaining < 0 ? 'error' : 'inherit'}>
                  {formatCurrency(row.budget_remaining)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(parseFloat(row.budget_utilization), 100)}
                    sx={{ width: 60, height: 8, borderRadius: 1 }}
                    color={parseFloat(row.budget_utilization) > 100 ? 'error' : 'primary'}
                  />
                  {row.budget_utilization}%
                </Box>
              </TableCell>
              <TableCell align="right">{row.activity_count}</TableCell>
              <TableCell align="right">{formatCurrency(row.cost_per_beneficiary)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function BeneficiaryReportPanel({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <Alert severity="info">No beneficiary data available</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Module/Location</strong></TableCell>
            <TableCell align="right"><strong>Total</strong></TableCell>
            <TableCell align="right"><strong>Male</strong></TableCell>
            <TableCell align="right"><strong>Female</strong></TableCell>
            <TableCell align="right"><strong>Vulnerable</strong></TableCell>
            <TableCell align="right"><strong>Avg Age</strong></TableCell>
            <TableCell align="right"><strong>Activities</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                {row.module_name}
                {row.location_name && <Typography variant="caption" display="block" color="textSecondary">
                  {row.location_name}
                </Typography>}
              </TableCell>
              <TableCell align="right"><strong>{row.total_beneficiaries}</strong></TableCell>
              <TableCell align="right">{row.male_count} ({row.male_percentage}%)</TableCell>
              <TableCell align="right">{row.female_count} ({row.female_percentage}%)</TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.vulnerable_count} (${row.vulnerable_percentage}%)`}
                  size="small"
                  color={parseFloat(row.vulnerable_percentage) > 50 ? 'warning' : 'default'}
                />
              </TableCell>
              <TableCell align="right">{row.avg_age || 'N/A'}</TableCell>
              <TableCell align="right">{row.activities_participated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function IndicatorReportPanel({ data, getStatusColor }: { data: any[]; getStatusColor: any }) {
  if (!data || data.length === 0) {
    return <Alert severity="info">No indicator data available</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Indicator</strong></TableCell>
            <TableCell><strong>Goal</strong></TableCell>
            <TableCell align="right"><strong>Baseline</strong></TableCell>
            <TableCell align="right"><strong>Target</strong></TableCell>
            <TableCell align="right"><strong>Current</strong></TableCell>
            <TableCell align="right"><strong>Achievement</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                {row.indicator_name}
                <Typography variant="caption" display="block" color="textSecondary">
                  {row.indicator_type} | {row.unit}
                </Typography>
              </TableCell>
              <TableCell>{row.goal_name}</TableCell>
              <TableCell align="right">{row.baseline_value}</TableCell>
              <TableCell align="right">{row.target_value}</TableCell>
              <TableCell align="right">{row.current_value}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(parseFloat(row.achievement_percentage), 100)}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                  />
                  {row.achievement_percentage}%
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  size="small"
                  sx={{ bgcolor: getStatusColor(row.status), color: 'white' }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function RiskReportPanel({ data, formatCurrency, getStatusColor }: { data: any[]; formatCurrency: any; getStatusColor: any }) {
  if (!data || data.length === 0) {
    return <Alert severity="success">No high-risk activities found!</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Activity</strong></TableCell>
            <TableCell><strong>Risk Level</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell align="right"><strong>Days Remaining</strong></TableCell>
            <TableCell align="right"><strong>Budget Variance</strong></TableCell>
            <TableCell align="right"><strong>Checklist Progress</strong></TableCell>
            <TableCell align="right"><strong>Beneficiaries</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                {row.activity_name}
                <Typography variant="caption" display="block" color="textSecondary">
                  {row.subprogram_name} / {row.component_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={row.risk_level}
                  size="small"
                  sx={{ bgcolor: getStatusColor(row.risk_level), color: 'white' }}
                />
              </TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell align="right">
                <Typography color={row.days_remaining < 0 ? 'error' : 'inherit'}>
                  {row.days_remaining}
                  {row.is_delayed && <WarningIcon fontSize="small" color="error" sx={{ ml: 1 }} />}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color={row.budget_overrun ? 'error' : 'inherit'}>
                  {formatCurrency(row.budget_variance)}
                </Typography>
              </TableCell>
              <TableCell align="right">{row.checklist_completion}%</TableCell>
              <TableCell align="right">{row.beneficiary_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function DataQualityPanel({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <Alert severity="info">No data quality information available</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Module</strong></TableCell>
            <TableCell align="right"><strong>Total Activities</strong></TableCell>
            <TableCell align="right"><strong>Location</strong></TableCell>
            <TableCell align="right"><strong>Budget</strong></TableCell>
            <TableCell align="right"><strong>Beneficiaries</strong></TableCell>
            <TableCell align="right"><strong>Attachments</strong></TableCell>
            <TableCell align="right"><strong>Time Entries</strong></TableCell>
            <TableCell align="right"><strong>Overall</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.module_name}</TableCell>
              <TableCell align="right">{row.total_activities}</TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.location_completeness}%`}
                  size="small"
                  color={parseFloat(row.location_completeness) > 80 ? 'success' : parseFloat(row.location_completeness) > 50 ? 'warning' : 'error'}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.budget_completeness}%`}
                  size="small"
                  color={parseFloat(row.budget_completeness) > 80 ? 'success' : parseFloat(row.budget_completeness) > 50 ? 'warning' : 'error'}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.beneficiary_completeness}%`}
                  size="small"
                  color={parseFloat(row.beneficiary_completeness) > 80 ? 'success' : parseFloat(row.beneficiary_completeness) > 50 ? 'warning' : 'error'}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.attachment_completeness}%`}
                  size="small"
                  color={parseFloat(row.attachment_completeness) > 80 ? 'success' : parseFloat(row.attachment_completeness) > 50 ? 'warning' : 'error'}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.time_entry_completeness}%`}
                  size="small"
                  color={parseFloat(row.time_entry_completeness) > 80 ? 'success' : parseFloat(row.time_entry_completeness) > 50 ? 'warning' : 'error'}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${row.overall_completeness}%`}
                  size="small"
                  color={parseFloat(row.overall_completeness) > 80 ? 'success' : parseFloat(row.overall_completeness) > 50 ? 'warning' : 'error'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function AIPredictionsPanel({
  budgetPrediction,
  activityPrediction,
  beneficiaryPrediction,
  anomalies,
  onLoadPrediction,
  onLoadAnomalies,
  formatCurrency,
  getStatusColor,
  selectedModule,
  selectedComponent,
}: any) {
  return (
    <Grid container spacing={3}>
      {/* Budget Burn Rate Prediction */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                Budget Burn Rate Prediction
              </Typography>
              <Button
                variant="contained"
                onClick={() => onLoadPrediction('budget')}
                disabled={selectedModule === 'all'}
              >
                Generate Prediction
              </Button>
            </Box>
            {budgetPrediction && budgetPrediction.current_status && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2 }}>
                      <Typography color="textSecondary" variant="caption">Total Budget</Typography>
                      <Typography variant="h6">{formatCurrency(budgetPrediction.current_status.total_budget)}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2 }}>
                      <Typography color="textSecondary" variant="caption">Spent</Typography>
                      <Typography variant="h6">{formatCurrency(budgetPrediction.current_status.total_spent)}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2 }}>
                      <Typography color="textSecondary" variant="caption">Remaining</Typography>
                      <Typography variant="h6">{formatCurrency(budgetPrediction.current_status.remaining_budget)}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2 }}>
                      <Typography color="textSecondary" variant="caption">Utilization</Typography>
                      <Typography variant="h6">{budgetPrediction.current_status.utilization_percentage}%</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                {budgetPrediction.predictions && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Prediction</AlertTitle>
                    Budget will be exhausted in approximately <strong>{budgetPrediction.predictions.days_until_budget_exhaustion} days</strong>
                    {' '}(Estimated date: {budgetPrediction.predictions.estimated_exhaustion_date})
                    <br />
                    Avg daily spending: {formatCurrency(budgetPrediction.spending_statistics.avg_daily_spending)}
                    {' '}| Recent trend: {budgetPrediction.spending_statistics.trend}
                  </Alert>
                )}
                {budgetPrediction.recommendations && budgetPrediction.recommendations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Recommendations:</Typography>
                    {budgetPrediction.recommendations.map((rec: string, i: number) => (
                      <Alert key={i} severity="warning" sx={{ mb: 1 }}>
                        {rec}
                      </Alert>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Completion Prediction */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon />
                Activity Completion Prediction
              </Typography>
              <Button
                variant="contained"
                onClick={() => onLoadPrediction('activity')}
                disabled={selectedComponent === 'all'}
              >
                Generate Prediction
              </Button>
            </Box>
            {activityPrediction && activityPrediction.predictions && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Activity</TableCell>
                      <TableCell align="right">Completion %</TableCell>
                      <TableCell align="right">Est. Completion Date</TableCell>
                      <TableCell align="right">Days Remaining</TableCell>
                      <TableCell>Risk Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityPrediction.predictions.map((pred: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{pred.activity_name}</TableCell>
                        <TableCell align="right">{pred.current_completion_percentage}%</TableCell>
                        <TableCell align="right">{pred.estimated_completion_date}</TableCell>
                        <TableCell align="right">{pred.estimated_remaining_days}</TableCell>
                        <TableCell>
                          <Chip
                            label={pred.risk_level}
                            size="small"
                            sx={{ bgcolor: getStatusColor(pred.risk_level), color: 'white' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Beneficiary Reach Prediction */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PieChartIcon />
                Beneficiary Reach Forecast
              </Typography>
              <Button
                variant="contained"
                onClick={() => onLoadPrediction('beneficiary')}
                disabled={selectedModule === 'all'}
              >
                Generate Forecast
              </Button>
            </Box>
            {beneficiaryPrediction && beneficiaryPrediction.forecast && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Forecast Summary</AlertTitle>
                  Expected to reach <strong>{beneficiaryPrediction.summary.total_predicted_beneficiaries}</strong> beneficiaries
                  {' '}over the next {beneficiaryPrediction.summary.forecast_period_months} months.
                  <br />
                  Monthly average: {beneficiaryPrediction.statistics.avg_monthly_beneficiaries} beneficiaries
                  {' '}| Trend: {beneficiaryPrediction.statistics.trend}
                </Alert>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Predicted Beneficiaries</TableCell>
                        <TableCell>Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {beneficiaryPrediction.forecast.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell align="right">{item.predicted_beneficiaries}</TableCell>
                          <TableCell>
                            {item.trend === 'increasing' ? (
                              <TrendingUpIcon color="success" fontSize="small" />
                            ) : item.trend === 'decreasing' ? (
                              <TrendingDownIcon color="error" fontSize="small" />
                            ) : (
                              '→'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Anomaly Detection */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon />
                Spending Anomalies Detection
              </Typography>
              <Button
                variant="contained"
                color="warning"
                onClick={onLoadAnomalies}
                disabled={selectedModule === 'all'}
              >
                Detect Anomalies
              </Button>
            </Box>
            {anomalies && anomalies.anomalies && (
              <Box>
                {anomalies.anomalies.length === 0 ? (
                  <Alert severity="success">
                    <AlertTitle>No Anomalies Detected</AlertTitle>
                    All spending patterns appear normal.
                  </Alert>
                ) : (
                  <Box>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <AlertTitle>Anomalies Found</AlertTitle>
                      Detected {anomalies.anomaly_count} anomalies ({anomalies.anomaly_percentage}% of activities)
                    </Alert>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Activity</TableCell>
                            <TableCell align="right">Amount Spent</TableCell>
                            <TableCell>Anomaly Types</TableCell>
                            <TableCell align="right">Z-Score</TableCell>
                            <TableCell>Severity</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {anomalies.anomalies.map((item: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{item.activity_name}</TableCell>
                              <TableCell align="right">{formatCurrency(item.total_spent)}</TableCell>
                              <TableCell>
                                {item.anomaly_types.map((type: string, j: number) => (
                                  <Chip key={j} label={type.replace(/_/g, ' ')} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                ))}
                              </TableCell>
                              <TableCell align="right">{item.z_score}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.severity}
                                  size="small"
                                  color={item.severity === 'high' ? 'error' : item.severity === 'medium' ? 'warning' : 'info'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReportsAnalytics;

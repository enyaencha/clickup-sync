import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon
} from "@mui/icons-material";

interface GBVCase {
  id: number;
  survivor_code: string;
  case_number: string;
  incident_date: string;
  incident_type: 'sexual_assault' | 'domestic_violence' | 'fgm' | 'early_marriage' | 'trafficking' | 'other';
  incident_location: string;
  survivor_age_group: 'child' | 'youth' | 'adult' | 'elderly';
  survivor_gender: 'female' | 'male' | 'other' | 'prefer_not_to_say';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  case_status: 'intake' | 'investigation' | 'intervention' | 'follow_up' | 'closed';
  consent_obtained: boolean;
  consent_date?: string;
  referral_source?: string;
  case_worker_name?: string;
  created_at: string;
}

const GBVCaseManagement: React.FC = () => {
  const [cases, setCases] = useState<GBVCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<GBVCase | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    incident_date: '',
    incident_type: 'domestic_violence' as GBVCase['incident_type'],
    incident_location: '',
    incident_description: '',
    survivor_age_group: 'adult' as GBVCase['survivor_age_group'],
    survivor_gender: 'female' as GBVCase['survivor_gender'],
    risk_level: 'medium' as GBVCase['risk_level'],
    case_status: 'intake' as GBVCase['case_status'],
    consent_obtained: false,
    consent_date: '',
    referral_source: '',
    immediate_needs: '',
    safety_concerns: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/gbv/cases', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch GBV cases');

      const data = await response.json();
      setCases(data.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching GBV cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (gbvCase?: GBVCase, view = false) => {
    if (gbvCase) {
      setSelectedCase(gbvCase);
      setFormData({
        incident_date: gbvCase.incident_date?.split('T')[0] || '',
        incident_type: gbvCase.incident_type,
        incident_location: gbvCase.incident_location || '',
        incident_description: '',
        survivor_age_group: gbvCase.survivor_age_group,
        survivor_gender: gbvCase.survivor_gender,
        risk_level: gbvCase.risk_level,
        case_status: gbvCase.case_status,
        consent_obtained: gbvCase.consent_obtained,
        consent_date: gbvCase.consent_date?.split('T')[0] || '',
        referral_source: gbvCase.referral_source || '',
        immediate_needs: '',
        safety_concerns: ''
      });
      setViewMode(view);
    } else {
      setSelectedCase(null);
      setFormData({
        incident_date: '',
        incident_type: 'domestic_violence',
        incident_location: '',
        incident_description: '',
        survivor_age_group: 'adult',
        survivor_gender: 'female',
        risk_level: 'medium',
        case_status: 'intake',
        consent_obtained: false,
        consent_date: '',
        referral_source: '',
        immediate_needs: '',
        safety_concerns: ''
      });
      setViewMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCase(null);
    setViewMode(false);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedCase
        ? `http://localhost:4000/api/gbv/cases/${selectedCase.id}`
        : 'http://localhost:4000/api/gbv/cases';

      const method = selectedCase ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save GBV case');

      setSuccess(selectedCase ? 'Case updated successfully' : 'Case created successfully');
      handleCloseDialog();
      fetchCases();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'success';
      case 'follow_up': return 'info';
      case 'intervention': return 'warning';
      case 'investigation': return 'secondary';
      case 'intake': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Privacy Warning */}
      <Alert severity="warning" icon={<ShieldIcon />} sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Confidential Information - Handle with Care
        </Typography>
        <Typography variant="body2">
          This module contains sensitive GBV case information. All data must be handled according to confidentiality protocols.
          Only authorized personnel have access to this information.
        </Typography>
      </Alert>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">GBV Case Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Case
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Cases</Typography>
              <Typography variant="h5">{cases.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Active Cases</Typography>
              <Typography variant="h5">
                {cases.filter(c => c.case_status !== 'closed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Critical Risk</Typography>
              <Typography variant="h5" color="error">
                {cases.filter(c => c.risk_level === 'critical').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>This Month</Typography>
              <Typography variant="h5">
                {cases.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cases Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Survivor Code</TableCell>
              <TableCell>Case Number</TableCell>
              <TableCell>Incident Type</TableCell>
              <TableCell>Incident Date</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Case Worker</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((gbvCase) => (
              <TableRow key={gbvCase.id}>
                <TableCell>
                  <Chip
                    label={gbvCase.survivor_code}
                    size="small"
                    icon={<ShieldIcon />}
                  />
                </TableCell>
                <TableCell>{gbvCase.case_number}</TableCell>
                <TableCell>{gbvCase.incident_type.replace('_', ' ').toUpperCase()}</TableCell>
                <TableCell>{new Date(gbvCase.incident_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={gbvCase.risk_level.toUpperCase()}
                    color={getRiskLevelColor(gbvCase.risk_level) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={gbvCase.case_status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(gbvCase.case_status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{gbvCase.case_worker_name || 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleOpenDialog(gbvCase, true)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Case">
                    <IconButton size="small" onClick={() => handleOpenDialog(gbvCase, false)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {cases.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">No GBV cases found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'View Case' : selectedCase ? 'Edit Case' : 'New GBV Case'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Incident Date"
                type="date"
                value={formData.incident_date}
                onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={viewMode}>
                <InputLabel>Incident Type</InputLabel>
                <Select
                  value={formData.incident_type}
                  label="Incident Type"
                  onChange={(e) => setFormData({ ...formData, incident_type: e.target.value as any })}
                >
                  <MenuItem value="sexual_assault">Sexual Assault</MenuItem>
                  <MenuItem value="domestic_violence">Domestic Violence</MenuItem>
                  <MenuItem value="fgm">FGM</MenuItem>
                  <MenuItem value="early_marriage">Early Marriage</MenuItem>
                  <MenuItem value="trafficking">Trafficking</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Incident Location"
                value={formData.incident_location}
                onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={viewMode}>
                <InputLabel>Survivor Age Group</InputLabel>
                <Select
                  value={formData.survivor_age_group}
                  label="Survivor Age Group"
                  onChange={(e) => setFormData({ ...formData, survivor_age_group: e.target.value as any })}
                >
                  <MenuItem value="child">Child (&lt;18)</MenuItem>
                  <MenuItem value="youth">Youth (18-35)</MenuItem>
                  <MenuItem value="adult">Adult (36-59)</MenuItem>
                  <MenuItem value="elderly">Elderly (60+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={viewMode}>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={formData.risk_level}
                  label="Risk Level"
                  onChange={(e) => setFormData({ ...formData, risk_level: e.target.value as any })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={viewMode}>
                <InputLabel>Case Status</InputLabel>
                <Select
                  value={formData.case_status}
                  label="Case Status"
                  onChange={(e) => setFormData({ ...formData, case_status: e.target.value as any })}
                >
                  <MenuItem value="intake">Intake</MenuItem>
                  <MenuItem value="investigation">Investigation</MenuItem>
                  <MenuItem value="intervention">Intervention</MenuItem>
                  <MenuItem value="follow_up">Follow-up</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Referral Source"
                value={formData.referral_source}
                onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
          {!viewMode && (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedCase ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GBVCaseManagement;

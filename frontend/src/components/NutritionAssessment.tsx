import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
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
  Tooltip,
  Checkbox,
  FormControlLabel,
  FormGroup
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Restaurant as NutritionIcon
} from "@mui/icons-material";

interface NutritionAssessment {
  id: number;
  assessment_date: string;
  beneficiary_id: number;
  beneficiary_name?: string;
  household_size: number;
  hdds_score: number;
  food_security_status: 'food_secure' | 'moderately_food_insecure' | 'severely_food_insecure';
  child_name?: string;
  child_age_months?: number;
  weight_kg?: number;
  height_cm?: number;
  muac_cm?: number;
  malnutrition_status?: 'normal' | 'mam' | 'sam';
  assessed_by_name?: string;
}

const NutritionAssessment: React.FC = () => {
  const [assessments, setAssessments] = useState<NutritionAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<NutritionAssessment | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    assessment_date: '',
    beneficiary_id: '',
    household_size: '',
    // HDDS food groups (12 groups)
    cereals: false,
    tubers: false,
    vegetables: false,
    fruits: false,
    meat: false,
    eggs: false,
    fish: false,
    legumes: false,
    dairy: false,
    oils: false,
    sugar: false,
    condiments: false,
    // Anthropometric data (optional for children)
    child_name: '',
    child_age_months: '',
    weight_kg: '',
    height_cm: '',
    muac_cm: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:4000/api/nutrition/assessments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch nutrition assessments');

      const data = await response.json();
      setAssessments(data.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching nutrition assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assessment?: NutritionAssessment, view = false) => {
    if (assessment) {
      setSelectedAssessment(assessment);
      // Note: We can't retrieve the food group checkboxes from the summary data
      // In a real implementation, you'd need to fetch the full assessment details
      setFormData({
        assessment_date: assessment.assessment_date?.split('T')[0] || '',
        beneficiary_id: assessment.beneficiary_id?.toString() || '',
        household_size: assessment.household_size?.toString() || '',
        cereals: false,
        tubers: false,
        vegetables: false,
        fruits: false,
        meat: false,
        eggs: false,
        fish: false,
        legumes: false,
        dairy: false,
        oils: false,
        sugar: false,
        condiments: false,
        child_name: assessment.child_name || '',
        child_age_months: assessment.child_age_months?.toString() || '',
        weight_kg: assessment.weight_kg?.toString() || '',
        height_cm: assessment.height_cm?.toString() || '',
        muac_cm: assessment.muac_cm?.toString() || ''
      });
      setViewMode(view);
    } else {
      setSelectedAssessment(null);
      setFormData({
        assessment_date: '',
        beneficiary_id: '',
        household_size: '',
        cereals: false,
        tubers: false,
        vegetables: false,
        fruits: false,
        meat: false,
        eggs: false,
        fish: false,
        legumes: false,
        dairy: false,
        oils: false,
        sugar: false,
        condiments: false,
        child_name: '',
        child_age_months: '',
        weight_kg: '',
        height_cm: '',
        muac_cm: ''
      });
      setViewMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAssessment(null);
    setViewMode(false);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedAssessment
        ? `http://localhost:4000/api/nutrition/assessments/${selectedAssessment.id}`
        : 'http://localhost:4000/api/nutrition/assessments';

      const method = selectedAssessment ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save nutrition assessment');

      setSuccess(selectedAssessment ? 'Assessment updated successfully' : 'Assessment created successfully');
      handleCloseDialog();
      fetchAssessments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getHDDSColor = (score: number) => {
    if (score >= 10) return 'success';
    if (score >= 6) return 'warning';
    return 'error';
  };

  const getFoodSecurityColor = (status: string) => {
    switch (status) {
      case 'food_secure': return 'success';
      case 'moderately_food_insecure': return 'warning';
      case 'severely_food_insecure': return 'error';
      default: return 'default';
    }
  };

  const getMalnutritionColor = (status: string | undefined) => {
    switch (status) {
      case 'normal': return 'success';
      case 'mam': return 'warning';
      case 'sam': return 'error';
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
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Nutrition Assessment</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Assessment
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Assessments</Typography>
              <Typography variant="h5">{assessments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Food Secure</Typography>
              <Typography variant="h5" color="success.main">
                {assessments.filter(a => a.food_security_status === 'food_secure').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Average HDDS</Typography>
              <Typography variant="h5">
                {assessments.length > 0
                  ? (assessments.reduce((sum, a) => sum + a.hdds_score, 0) / assessments.length).toFixed(1)
                  : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Malnutrition Cases</Typography>
              <Typography variant="h5" color="error">
                {assessments.filter(a => a.malnutrition_status === 'sam' || a.malnutrition_status === 'mam').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assessments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Beneficiary</TableCell>
              <TableCell>Household Size</TableCell>
              <TableCell>HDDS Score</TableCell>
              <TableCell>Food Security</TableCell>
              <TableCell>Child Data</TableCell>
              <TableCell>Malnutrition</TableCell>
              <TableCell>Assessed By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>{new Date(assessment.assessment_date).toLocaleDateString()}</TableCell>
                <TableCell>{assessment.beneficiary_name || `ID: ${assessment.beneficiary_id}`}</TableCell>
                <TableCell>{assessment.household_size}</TableCell>
                <TableCell>
                  <Chip
                    label={`${assessment.hdds_score}/12`}
                    color={getHDDSColor(assessment.hdds_score) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={assessment.food_security_status.replace(/_/g, ' ').toUpperCase()}
                    color={getFoodSecurityColor(assessment.food_security_status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {assessment.child_name ? (
                    <>
                      <Typography variant="body2">{assessment.child_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assessment.child_age_months} months | MUAC: {assessment.muac_cm} cm
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {assessment.malnutrition_status ? (
                    <Chip
                      label={assessment.malnutrition_status.toUpperCase()}
                      color={getMalnutritionColor(assessment.malnutrition_status) as any}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                  )}
                </TableCell>
                <TableCell>{assessment.assessed_by_name || 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleOpenDialog(assessment, true)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Assessment">
                    <IconButton size="small" onClick={() => handleOpenDialog(assessment, false)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {assessments.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">No nutrition assessments found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'View Assessment' : selectedAssessment ? 'Edit Assessment' : 'New Nutrition Assessment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assessment Date"
                type="date"
                value={formData.assessment_date}
                onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Beneficiary ID"
                type="number"
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Household Size"
                type="number"
                value={formData.household_size}
                onChange={(e) => setFormData({ ...formData, household_size: e.target.value })}
                disabled={viewMode}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Household Diet Diversity (Food groups consumed in last 24 hours):
              </Typography>
              <FormGroup>
                <Grid container>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.cereals} onChange={(e) => setFormData({ ...formData, cereals: e.target.checked })} disabled={viewMode} />}
                      label="Cereals"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.tubers} onChange={(e) => setFormData({ ...formData, tubers: e.target.checked })} disabled={viewMode} />}
                      label="Tubers/Roots"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.vegetables} onChange={(e) => setFormData({ ...formData, vegetables: e.target.checked })} disabled={viewMode} />}
                      label="Vegetables"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.fruits} onChange={(e) => setFormData({ ...formData, fruits: e.target.checked })} disabled={viewMode} />}
                      label="Fruits"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.meat} onChange={(e) => setFormData({ ...formData, meat: e.target.checked })} disabled={viewMode} />}
                      label="Meat/Poultry"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.eggs} onChange={(e) => setFormData({ ...formData, eggs: e.target.checked })} disabled={viewMode} />}
                      label="Eggs"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.fish} onChange={(e) => setFormData({ ...formData, fish: e.target.checked })} disabled={viewMode} />}
                      label="Fish/Seafood"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.legumes} onChange={(e) => setFormData({ ...formData, legumes: e.target.checked })} disabled={viewMode} />}
                      label="Legumes/Nuts"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.dairy} onChange={(e) => setFormData({ ...formData, dairy: e.target.checked })} disabled={viewMode} />}
                      label="Dairy"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.oils} onChange={(e) => setFormData({ ...formData, oils: e.target.checked })} disabled={viewMode} />}
                      label="Oils/Fats"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.sugar} onChange={(e) => setFormData({ ...formData, sugar: e.target.checked })} disabled={viewMode} />}
                      label="Sugar/Honey"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formData.condiments} onChange={(e) => setFormData({ ...formData, condiments: e.target.checked })} disabled={viewMode} />}
                      label="Condiments"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Anthropometric Data (Optional - for children under 5):
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Child Name"
                value={formData.child_name}
                onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Child Age (months)"
                type="number"
                value={formData.child_age_months}
                onChange={(e) => setFormData({ ...formData, child_age_months: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="MUAC (cm)"
                type="number"
                value={formData.muac_cm}
                onChange={(e) => setFormData({ ...formData, muac_cm: e.target.value })}
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
              {selectedAssessment ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NutritionAssessment;

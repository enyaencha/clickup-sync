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
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  LocalShipping as DistributionIcon
} from "@mui/icons-material";

interface ReliefDistribution {
  id: number;
  distribution_code: string;
  distribution_date: string;
  distribution_type: 'food' | 'nfis' | 'cash' | 'voucher' | 'medical' | 'shelter' | 'education';
  location: string;
  county?: string;
  sub_county?: string;
  ward?: string;
  total_beneficiaries: number;
  male_beneficiaries: number;
  female_beneficiaries: number;
  children_beneficiaries: number;
  item_description: string;
  quantity_distributed: number;
  unit_of_measure: string;
  distributed_by_name?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

const ReliefDistribution: React.FC = () => {
  const [distributions, setDistributions] = useState<ReliefDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<ReliefDistribution | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    distribution_date: '',
    distribution_type: 'food' as ReliefDistribution['distribution_type'],
    location: '',
    county: '',
    sub_county: '',
    ward: '',
    village: '',
    item_description: '',
    quantity_distributed: '',
    unit_of_measure: '',
    target_beneficiaries: '',
    status: 'planned' as ReliefDistribution['status'],
    distribution_notes: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:4000/api/relief/distributions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch relief distributions');

      const data = await response.json();
      setDistributions(data.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching relief distributions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (distribution?: ReliefDistribution, view = false) => {
    if (distribution) {
      setSelectedDistribution(distribution);
      setFormData({
        distribution_date: distribution.distribution_date?.split('T')[0] || '',
        distribution_type: distribution.distribution_type,
        location: distribution.location || '',
        county: distribution.county || '',
        sub_county: distribution.sub_county || '',
        ward: distribution.ward || '',
        village: '',
        item_description: distribution.item_description || '',
        quantity_distributed: distribution.quantity_distributed?.toString() || '',
        unit_of_measure: distribution.unit_of_measure || '',
        target_beneficiaries: distribution.total_beneficiaries?.toString() || '',
        status: distribution.status,
        distribution_notes: ''
      });
      setViewMode(view);
    } else {
      setSelectedDistribution(null);
      setFormData({
        distribution_date: '',
        distribution_type: 'food',
        location: '',
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        item_description: '',
        quantity_distributed: '',
        unit_of_measure: '',
        target_beneficiaries: '',
        status: 'planned',
        distribution_notes: ''
      });
      setViewMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDistribution(null);
    setViewMode(false);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedDistribution
        ? `http://localhost:4000/api/relief/distributions/${selectedDistribution.id}`
        : 'http://localhost:4000/api/relief/distributions';

      const method = selectedDistribution ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save relief distribution');

      setSuccess(selectedDistribution ? 'Distribution updated successfully' : 'Distribution created successfully');
      handleCloseDialog();
      fetchDistributions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'planned': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food': return 'success';
      case 'nfis': return 'info';
      case 'cash': return 'warning';
      case 'medical': return 'error';
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
        <Typography variant="h4">Relief Distribution</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Distribution
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Distributions</Typography>
              <Typography variant="h5">{distributions.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Completed</Typography>
              <Typography variant="h5" color="success.main">
                {distributions.filter(d => d.status === 'completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Beneficiaries</Typography>
              <Typography variant="h5">
                {distributions.reduce((sum, d) => sum + (d.total_beneficiaries || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>This Month</Typography>
              <Typography variant="h5">
                {distributions.filter(d => new Date(d.distribution_date).getMonth() === new Date().getMonth()).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distributions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Distribution Code</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Beneficiaries</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Distributed By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distributions.map((distribution) => (
              <TableRow key={distribution.id}>
                <TableCell>
                  <Chip
                    label={distribution.distribution_code}
                    size="small"
                    icon={<DistributionIcon />}
                  />
                </TableCell>
                <TableCell>{new Date(distribution.distribution_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={distribution.distribution_type.toUpperCase()}
                    color={getTypeColor(distribution.distribution_type) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{distribution.location || `${distribution.county}, ${distribution.sub_county}`}</TableCell>
                <TableCell>
                  {distribution.quantity_distributed} {distribution.unit_of_measure}
                  <Typography variant="caption" display="block" color="text.secondary">
                    {distribution.item_description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{distribution.total_beneficiaries}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    M: {distribution.male_beneficiaries} | F: {distribution.female_beneficiaries} | C: {distribution.children_beneficiaries}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={distribution.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(distribution.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{distribution.distributed_by_name || 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleOpenDialog(distribution, true)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Distribution">
                    <IconButton size="small" onClick={() => handleOpenDialog(distribution, false)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {distributions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">No relief distributions found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'View Distribution' : selectedDistribution ? 'Edit Distribution' : 'New Relief Distribution'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Distribution Date"
                type="date"
                value={formData.distribution_date}
                onChange={(e) => setFormData({ ...formData, distribution_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={viewMode}>
                <InputLabel>Distribution Type</InputLabel>
                <Select
                  value={formData.distribution_type}
                  label="Distribution Type"
                  onChange={(e) => setFormData({ ...formData, distribution_type: e.target.value as any })}
                >
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="nfis">Non-Food Items (NFIs)</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="voucher">Voucher</MenuItem>
                  <MenuItem value="medical">Medical Supplies</MenuItem>
                  <MenuItem value="shelter">Shelter Materials</MenuItem>
                  <MenuItem value="education">Education Materials</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="County"
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sub-County"
                value={formData.sub_county}
                onChange={(e) => setFormData({ ...formData, sub_county: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Description"
                value={formData.item_description}
                onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                disabled={viewMode}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity Distributed"
                type="number"
                value={formData.quantity_distributed}
                onChange={(e) => setFormData({ ...formData, quantity_distributed: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unit of Measure"
                value={formData.unit_of_measure}
                onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                placeholder="e.g., kg, bags, pieces"
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Beneficiaries"
                type="number"
                value={formData.target_beneficiaries}
                onChange={(e) => setFormData({ ...formData, target_beneficiaries: e.target.value })}
                disabled={viewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={viewMode}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
          {!viewMode && (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedDistribution ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReliefDistribution;

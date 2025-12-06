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
  Tabs,
  Tab
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Agriculture as AgricultureIcon,
  Terrain as PlotIcon
} from "@mui/icons-material";

interface Plot {
  id: number;
  plot_number: string;
  beneficiary_id: number;
  beneficiary_name?: string;
  land_area_acres: number;
  county?: string;
  sub_county?: string;
  ward?: string;
  village?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  soil_type?: string;
  irrigation_available: boolean;
  ownership_type: 'owned' | 'leased' | 'communal' | 'shared';
  registered_date: string;
}

interface Production {
  id: number;
  plot_id: number;
  plot_number?: string;
  crop_type: string;
  variety?: string;
  planting_date: string;
  planting_season: 'long_rains' | 'short_rains' | 'dry_season' | 'year_round';
  land_area_acres: number;
  expected_yield_kg?: number;
  actual_yield_kg?: number;
  yield_per_acre?: number;
  harvest_date?: string;
  production_challenges?: string;
}

const AgricultureMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Plot | Production | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [plotFormData, setPlotFormData] = useState({
    beneficiary_id: '',
    land_area_acres: '',
    county: '',
    sub_county: '',
    ward: '',
    village: '',
    gps_latitude: '',
    gps_longitude: '',
    soil_type: '',
    irrigation_available: false,
    ownership_type: 'owned' as Plot['ownership_type'],
    registered_date: ''
  });

  const [productionFormData, setProductionFormData] = useState({
    plot_id: '',
    crop_type: '',
    variety: '',
    planting_date: '',
    planting_season: 'long_rains' as Production['planting_season'],
    land_area_acres: '',
    expected_yield_kg: '',
    actual_yield_kg: '',
    harvest_date: '',
    production_challenges: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plotsRes, productionRes] = await Promise.all([
        fetch('http://localhost:4000/api/agriculture/plots', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:4000/api/agriculture/production', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      if (!plotsRes.ok || !productionRes.ok) throw new Error('Failed to fetch data');

      const plotsData = await plotsRes.json();
      const productionData = await productionRes.json();

      setPlots(plotsData.data || []);
      setProductions(productionData.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching agriculture data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlotDialog = (plot?: Plot, view = false) => {
    if (plot) {
      setSelectedItem(plot);
      setPlotFormData({
        beneficiary_id: plot.beneficiary_id?.toString() || '',
        land_area_acres: plot.land_area_acres?.toString() || '',
        county: plot.county || '',
        sub_county: plot.sub_county || '',
        ward: plot.ward || '',
        village: plot.village || '',
        gps_latitude: plot.gps_latitude?.toString() || '',
        gps_longitude: plot.gps_longitude?.toString() || '',
        soil_type: plot.soil_type || '',
        irrigation_available: plot.irrigation_available,
        ownership_type: plot.ownership_type,
        registered_date: plot.registered_date?.split('T')[0] || ''
      });
      setViewMode(view);
    } else {
      setSelectedItem(null);
      setPlotFormData({
        beneficiary_id: '',
        land_area_acres: '',
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        gps_latitude: '',
        gps_longitude: '',
        soil_type: '',
        irrigation_available: false,
        ownership_type: 'owned',
        registered_date: ''
      });
      setViewMode(false);
    }
    setOpenDialog(true);
  };

  const handleOpenProductionDialog = (production?: Production, view = false) => {
    if (production) {
      setSelectedItem(production);
      setProductionFormData({
        plot_id: production.plot_id?.toString() || '',
        crop_type: production.crop_type || '',
        variety: production.variety || '',
        planting_date: production.planting_date?.split('T')[0] || '',
        planting_season: production.planting_season,
        land_area_acres: production.land_area_acres?.toString() || '',
        expected_yield_kg: production.expected_yield_kg?.toString() || '',
        actual_yield_kg: production.actual_yield_kg?.toString() || '',
        harvest_date: production.harvest_date?.split('T')[0] || '',
        production_challenges: production.production_challenges || ''
      });
      setViewMode(view);
    } else {
      setSelectedItem(null);
      setProductionFormData({
        plot_id: '',
        crop_type: '',
        variety: '',
        planting_date: '',
        planting_season: 'long_rains',
        land_area_acres: '',
        expected_yield_kg: '',
        actual_yield_kg: '',
        harvest_date: '',
        production_challenges: ''
      });
      setViewMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setViewMode(false);
  };

  const handleSubmitPlot = async () => {
    try {
      const url = selectedItem && 'plot_number' in selectedItem
        ? `http://localhost:4000/api/agriculture/plots/${(selectedItem as Plot).id}`
        : 'http://localhost:4000/api/agriculture/plots';

      const method = selectedItem ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(plotFormData),
      });

      if (!response.ok) throw new Error('Failed to save plot');

      setSuccess(selectedItem ? 'Plot updated successfully' : 'Plot created successfully');
      handleCloseDialog();
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmitProduction = async () => {
    try {
      const url = selectedItem && 'crop_type' in selectedItem
        ? `http://localhost:4000/api/agriculture/production/${(selectedItem as Production).id}`
        : 'http://localhost:4000/api/agriculture/production';

      const method = selectedItem ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productionFormData),
      });

      if (!response.ok) throw new Error('Failed to save production');

      setSuccess(selectedItem ? 'Production updated successfully' : 'Production created successfully');
      handleCloseDialog();
      fetchData();
    } catch (err: any) {
      setError(err.message);
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
        <Typography variant="h4">Agriculture Monitoring</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => activeTab === 0 ? handleOpenPlotDialog() : handleOpenProductionDialog()}
        >
          {activeTab === 0 ? 'New Plot' : 'New Production'}
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Plots</Typography>
              <Typography variant="h5">{plots.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Acreage</Typography>
              <Typography variant="h5">
                {plots.reduce((sum, p) => sum + (p.land_area_acres || 0), 0).toFixed(1)} ac
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Active Crops</Typography>
              <Typography variant="h5">{productions.filter(p => !p.harvest_date).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Yield (kg)</Typography>
              <Typography variant="h5">
                {productions.reduce((sum, p) => sum + (p.actual_yield_kg || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab label="Plots" icon={<PlotIcon />} iconPosition="start" />
          <Tab label="Production" icon={<AgricultureIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Plots Table */}
      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plot Number</TableCell>
                <TableCell>Beneficiary</TableCell>
                <TableCell>Area (acres)</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Soil Type</TableCell>
                <TableCell>Irrigation</TableCell>
                <TableCell>Ownership</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plots.map((plot) => (
                <TableRow key={plot.id}>
                  <TableCell>
                    <Chip label={plot.plot_number} size="small" icon={<PlotIcon />} />
                  </TableCell>
                  <TableCell>{plot.beneficiary_name || `ID: ${plot.beneficiary_id}`}</TableCell>
                  <TableCell>{plot.land_area_acres}</TableCell>
                  <TableCell>
                    {plot.village}, {plot.ward}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {plot.sub_county}, {plot.county}
                    </Typography>
                  </TableCell>
                  <TableCell>{plot.soil_type || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={plot.irrigation_available ? 'Yes' : 'No'}
                      color={plot.irrigation_available ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={plot.ownership_type.toUpperCase()} size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleOpenPlotDialog(plot, true)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Plot">
                      <IconButton size="small" onClick={() => handleOpenPlotDialog(plot, false)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {plots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">No plots found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Production Table */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plot</TableCell>
                <TableCell>Crop/Variety</TableCell>
                <TableCell>Season</TableCell>
                <TableCell>Planting Date</TableCell>
                <TableCell>Area (acres)</TableCell>
                <TableCell>Expected Yield</TableCell>
                <TableCell>Actual Yield</TableCell>
                <TableCell>Yield/Acre</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productions.map((production) => (
                <TableRow key={production.id}>
                  <TableCell>
                    <Chip label={production.plot_number || `ID: ${production.plot_id}`} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{production.crop_type}</Typography>
                    {production.variety && (
                      <Typography variant="caption" color="text.secondary">{production.variety}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={production.planting_season.replace('_', ' ').toUpperCase()} size="small" />
                  </TableCell>
                  <TableCell>{new Date(production.planting_date).toLocaleDateString()}</TableCell>
                  <TableCell>{production.land_area_acres}</TableCell>
                  <TableCell>{production.expected_yield_kg?.toLocaleString() || 'N/A'} kg</TableCell>
                  <TableCell>
                    {production.actual_yield_kg ? (
                      <Typography variant="body2" color="success.main">
                        {production.actual_yield_kg.toLocaleString()} kg
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Pending</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {production.yield_per_acre ? (
                      `${production.yield_per_acre.toFixed(1)} kg/ac`
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleOpenProductionDialog(production, true)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Production">
                      <IconButton size="small" onClick={() => handleOpenProductionDialog(production, false)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {productions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="text.secondary">No production records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Plot Dialog */}
      {activeTab === 0 && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {viewMode ? 'View Plot' : selectedItem ? 'Edit Plot' : 'New Agricultural Plot'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Beneficiary ID"
                  type="number"
                  value={plotFormData.beneficiary_id}
                  onChange={(e) => setPlotFormData({ ...plotFormData, beneficiary_id: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Land Area (acres)"
                  type="number"
                  value={plotFormData.land_area_acres}
                  onChange={(e) => setPlotFormData({ ...plotFormData, land_area_acres: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="County"
                  value={plotFormData.county}
                  onChange={(e) => setPlotFormData({ ...plotFormData, county: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sub-County"
                  value={plotFormData.sub_county}
                  onChange={(e) => setPlotFormData({ ...plotFormData, sub_county: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ward"
                  value={plotFormData.ward}
                  onChange={(e) => setPlotFormData({ ...plotFormData, ward: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Village"
                  value={plotFormData.village}
                  onChange={(e) => setPlotFormData({ ...plotFormData, village: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GPS Latitude"
                  type="number"
                  value={plotFormData.gps_latitude}
                  onChange={(e) => setPlotFormData({ ...plotFormData, gps_latitude: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GPS Longitude"
                  type="number"
                  value={plotFormData.gps_longitude}
                  onChange={(e) => setPlotFormData({ ...plotFormData, gps_longitude: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Soil Type"
                  value={plotFormData.soil_type}
                  onChange={(e) => setPlotFormData({ ...plotFormData, soil_type: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={viewMode}>
                  <InputLabel>Ownership Type</InputLabel>
                  <Select
                    value={plotFormData.ownership_type}
                    label="Ownership Type"
                    onChange={(e) => setPlotFormData({ ...plotFormData, ownership_type: e.target.value as any })}
                  >
                    <MenuItem value="owned">Owned</MenuItem>
                    <MenuItem value="leased">Leased</MenuItem>
                    <MenuItem value="communal">Communal</MenuItem>
                    <MenuItem value="shared">Shared</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{viewMode ? 'Close' : 'Cancel'}</Button>
            {!viewMode && (
              <Button onClick={handleSubmitPlot} variant="contained" color="primary">
                {selectedItem ? 'Update' : 'Create'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Production Dialog */}
      {activeTab === 1 && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {viewMode ? 'View Production' : selectedItem ? 'Edit Production' : 'New Crop Production'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plot ID"
                  type="number"
                  value={productionFormData.plot_id}
                  onChange={(e) => setProductionFormData({ ...productionFormData, plot_id: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Crop Type"
                  value={productionFormData.crop_type}
                  onChange={(e) => setProductionFormData({ ...productionFormData, crop_type: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Variety"
                  value={productionFormData.variety}
                  onChange={(e) => setProductionFormData({ ...productionFormData, variety: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={viewMode}>
                  <InputLabel>Planting Season</InputLabel>
                  <Select
                    value={productionFormData.planting_season}
                    label="Planting Season"
                    onChange={(e) => setProductionFormData({ ...productionFormData, planting_season: e.target.value as any })}
                  >
                    <MenuItem value="long_rains">Long Rains</MenuItem>
                    <MenuItem value="short_rains">Short Rains</MenuItem>
                    <MenuItem value="dry_season">Dry Season</MenuItem>
                    <MenuItem value="year_round">Year Round</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Planting Date"
                  type="date"
                  value={productionFormData.planting_date}
                  onChange={(e) => setProductionFormData({ ...productionFormData, planting_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Land Area (acres)"
                  type="number"
                  value={productionFormData.land_area_acres}
                  onChange={(e) => setProductionFormData({ ...productionFormData, land_area_acres: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expected Yield (kg)"
                  type="number"
                  value={productionFormData.expected_yield_kg}
                  onChange={(e) => setProductionFormData({ ...productionFormData, expected_yield_kg: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Actual Yield (kg)"
                  type="number"
                  value={productionFormData.actual_yield_kg}
                  onChange={(e) => setProductionFormData({ ...productionFormData, actual_yield_kg: e.target.value })}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Harvest Date"
                  type="date"
                  value={productionFormData.harvest_date}
                  onChange={(e) => setProductionFormData({ ...productionFormData, harvest_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  disabled={viewMode}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{viewMode ? 'Close' : 'Cancel'}</Button>
            {!viewMode && (
              <Button onClick={handleSubmitProduction} variant="contained" color="primary">
                {selectedItem ? 'Update' : 'Create'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AgricultureMonitoring;

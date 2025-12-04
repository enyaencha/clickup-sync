import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Beneficiary {
  id: number;
  registration_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth?: string;
  age?: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  id_number?: string;
  phone_number?: string;
  alternative_phone?: string;
  email?: string;
  county?: string;
  sub_county?: string;
  ward?: string;
  village?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  household_size?: number;
  household_head: boolean;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
  disability_status: 'none' | 'physical' | 'visual' | 'hearing' | 'mental' | 'multiple';
  disability_details?: string;
  vulnerability_category?: 'refugee' | 'ovc' | 'elderly' | 'pwd' | 'youth_at_risk' | 'poor_household' | 'other';
  vulnerability_notes?: string;
  eligible_programs?: string[];
  current_programs?: string[];
  photo_url?: string;
  registration_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'exited';
  program_module_name?: string;
  registered_by_name?: string;
  shg_memberships_count?: number;
  active_loans_count?: number;
}

interface Program {
  id: number;
  name: string;
  code: string;
}

const Beneficiaries: React.FC = () => {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Beneficiary>>({
    first_name: '',
    last_name: '',
    gender: 'male',
    household_head: false,
    disability_status: 'none',
    status: 'active',
    registration_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchBeneficiaries();
    fetchPrograms();
  }, []);

  const fetchBeneficiaries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/beneficiaries', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch beneficiaries');

      const data = await response.json();
      setBeneficiaries(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/programs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch programs');

      const data = await response.json();
      setPrograms(data.data || []);
    } catch (err: any) {
      console.error('Error fetching programs:', err);
    }
  };

  const handleOpenDialog = (beneficiary?: Beneficiary) => {
    if (beneficiary) {
      setSelectedBeneficiary(beneficiary);
      setFormData(beneficiary);
    } else {
      setSelectedBeneficiary(null);
      setFormData({
        first_name: '',
        last_name: '',
        gender: 'male',
        household_head: false,
        disability_status: 'none',
        status: 'active',
        registration_date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBeneficiary(null);
    setFormData({
      first_name: '',
      last_name: '',
      gender: 'male',
      household_head: false,
      disability_status: 'none',
      status: 'active',
      registration_date: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const url = selectedBeneficiary
        ? `http://localhost:4000/api/beneficiaries/${selectedBeneficiary.id}`
        : 'http://localhost:4000/api/beneficiaries';

      const method = selectedBeneficiary ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save beneficiary');
      }

      setSuccess(selectedBeneficiary ? 'Beneficiary updated successfully' : 'Beneficiary registered successfully');
      handleCloseDialog();
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this beneficiary?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/beneficiaries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete beneficiary');

      setSuccess('Beneficiary deleted successfully');
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch = searchTerm === '' ||
      b.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone_number && b.phone_number.includes(searchTerm));

    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesGender = filterGender === 'all' || b.gender === filterGender;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'graduated': return 'info';
      case 'exited': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Beneficiary Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Register Beneficiary
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, ID, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="graduated">Graduated</MenuItem>
                  <MenuItem value="exited">Exited</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filterGender}
                  label="Gender"
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <MenuItem value="all">All Genders</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total: {filteredBeneficiaries.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>SHG</TableCell>
              <TableCell>Loans</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredBeneficiaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography color="text.secondary">No beneficiaries found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBeneficiaries.map((beneficiary) => (
                <TableRow key={beneficiary.id} hover>
                  <TableCell>{beneficiary.registration_number}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {beneficiary.first_name} {beneficiary.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{beneficiary.gender}</TableCell>
                  <TableCell>{beneficiary.age || '-'}</TableCell>
                  <TableCell>{beneficiary.phone_number || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {beneficiary.village || beneficiary.ward || beneficiary.sub_county || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={beneficiary.status}
                      size="small"
                      color={getStatusColor(beneficiary.status) as any}
                    />
                  </TableCell>
                  <TableCell>{beneficiary.shg_memberships_count || 0}</TableCell>
                  <TableCell>{beneficiary.active_loans_count || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(beneficiary)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(beneficiary.id)}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Registration/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBeneficiary ? 'Edit Beneficiary' : 'Register New Beneficiary'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Name *"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middle_name"
                  value={formData.middle_name || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Gender *</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender || 'male'}
                    label="Gender *"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Contact Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Alternative Phone"
                  name="alternative_phone"
                  value={formData.alternative_phone || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Location
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="County"
                  name="county"
                  value={formData.county || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Sub-County"
                  name="sub_county"
                  value={formData.sub_county || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Ward"
                  name="ward"
                  value={formData.ward || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Village"
                  name="village"
                  value={formData.village || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Household Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Household Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Household Size"
                  name="household_size"
                  type="number"
                  value={formData.household_size || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="household_head"
                      checked={formData.household_head || false}
                      onChange={handleInputChange}
                    />
                  }
                  label="Household Head"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    name="marital_status"
                    value={formData.marital_status || ''}
                    label="Marital Status"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                    <MenuItem value="divorced">Divorced</MenuItem>
                    <MenuItem value="widowed">Widowed</MenuItem>
                    <MenuItem value="separated">Separated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Vulnerability Assessment */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Vulnerability Assessment
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Disability Status</InputLabel>
                  <Select
                    name="disability_status"
                    value={formData.disability_status || 'none'}
                    label="Disability Status"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="physical">Physical</MenuItem>
                    <MenuItem value="visual">Visual</MenuItem>
                    <MenuItem value="hearing">Hearing</MenuItem>
                    <MenuItem value="mental">Mental</MenuItem>
                    <MenuItem value="multiple">Multiple</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Vulnerability Category</InputLabel>
                  <Select
                    name="vulnerability_category"
                    value={formData.vulnerability_category || ''}
                    label="Vulnerability Category"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="refugee">Refugee</MenuItem>
                    <MenuItem value="ovc">OVC (Orphan/Vulnerable Child)</MenuItem>
                    <MenuItem value="elderly">Elderly</MenuItem>
                    <MenuItem value="pwd">Person with Disability</MenuItem>
                    <MenuItem value="youth_at_risk">Youth at Risk</MenuItem>
                    <MenuItem value="poor_household">Poor Household</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.disability_status !== 'none' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Disability Details"
                    name="disability_details"
                    multiline
                    rows={2}
                    value={formData.disability_details || ''}
                    onChange={handleInputChange}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vulnerability Notes"
                  name="vulnerability_notes"
                  multiline
                  rows={2}
                  value={formData.vulnerability_notes || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Registration Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Registration Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Registration Date *"
                  name="registration_date"
                  type="date"
                  value={formData.registration_date || ''}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status || 'active'}
                    label="Status"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="graduated">Graduated</MenuItem>
                    <MenuItem value="exited">Exited</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedBeneficiary ? 'Update' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Beneficiaries;

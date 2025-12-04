import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface SHGGroup {
  id: number;
  group_code: string;
  group_name: string;
  formation_date: string;
  registration_status: string;
  total_members: number;
  male_members: number;
  female_members: number;
  total_savings: number;
  total_loans_disbursed: number;
  total_loans_outstanding: number;
  status: string;
  facilitator_name?: string;
  county?: string;
  sub_county?: string;
}

const SHGManagement: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<SHGGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SHGGroup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    group_name: '',
    formation_date: new Date().toISOString().split('T')[0],
    county: '',
    sub_county: '',
    ward: '',
    village: '',
    meeting_venue: '',
    meeting_frequency: 'monthly',
    share_value: '',
    loan_interest_rate: '10',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/shg/groups', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch SHG groups');

      const data = await response.json();
      setGroups(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (group?: SHGGroup) => {
    if (group) {
      setSelectedGroup(group);
      setFormData({
        group_name: group.group_name,
        formation_date: group.formation_date,
        county: group.county || '',
        sub_county: group.sub_county || '',
        ward: '',
        village: '',
        meeting_venue: '',
        meeting_frequency: 'monthly',
        share_value: '',
        loan_interest_rate: '10',
      });
    } else {
      setSelectedGroup(null);
      setFormData({
        group_name: '',
        formation_date: new Date().toISOString().split('T')[0],
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        meeting_venue: '',
        meeting_frequency: 'monthly',
        share_value: '',
        loan_interest_rate: '10',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const url = selectedGroup
        ? `http://localhost:4000/api/shg/groups/${selectedGroup.id}`
        : 'http://localhost:4000/api/shg/groups';

      const method = selectedGroup ? 'PUT' : 'POST';

      // Get the first program module if user has assignments
      let programModuleId = null;
      if (user?.module_assignments && user.module_assignments.length > 0) {
        programModuleId = user.module_assignments[0].module_id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          program_module_id: programModuleId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save group');
      }

      setSuccess(selectedGroup ? 'Group updated successfully' : 'Group created successfully');
      handleCloseDialog();
      fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'graduated': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Self-Help Groups (SHG)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Group
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Groups
              </Typography>
              <Typography variant="h4">
                {groups.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h4">
                {groups.reduce((sum, g) => sum + (g.total_members || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {groups.reduce((sum, g) => sum + (g.female_members || 0), 0)} Female
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Savings
              </Typography>
              <Typography variant="h5">
                {formatCurrency(groups.reduce((sum, g) => sum + (g.total_savings || 0), 0))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Loans Outstanding
              </Typography>
              <Typography variant="h5">
                {formatCurrency(groups.reduce((sum, g) => sum + (g.total_loans_outstanding || 0), 0))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Groups Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Group Code</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Formation Date</TableCell>
              <TableCell align="center">Members</TableCell>
              <TableCell align="right">Total Savings</TableCell>
              <TableCell align="right">Loans Outstanding</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">No SHG groups found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <TableRow key={group.id} hover>
                  <TableCell>{group.group_code}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {group.group_name}
                    </Typography>
                    {group.facilitator_name && (
                      <Typography variant="caption" color="text.secondary">
                        Facilitator: {group.facilitator_name}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {group.sub_county || group.county || '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(group.formation_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {group.total_members}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({group.female_members}F / {group.male_members}M)
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(group.total_savings || 0)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(group.total_loans_outstanding || 0)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={group.status}
                      size="small"
                      color={getStatusColor(group.status) as any}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(group)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedGroup ? 'Edit SHG Group' : 'Create New SHG Group'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group Name *"
                  value={formData.group_name}
                  onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Formation Date *"
                  type="date"
                  value={formData.formation_date}
                  onChange={(e) => setFormData({ ...formData, formation_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Meeting Frequency</InputLabel>
                  <Select
                    value={formData.meeting_frequency}
                    label="Meeting Frequency"
                    onChange={(e) => setFormData({ ...formData, meeting_frequency: e.target.value })}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="County"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sub-County"
                  value={formData.sub_county}
                  onChange={(e) => setFormData({ ...formData, sub_county: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ward"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Village"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Venue"
                  value={formData.meeting_venue}
                  onChange={(e) => setFormData({ ...formData, meeting_venue: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Share Value (KES)"
                  type="number"
                  value={formData.share_value}
                  onChange={(e) => setFormData({ ...formData, share_value: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Loan Interest Rate (%)"
                  type="number"
                  value={formData.loan_interest_rate}
                  onChange={(e) => setFormData({ ...formData, loan_interest_rate: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SHGManagement;

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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as ApproveIcon,
  AccountBalance as DisburseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Loan {
  id: number;
  loan_number: string;
  group_name: string;
  first_name: string;
  last_name: string;
  loan_amount: number;
  interest_rate: number;
  total_repayable: number;
  amount_repaid: number;
  outstanding_balance: number;
  loan_status: string;
  repayment_status: string;
  application_date: string;
  disbursement_date?: string;
  loan_type: string;
}

const LoansManagement: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchLoans();
    fetchStatistics();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/loans', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch loans');

      const data = await response.json();
      setLoans(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/loans/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch statistics');

      const data = await response.json();
      setStats(data.data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleApproveLoan = async (loanId: number) => {
    if (!window.confirm('Approve this loan application?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/loans/${loanId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to approve loan');

      setSuccess('Loan approved successfully');
      fetchLoans();
      fetchStatistics();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDisburseLoan = async (loanId: number) => {
    if (!window.confirm('Disburse this loan?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/loans/${loanId}/disburse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          disbursement_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) throw new Error('Failed to disburse loan');

      setSuccess('Loan disbursed successfully');
      fetchLoans();
      fetchStatistics();
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
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'disbursed':
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'defaulted': return 'error';
      default: return 'default';
    }
  };

  const getRepaymentStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'success';
      case 'overdue': return 'warning';
      case 'defaulted': return 'error';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const filteredLoans = filterStatus === 'all'
    ? loans
    : loans.filter(l => l.loan_status === filterStatus);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Loans Management
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Loans
                </Typography>
                <Typography variant="h4">
                  {stats.total_loans}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  {stats.pending_loans} Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Disbursed
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(stats.total_disbursed || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.active_loans} Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Repaid
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(stats.total_repaid || 0)}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {stats.completed_loans} Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Outstanding
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(stats.total_outstanding || 0)}
                </Typography>
                <Typography variant="body2" color="error.main">
                  {stats.overdue_loans} Overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Loans</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="disbursed">Disbursed</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="defaulted">Defaulted</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loan #</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Group</TableCell>
              <TableCell align="right">Loan Amount</TableCell>
              <TableCell align="right">Total Repayable</TableCell>
              <TableCell align="right">Repaid</TableCell>
              <TableCell align="right">Outstanding</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Repayment</TableCell>
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
            ) : filteredLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography color="text.secondary">No loans found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLoans.map((loan) => (
                <TableRow key={loan.id} hover>
                  <TableCell>{loan.loan_number}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {loan.first_name} {loan.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {loan.loan_type}
                    </Typography>
                  </TableCell>
                  <TableCell>{loan.group_name}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(loan.loan_amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @ {loan.interest_rate}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(loan.total_repayable)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(loan.amount_repaid)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(loan.outstanding_balance)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={loan.loan_status}
                      size="small"
                      color={getStatusColor(loan.loan_status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={loan.repayment_status}
                      size="small"
                      color={getRepaymentStatusColor(loan.repayment_status) as any}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {loan.loan_status === 'pending' && (
                      <IconButton
                        size="small"
                        onClick={() => handleApproveLoan(loan.id)}
                        title="Approve Loan"
                        color="primary"
                      >
                        <ApproveIcon fontSize="small" />
                      </IconButton>
                    )}
                    {loan.loan_status === 'approved' && (
                      <IconButton
                        size="small"
                        onClick={() => handleDisburseLoan(loan.id)}
                        title="Disburse Loan"
                        color="success"
                      >
                        <DisburseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoansManagement;

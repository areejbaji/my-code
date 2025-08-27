import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Typography as MuiTypography,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Done as DeliveredIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:5000';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_BASE}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '📦';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const columns = [
    { field: 'orderId', headerName: 'Order ID', width: 150 },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    { field: 'totalAmount', headerName: 'Total', width: 120,
      valueFormatter: (params) => `$${params.value}` },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          icon={<span>{getStatusIcon(params.value)}</span>}
        />
      ),
    },
    {
      field: 'orderDate',
      headerName: 'Order Date',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewOrder(params.row)}
            color="primary"
          >
            <ViewIcon />
          </IconButton>
          {params.row.status === 'pending' && (
            <>
              <IconButton
                size="small"
                onClick={() => handleUpdateStatus(params.row._id, 'approved')}
                color="success"
              >
                <ApproveIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleUpdateStatus(params.row._id, 'cancelled')}
                color="error"
              >
                <CancelIcon />
              </IconButton>
            </>
          )}
          {params.row.status === 'approved' && (
            <IconButton
              size="small"
              onClick={() => handleUpdateStatus(params.row._id, 'shipped')}
              color="primary"
            >
              <ShippingIcon />
            </IconButton>
          )}
          {params.row.status === 'shipped' && (
            <IconButton
              size="small"
              onClick={() => handleUpdateStatus(params.row._id, 'delivered')}
              color="success"
            >
              <DeliveredIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Manage Orders
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
          disableSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details - {selectedOrder?.orderId}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <MuiTypography variant="h6" gutterBottom>
                      Customer Information
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Phone:</strong> {selectedOrder.customerPhone}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Address:</strong> {selectedOrder.shippingAddress}
                    </MuiTypography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <MuiTypography variant="h6" gutterBottom>
                      Order Information
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Order ID:</strong> {selectedOrder.orderId}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedOrder.status}
                        color={getStatusColor(selectedOrder.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
                    </MuiTypography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={12}>
                <Card variant="outlined">
                  <CardContent>
                    <MuiTypography variant="h6" gutterBottom>
                      Order Items
                    </MuiTypography>
                    {selectedOrder.items?.map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={3}>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                          </Grid>
                          <Grid size={6}>
                            <MuiTypography variant="body1">{item.name}</MuiTypography>
                            <MuiTypography variant="body2" color="textSecondary">
                              Quantity: {item.quantity}
                            </MuiTypography>
                          </Grid>
                          <Grid size={3}>
                            <MuiTypography variant="body1" fontWeight="bold">
                              ${item.price}
                            </MuiTypography>
                          </Grid>
                        </Grid>
                        {index < selectedOrder.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedOrder?.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleUpdateStatus(selectedOrder._id, 'approved')}
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
              >
                Approve
              </Button>
              <Button 
                onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageOrders;

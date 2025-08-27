import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
// Using mock data for dashboard statistics (no API calls)
// Toggle this flag to false in future to enable real API fetching
const USE_MOCK_DASHBOARD_DATA = true;
const MOCK_STATS = {
  totalUsers: 1287,
  totalProducts: 342,
  totalOrders: 915,
  pendingOrders: 37,
  completedOrders: 812,
  totalRevenue: 124523.75,
  lowStockProducts: 9,
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (USE_MOCK_DASHBOARD_DATA) {
      // Simulate a short loading delay
      const timer = setTimeout(() => {
        setStats(MOCK_STATS);
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }

    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Placeholder for future real API fetching. Kept for easy switch-over.
    try {
      setStats(MOCK_STATS);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
        {error}
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
      description: 'Registered users in the system'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
      description: 'Products in inventory'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <OrdersIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.main',
      description: 'All time orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main',
      description: 'Orders awaiting approval'
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
      description: 'Successfully delivered orders'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: <MoneyIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
      description: 'Revenue from completed orders'
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockProducts,
      icon: <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error.main',
      description: 'Products with stock < 10'
    },
    {
      title: 'Shipping Orders',
      value: stats.totalOrders - stats.pendingOrders - stats.completedOrders,
      icon: <ShippingIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.main',
      description: 'Orders currently shipping'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Welcome to your e-commerce admin dashboard. Here's a quick overview of your business metrics.
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h4" component="div" sx={{ 
                  fontWeight: 'bold', 
                  color: card.color,
                  mb: 1 
                }}>
                  {card.value}
                </Typography>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Activity
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip 
                  label={`${stats.pendingOrders} orders need approval`}
                  color="warning"
                  variant="outlined"
                  icon={<WarningIcon />}
                />
                {stats.lowStockProducts > 0 && (
                  <Chip 
                    label={`${stats.lowStockProducts} products low on stock`}
                    color="error"
                    variant="outlined"
                    icon={<WarningIcon />}
                  />
                )}
                <Chip 
                  label={`${stats.totalUsers} active users`}
                  color="success"
                  variant="outlined"
                  icon={<PeopleIcon />}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Order Completion Rate:</Typography>
                  <Typography variant="h6" color="success.main">
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Average Order Value:</Typography>
                  <Typography variant="h6" color="primary.main">
                    ${stats.completedOrders > 0 ? Math.round((stats.totalRevenue / stats.completedOrders) * 100) / 100 : 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Products per Category:</Typography>
                  <Typography variant="h6" color="info.main">
                    {Math.round(stats.totalProducts / 8)} avg
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;

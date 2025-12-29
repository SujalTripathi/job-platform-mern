import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 4 }}>
        Welcome to Your Impactful Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.9)', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Users
              </Typography>
              <Typography variant="h4" color="primary">
                1,234
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.9)', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Revenue
              </Typography>
              <Typography variant="h4" color="secondary">
                $56,789
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.9)', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Growth Rate
              </Typography>
              <Typography variant="h4" color="success.main">
                +15%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.9)', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
// Advanced dashboard helpers and an enhanced, drop-in component

const useDashboardData = () => {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    users: 1234,
    revenue: 56789,
    growth: 15,
  });
  const [chartData, setChartData] = React.useState(data);

  React.useEffect(() => {
    let mounted = true;

    const seed = () => {
      // simulate a server response with slight variations
      const newChart = data.map((d) => ({
        ...d,
        value: Math.max(50, Math.round(d.value * (0.85 + Math.random() * 0.3))),
      }));
      const newStats = {
        users: 1200 + Math.floor(Math.random() * 200),
        revenue: 40000 + Math.floor(Math.random() * 30000),
        growth: Math.round((5 + Math.random() * 20) * 10) / 10,
      };
      if (!mounted) return;
      setChartData(newChart);
      setStats(newStats);
      setLoading(false);
    };

    // initial load
    const t = setTimeout(seed, 700);

    // periodic refresh
    const interval = setInterval(() => {
      seed();
    }, 8000);

    return () => {
      mounted = false;
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const refresh = () => {
    setLoading(true);
    // quick refresh simulation
    setTimeout(() => {
      setChartData((prev) =>
        prev.map((d) => ({ ...d, value: Math.max(30, Math.round(d.value * (0.9 + Math.random() * 0.3))) }))
      );
      setStats((s) => ({ ...s, users: s.users + Math.floor(Math.random() * 15) }));
      setLoading(false);
    }, 600);
  };

  return { loading, stats, chartData, refresh };
};

const CountUp = ({ value = 0, duration = 700, format = (v) => v }) => {
  const [current, setCurrent] = React.useState(value);
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    const start = performance.now();
    const from = Number(current);
    const to = Number(value);
    const tick = (t) => {
      const elapsed = t - start;
      const progress = Math.min(1, elapsed / duration);
      const val = Math.round(from + (to - from) * progress);
      setCurrent(val);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{format(current)}</>;
};

const downloadCSV = (arr = [], filename = 'dashboard-data.csv') => {
  if (!arr.length) return;
  const headers = Object.keys(arr[0]);
  const rows = arr.map((row) => headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const AdvancedDashboard = () => {
  const { loading, stats, chartData, refresh } = useDashboardData();

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          color: 'white',
          mb: 3,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
          Impactful Insights
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.85 }}>
          Live simulated metrics and interactive export features — built to fit into your project structure.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            mt: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box
            component="button"
            onClick={refresh}
            aria-label="Refresh data"
            sx={{
              background: 'linear-gradient(90deg,#667eea,#764ba2)',
              color: 'white',
              border: 'none',
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: 'pointer',
              boxShadow: 3,
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            Refresh
          </Box>

          <Box
            component="button"
            onClick={() => downloadCSV(chartData)}
            aria-label="Export chart data as CSV"
            sx={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.18)',
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { background: 'rgba(255,255,255,0.04)' },
            }}
          >
            Export CSV
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
              boxShadow: 4,
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" color="primary">
                {loading ? '...' : <CountUp value={stats.users} format={(v) => v.toLocaleString()} />}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
              boxShadow: 4,
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h4" color="secondary">
                {loading ? '...' : <CountUp value={stats.revenue} format={(v) => `$${v.toLocaleString()}`} />}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
              boxShadow: 4,
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h6">Growth Rate</Typography>
              <Typography variant="h4" color="success.main">
                {loading ? '...' : <CountUp value={stats.growth} format={(v) => `${v}%`} />}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.92))', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>

            <Box sx={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#764ba2" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="strokeValue" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(val) => new Intl.NumberFormat('en-US').format(val)} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#strokeValue)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    fill="url(#gradValue)"
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
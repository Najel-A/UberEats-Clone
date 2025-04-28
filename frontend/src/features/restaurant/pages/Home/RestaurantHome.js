import React, { useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Button, 
  Row, 
  Col, 
  Statistic,
  Badge,
  Avatar,
  Space,
  Typography,
  Spin,
  Progress
} from 'antd';
import {
  UserOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantOrders } from '../../../../redux/slices/orderSlice';
import { logout } from '../../../../redux/slices/authSlice';
import { fetchRestaurantProfile } from '../../../../redux/slices/restaurantSlice';
import OrderCard from '../../components/Order/OrderCard';
import './RestaurantHome.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const RestaurantHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  // Get orders from Redux store
  const { 
    restaurantOrders, 
    restaurantOrdersStatus,
    restaurantOrdersError 
  } = useSelector((state) => state.order);
  
  const { user, token } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.restaurants);
  // console.log(profile);
  
  // Gets Orders
  useEffect(() => {
    if (user) {
      dispatch(fetchRestaurantOrders());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (token) {
      dispatch(fetchRestaurantProfile());
    }
  }, [dispatch, token]);

  // Calculate dashboard stats
  const stats = {
    pendingOrders: restaurantOrders?.filter(o => ['New', 'Preparing'].includes(o.status)).length || 0,
    completedToday: restaurantOrders?.filter(o => ['Delivered', 'Picked Up'].includes(o.status)).length || 0,
    totalRevenue: restaurantOrders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Restaurant Profile',
    },
  ];

  // Get recent orders (last 5)
  const recentOrders = restaurantOrders?.slice(0, 5) || [];

  if (restaurantOrdersStatus === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (restaurantOrdersError) {
    return (
      <div style={{ padding: 24 }}>
        <Text type="danger">Error loading orders: {restaurantOrdersError}</Text>
      </div>
    );
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light" breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <Avatar size={64} src={profile?.profilePicture || 'https://example.com/default-restaurant.jpg'} />
          <Title level={4} style={{ marginTop: 16 }}>{user || 'My Restaurant'}</Title>
          <Text type="secondary">{user?.rating ? `${user.rating} ★` : 'No ratings yet'}</Text>
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onSelect={({ key }) => navigate(`/restaurant/${key}`)}
        />
        
        <div style={{ padding: 16, position: 'absolute', bottom: 0, width: '100%' }}>
          <Button block icon={<LogoutOutlined />} danger onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 16 }}>Restaurant Dashboard</Title>
            <Space style={{ margin: 16 }}>
              
            </Space>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px 0' }}>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Card style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <Statistic
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <Statistic
                  title="Completed Today"
                  value={stats.completedToday}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <Statistic
                  title="Today's Revenue"
                  value={stats.totalRevenue}
                  precision={2}
                  prefix="$"
                />
              </Card>
            </Col>
          </Row>
          {/* Pending Order Status Bar */}
          <Card style={{ borderRadius: 16, marginBottom: 32, boxShadow: '0 2px 12px rgba(24,144,255,0.08)' }}>
            <Title level={5} style={{ marginBottom: 16 }}>Pending Order Status</Title>
            <Progress 
              percent={restaurantOrders && restaurantOrders.length > 0 ? Math.round((stats.pendingOrders / restaurantOrders.length) * 100) : 0}
              status={stats.pendingOrders > 0 ? 'active' : 'normal'}
              strokeColor={{ from: '#06C167', to: '#1890ff' }}
              showInfo
              format={percent => `${stats.pendingOrders} pending / ${restaurantOrders?.length || 0} total`}
            />
          </Card>

          {/* Order and Menu Management Cards */}
          <Row gutter={24} style={{ marginBottom: 32 }}>
            <Col xs={24} md={12}>
              <Card
                className="dashboard-action-card order-management-card"
                style={{ borderRadius: 18, minHeight: 200, border: 'none', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
                hoverable
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                  <div className="dashboard-action-icon order-icon">
                    <ShoppingCartOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                  </div>
                  <Title level={5} style={{ margin: 0 }}>Order Management</Title>
                </div>
                <Text type="secondary" style={{ fontSize: 16 }}>View and manage all your restaurant orders, update statuses, and track order history.</Text>
                <Button 
                  type="primary" 
                  className="dashboard-action-btn order-btn"
                  style={{ marginTop: 28, borderRadius: 8, background: '#1890ff', border: 'none', fontWeight: 600, fontSize: 16, padding: '12px 32px' }}
                  size="large"
                  onClick={() => navigate('/restaurant/orders')}
                >
                  Go to Orders
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="dashboard-action-card menu-management-card"
                style={{ borderRadius: 18, minHeight: 200, border: 'none', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
                hoverable
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                  <div className="dashboard-action-icon menu-icon">
                    <MenuOutlined style={{ fontSize: 36, color: '#06C167' }} />
                  </div>
                  <Title level={5} style={{ margin: 0 }}>Menu Management</Title>
                </div>
                <Text type="secondary" style={{ fontSize: 16 }}>Add, edit, or remove dishes from your restaurant menu. Keep your offerings up to date.</Text>
                <Button 
                  type="primary" 
                  className="dashboard-action-btn menu-btn"
                  style={{ marginTop: 28, borderRadius: 8, background: '#06C167', border: 'none', fontWeight: 600, fontSize: 16, padding: '12px 32px' }}
                  size="large"
                  onClick={() => navigate('/restaurant/menu')}
                >
                  Manage Menu
                </Button>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RestaurantHome;
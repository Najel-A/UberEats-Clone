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
  Spin
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
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: (
        <Badge count={stats.pendingOrders} offset={[10, 0]}>
          Orders
        </Badge>
      ),
    },
    {
      key: 'menu',
      icon: <MenuOutlined />,
      label: 'Menu Management',
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
              <Button type="primary" onClick={() => navigate('/restaurant/menu/add')}>
                Add New Dish
              </Button>
            </Space>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px 0' }}>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Completed Today"
                  value={stats.completedToday}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Today's Revenue"
                  value={stats.totalRevenue}
                  precision={2}
                  prefix="$"
                />
              </Card>
            </Col>
          </Row>

          <Card 
            title="Recent Orders" 
            extra={<Button type="link" onClick={() => navigate('/restaurant/orders')}>
              View All Orders
            </Button>}
          >
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <OrderCard 
                  key={order._id} 
                  order={order} 
                  isRestaurant={true}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Text type="secondary">No recent orders</Text>
              </div>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RestaurantHome;
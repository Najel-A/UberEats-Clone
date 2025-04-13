import React from 'react';
import { 
  Card, 
  Typography, 
  Divider, 
  List, 
  Avatar, 
  Badge, 
  Button, 
  Space, 
  Spin,
  Tag,
  Popconfirm
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// Status configurations
const statusConfig = {
  'New': {
    color: 'blue',
    icon: <ClockCircleOutlined />,
    actions: [
      { label: 'Start Preparing', status: 'Preparing', type: 'primary' },
      { label: 'Cancel Order', status: 'Cancelled', type: 'danger' }
    ]
  },
  'Preparing': {
    color: 'orange',
    icon: <ClockCircleOutlined />,
    actions: [
      { label: 'Mark as Ready', status: 'Pick-up Ready', type: 'primary' }
    ]
  },
  'On the Way': {
    color: 'purple',
    icon: <ClockCircleOutlined />,
    actions: [
      { label: 'Mark as Delivered', status: 'Delivered', type: 'primary' }
    ]
  },
  'Pick-up Ready': {
    color: 'green',
    icon: <CheckCircleOutlined />,
    actions: [
      { label: 'Confirm Pick-up', status: 'Picked Up', type: 'primary' }
    ]
  },
  'Delivered': {
    color: 'green',
    icon: <CheckCircleOutlined />,
    actions: []
  },
  'Picked Up': {
    color: 'green',
    icon: <CheckCircleOutlined />,
    actions: []
  },
  'Cancelled': {
    color: 'red',
    icon: <CloseCircleOutlined />,
    actions: []
  }
};

const OrderCard = ({ 
  order, 
  onStatusChange, 
  isRestaurant = false,
  isUpdating = false 
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total items in order
  const calculateTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate subtotal for an item
  const calculateItemSubtotal = (item) => {
    return (item.quantity * item.priceAtTime).toFixed(2);
  };
  console.log('Order Items:', order.items);

  // Generate action buttons based on order status and context
  const getStatusActions = () => {
    if (isUpdating) return [<Spin key="loading" size="small" />];
    if (!isRestaurant) return [];

    const config = statusConfig[order.status];
    if (!config || config.actions.length === 0) return [];

    return config.actions.map((action) => (
      <Button
        key={action.status}
        type={action.type}
        danger={action.type === 'danger'}
        icon={action.type === 'danger' ? <ExclamationCircleOutlined /> : null}
        onClick={() => onStatusChange(order._id, action.status)}
        style={{ marginRight: 8 }}
      >
        {action.label}
      </Button>
    ));
  };

  // Customer-specific cancel button
  const getCustomerCancelButton = () => {
    if (isRestaurant || order.status !== 'New') return null;

    return (
      <Popconfirm
        title="Are you sure you want to cancel this order?"
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        onConfirm={() => onStatusChange(order._id, 'Cancelled')}
        okText="Yes"
        cancelText="No"
      >
        <Button danger icon={<CloseCircleOutlined />}>
          Cancel Order
        </Button>
      </Popconfirm>
    );
  };

  const actions = [
    ...getStatusActions(),
    getCustomerCancelButton()
  ].filter(Boolean);

  return (
    <Badge.Ribbon 
      text={order.status} 
      color={statusConfig[order.status]?.color || 'default'}
      placement="start"
    >
      <Card 
        style={{ marginBottom: 20, borderRadius: 8 }}
        title={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>Order #{order._id.slice(-6).toUpperCase()}</Text>
            <Text type="secondary">{formatDate(order.created_at)}</Text>
            {isRestaurant && (
              <div>
                <Text strong>Customer: </Text>
                <Text>{order.customer_id?.name || 'Guest'}</Text>
              </div>
            )}
          </Space>
        }
        extra={
          <Space>
            <Tag color="blue">{calculateTotalItems()} items</Tag>
            <Text strong style={{ fontSize: 16 }}>
              ${order.total_price.toFixed(2)}
            </Text>
          </Space>
        }
        actions={actions}
      >
        <List
          itemLayout="horizontal"
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`http://localhost:5000${item.dish.image}`} shape="square" size={64} />}
                title={
                  <Text strong style={{ fontSize: 16 }}>
                    {item.dish?.name || 'Unknown Dish'}
                  </Text>
                }
                description={
                  <Space direction="vertical" size="small">
                    <div>
                      <Text>Qty: {item.quantity}</Text>
                      <Divider type="vertical" />
                      <Text>Price: ${item.priceAtTime.toFixed(2)}</Text>
                      <Divider type="vertical" />
                      <Text strong>Subtotal: ${calculateItemSubtotal(item)}</Text>
                    </div>
                    {item.special_instructions && (
                      <Text type="secondary">
                        <Text strong>Notes: </Text>
                        {item.special_instructions}
                      </Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
        
        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            {statusConfig[order.status]?.icon}
            <Text type="secondary">Last updated: {formatDate(order.updated_at)}</Text>
          </Space>
          {isRestaurant && (
            <Text type="secondary">
              Order ID: {order._id}
            </Text>
          )}
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

export default OrderCard;
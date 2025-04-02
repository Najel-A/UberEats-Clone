import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material';
import { 
  AccountCircle,
  Flag,
  Public,
  Save,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  Email,
} from '@mui/icons-material';
import { 
  fetchCustomerProfile, 
  updateCustomerProfile, 
  resetCustomerState 
} from '../../../../redux/slices/customerSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error, success } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState(true); // Toggle between view and edit modes
  const [expanded, setExpanded] = useState(true); // For collapsible section

  // Sample countries and states
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' }
  ];

  const statesByCountry = {
    US: ['California', 'New York', 'Texas'],
    CA: ['Ontario', 'Quebec', 'British Columbia'],
    UK: ['England', 'Scotland', 'Wales']
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    country: '',
    state: ''
  });

  useEffect(() => {
    dispatch(fetchCustomerProfile());
    return () => {
      dispatch(resetCustomerState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        profilePicture: profile.profilePicture || '',
        country: profile.country || '',
        state: profile.state || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country' && { state: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateCustomerProfile(formData));
    dispatch(fetchCustomerProfile()); // Fetch updated profile after successful update
    setViewMode(true); // Switch back to view mode after save
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

        {loading && !profile && <CircularProgress sx={{ my: 4 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        {profile && (
          <Paper elevation={3} sx={{ p: 4 }}>
            {/* Profile Header with Avatar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar 
                src={formData.profilePicture} 
                sx={{ width: 100, height: 100, mb: 2 }}
              >
                {!formData.profilePicture && (user ? user.charAt(0).toUpperCase() : 'U')}
              </Avatar>
              
              <Typography variant="h5" component="h2">
                {formData.name}
              </Typography>
              
              <Button
                variant="outlined"
                onClick={() => setViewMode(!viewMode)}
                sx={{ mt: 2 }}
              >
                {viewMode ? 'Edit Profile' : 'Cancel Editing'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* View Mode */}
            <Collapse in={viewMode}>
              <Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    mb: 1
                  }}
                  onClick={() => setExpanded(!expanded)}
                >
                  <Typography variant="h6">Profile Details</Typography>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </Box>

                <Collapse in={expanded}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AccountCircle />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Name" 
                        secondary={formData.name || 'Not provided'} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={formData.email || 'Not provided'} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Public />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Country" 
                        secondary={formData.country 
                          ? countries.find(c => c.code === formData.country)?.name 
                          : 'Not provided'} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Flag />
                      </ListItemIcon>
                      <ListItemText 
                        primary="State/Province" 
                        secondary={formData.state || 'Not provided'} 
                      />
                    </ListItem>
                  </List>
                </Collapse>
              </Box>
            </Collapse>

            {/* Edit Mode */}
            <Collapse in={!viewMode}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    label="Country"
                    startAdornment={<Public sx={{ color: 'action.active', mr: 1 }} />}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>State/Province</InputLabel>
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    label="State/Province"
                    disabled={!formData.country}
                    startAdornment={<Flag sx={{ color: 'action.active', mr: 1 }} />}
                  >
                    {formData.country && statesByCountry[formData.country]?.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ mt: 2, mb: 3 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AccountCircle />}
                  >
                    Upload New Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;
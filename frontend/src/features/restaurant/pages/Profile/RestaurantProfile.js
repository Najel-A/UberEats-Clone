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
  Grid,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  Save,
  AddPhotoAlternate,
  Schedule,
  LocationOn,
  Phone,
  Email,
  Close
} from '@mui/icons-material';
import { updateRestaurantProfile } from '../../../../redux/slices/restaurantSlice';

const RestaurantProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error, success } = useSelector((state) => state.restaurant);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    timings: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    images: [],
    cuisines: []
  });
  const [newCuisine, setNewCuisine] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        location: profile.location || {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        contactInfo: profile.contactInfo || {
          phone: '',
          email: '',
          website: ''
        },
        timings: profile.timings || {
          monday: { open: '', close: '' },
          tuesday: { open: '', close: '' },
          wednesday: { open: '', close: '' },
          thursday: { open: '', close: '' },
          friday: { open: '', close: '' },
          saturday: { open: '', close: '' },
          sunday: { open: '', close: '' }
        },
        images: profile.images || [],
        cuisines: profile.cuisines || []
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name.includes('timings.')) {
      const parts = name.split('.');
      const day = parts[1];
      const timeType = parts[2];
      setFormData(prev => ({
        ...prev,
        timings: {
          ...prev.timings,
          [day]: {
            ...prev.timings[day],
            [timeType]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      // Convert images array to the format your backend expects
      images: newImage ? [...formData.images, newImage] : formData.images
    };
    dispatch(updateRestaurantProfile(updatedData));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewImage(reader.result); // Store as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const addCuisine = () => {
    if (newCuisine.trim() && !formData.cuisines.includes(newCuisine.trim())) {
      setFormData(prev => ({
        ...prev,
        cuisines: [...prev.cuisines, newCuisine.trim()]
      }));
      setNewCuisine('');
    }
  };

  const removeCuisine = (cuisineToRemove) => {
    setFormData(prev => ({
      ...prev,
      cuisines: prev.cuisines.filter(cuisine => cuisine !== cuisineToRemove)
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Edit Restaurant Profile
        </Typography>

        {loading && <CircularProgress sx={{ my: 4 }} />}

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

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>

            {/* Images */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Restaurant Images
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {formData.images.map((img, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Avatar
                    src={img}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
                sx={{ width: 100, height: 100 }}
              >
                Add Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {imagePreview && (
                <Avatar
                  src={imagePreview}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />
              )}
            </Box>

            {/* Cuisines */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Cuisines
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add Cuisine"
                value={newCuisine}
                onChange={(e) => setNewCuisine(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button variant="outlined" onClick={addCuisine}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {formData.cuisines.map((cuisine, index) => (
                <Chip
                  key={index}
                  label={cuisine}
                  onDelete={() => removeCuisine(cuisine)}
                />
              ))}
            </Box>

            {/* Location */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Location
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="location.postalCode"
                  value={formData.location.postalCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Contact Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="contactInfo.email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  name="contactInfo.website"
                  value={formData.contactInfo.website}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Opening Hours */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Opening Hours
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {Object.entries(formData.timings).map(([day, times]) => (
                <Grid item xs={12} sm={6} key={day}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, color: 'action.active' }} />
                    <Typography sx={{ minWidth: 100 }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Typography>
                    <TextField
                      label="Open"
                      name={`timings.${day}.open`}
                      value={times.open}
                      onChange={handleChange}
                      sx={{ mr: 2, width: 100 }}
                      placeholder="09:00"
                    />
                    <TextField
                      label="Close"
                      name={`timings.${day}.close`}
                      value={times.close}
                      onChange={handleChange}
                      sx={{ width: 100 }}
                      placeholder="22:00"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RestaurantProfile;
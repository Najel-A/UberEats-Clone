import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  Save,
  AddPhotoAlternate,
  Schedule,
  LocationOn,
  Phone,
  Email,
  Close,
  Public,
  Flag
} from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { updateRestaurantProfile, fetchRestaurantProfile } from '../../../../redux/slices/restaurantSlice';

const RestaurantProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { profile, loading, error, success } = useSelector(state => state.restaurants);
  //const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    profilePicture: '',
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
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    }
  });

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

  useEffect(() => {
    dispatch(fetchRestaurantProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        profilePicture: profile.profilePicture || '',
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
        openingHours: profile.openingHours || {
          monday: { open: '', close: '' },
          tuesday: { open: '', close: '' },
          wednesday: { open: '', close: '' },
          thursday: { open: '', close: '' },
          friday: { open: '', close: '' },
          saturday: { open: '', close: '' },
          sunday: { open: '', close: '' }
        }
      });
    }
  }, [profile]);

  //console.log('formData:', formData);
  console.log('Profile Picture URL:', formData.profilePicture);
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name.includes('openingHours.')) {
      const parts = name.split('.');
      const day = parts[1];
      const timeType = parts[2];
      setFormData(prev => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: {
            ...prev.openingHours[day],
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

  const handleProfilePictureUpload = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateRestaurantProfile(formData));
    dispatch(fetchRestaurantProfile());
  };

  if (loading && !profile) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button 
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        <ArrowBack className="me-2" />
        Back to Dashboard
      </button>

      <h1 className="mb-4">Edit Restaurant Profile</h1>

      {loading && (
        <div className="spinner-border my-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-3">
          Profile updated successfully!
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="mb-4">
              <h5 className="card-title">Profile Picture</h5>
              <hr className="mb-4" />
              
              <div className="d-flex align-items-center gap-4">
                <div className="position-relative">
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                      style={{ width: '100px', height: '100px' }}
                    >
                      <span className="text-white fs-4">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'R'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="btn btn-outline-primary">
                    <AddPhotoAlternate className="me-2" />
                    {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                    />
                  </label>
                  
                  {formData.profilePicture && (
                    <button
                      type="button"
                      className="btn btn-outline-danger ms-2"
                      onClick={() => setFormData(prev => ({ ...prev, profilePicture: '' }))}
                    >
                      <Close className="me-1" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <h5 className="card-title">Basic Information</h5>
            <hr className="mb-4" />

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name">Restaurant Name</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={{ height: '100px' }}
                  />
                  <label htmlFor="description">Description</label>
                </div>
              </div>
            </div>

            {/* Location */}
            <h5 className="card-title">Location</h5>
            <hr className="mb-4" />

            <div className="row g-3 mb-4">
              <div className="col-12">
                <div className="input-group">
                  <span className="input-group-text"><LocationOn /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="location.country"
                    value={formData.location.country}
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
              </div>
              <div className="col-md-6">
                <FormControl fullWidth>
                  <InputLabel>State/Province</InputLabel>
                  <Select
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    label="State/Province"
                    disabled={!formData.location.country}
                    startAdornment={<Flag sx={{ color: 'action.active', mr: 1 }} />}
                  >
                    {formData.location.country && statesByCountry[formData.location.country]?.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Postal Code"
                  name="location.postalCode"
                  value={formData.location.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <h5 className="card-title">Contact Information</h5>
            <hr className="mb-4" />

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><Phone /></span>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone Number"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><Email /></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <input
                  type="url"
                  className="form-control"
                  placeholder="Website"
                  name="contactInfo.website"
                  value={formData.contactInfo.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Opening Hours */}
            <h5 className="card-title">Opening Hours</h5>
            <hr className="mb-4" />

            <div className="row g-3 mb-4">
              {Object.entries(formData.openingHours).map(([day, times]) => (
                <div className="col-12 col-md-6" key={day}>
                  <div className="d-flex align-items-center gap-2">
                    <Schedule className="text-muted" />
                    <span className="text-capitalize" style={{ minWidth: '100px' }}>{day}</span>
                    <input
                      type="time"
                      className="form-control"
                      placeholder="09:00"
                      name={`openingHours.${day}.open`}
                      value={times.open}
                      onChange={handleChange}
                    />
                    <input
                      type="time"
                      className="form-control"
                      placeholder="22:00"
                      name={`openingHours.${day}.close`}
                      value={times.close}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                <Save className="me-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
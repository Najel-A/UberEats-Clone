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
  Close
} from '@mui/icons-material';
import { updateRestaurantProfile, fetchRestaurantProfile, resetSuccess } from '../../../../redux/slices/restaurantSlice';

const RestaurantProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { profile, loading, error, success } = useSelector(state => state.restaurants);
  console.log(profile);

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
  console.log('Profile: ', profile);
  const [newCuisine, setNewCuisine] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurantProfile());
  }, [dispatch]);

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

  useEffect(() => {
    if (success) {
      dispatch(fetchRestaurantProfile());
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      images: newImage ? [...formData.images, newImage] : formData.images
    };
    await dispatch(updateRestaurantProfile(updatedData));
    setNewImage(null);
    setImagePreview('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewImage(reader.result);
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

  if (loading && !profile.name) {
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
            {/* Basic Information */}
            <h5 className="card-title mt-2">Basic Information</h5>
            <hr className="mb-4" />

            <div className="row g-3">
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

            {/* Images */}
            <h5 className="card-title mt-4">Restaurant Images</h5>
            <hr className="mb-4" />

            <div className="d-flex flex-wrap gap-3 mb-3">
              {formData.images.map((img, index) => (
                <div key={index} className="position-relative">
                  <img
                    src={img}
                    alt={`Restaurant ${index + 1}`}
                    className="img-thumbnail"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-1"
                    onClick={() => removeImage(index)}
                  />
                </div>
              ))}
              <label className="btn btn-outline-primary" style={{ width: '100px', height: '100px' }}>
                <AddPhotoAlternate />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Cuisines */}
            <h5 className="card-title mt-4">Cuisines</h5>
            <hr className="mb-4" />

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add Cuisine"
                value={newCuisine}
                onChange={(e) => setNewCuisine(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={addCuisine}>
                Add
              </button>
            </div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {formData.cuisines.map((cuisine, index) => (
                <span key={index} className="badge bg-secondary">
                  {cuisine}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    onClick={() => removeCuisine(cuisine)}
                  />
                </span>
              ))}
            </div>

            {/* Location */}
            <h5 className="card-title mt-4">Location</h5>
            <hr className="mb-4" />

            <div className="row g-3">
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="State/Province"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                />
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
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <h5 className="card-title mt-4">Contact Information</h5>
            <hr className="mb-4" />

            <div className="row g-3">
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
            <h5 className="card-title mt-4">Opening Hours</h5>
            <hr className="mb-4" />

            <div className="row g-3">
              {Object.entries(formData.timings).map(([day, times]) => (
                <div className="col-12 col-md-6" key={day}>
                  <div className="d-flex align-items-center gap-2">
                    <Schedule className="text-muted" />
                    <span className="text-capitalize" style={{ minWidth: '100px' }}>{day}</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="09:00"
                      name={`timings.${day}.open`}
                      value={times.open}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="22:00"
                      name={`timings.${day}.close`}
                      value={times.close}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end mt-4">
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
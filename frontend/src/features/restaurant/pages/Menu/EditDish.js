import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchDishDetails, 
  updateDish, 
  resetDishState 
} from '../../../../redux/slices/restaurantSlice';

const EditDish = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dishId } = useParams();
  
  const { profile, dishLoading, currentDish } = useSelector((state) => state.restaurants);
  
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    price: '',
    description: '',
    image: null,
    category: 'Main Course'
  });

  const [previewImage, setPreviewImage] = useState(null);

  const { name, ingredients, price, description, category } = formData;
  console.log(dishId, profile);
  // Load dish data when component mounts
  useEffect(() => {
    if (dishId && profile) {
      dispatch(fetchDishDetails({ profile, dishId }));
    }
  }, [dishId, profile, dispatch]);

  // Set form data when currentDish is loaded
  useEffect(() => {
    if (currentDish) {
      setFormData({
        name: currentDish.name,
        ingredients: Array.isArray(currentDish.ingredients) 
          ? currentDish.ingredients.join(', ') 
          : currentDish.ingredients || '',
        price: currentDish.price,
        description: currentDish.description || '',
        image: currentDish.image || null,
        category: currentDish.category || 'Main Course'
      });
      
      // Set preview image if it exists
      if (currentDish.image) {
        setPreviewImage(
          currentDish.image.startsWith('http') 
            ? currentDish.image 
            : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${currentDish.image}`
        );
      }
    }
  }, [currentDish]);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object for file upload
    const dishFormData = new FormData();
    dishFormData.append('name', name);
    dishFormData.append('ingredients', ingredients);
    dishFormData.append('price', parseFloat(price));
    dishFormData.append('description', description);
    dishFormData.append('category', category);
    if (formData.image && typeof formData.image !== 'string') {
      dishFormData.append('image', formData.image);
    }
    
    dispatch(updateDish({ 
      dishData: dishFormData, 
      profile, 
      dishId 
    }))
      .unwrap()
      .then(() => {
        navigate(`/restaurant/menu`);
      })
      .catch((error) => {
        // Error handling is done in the reducer
      });
  };

  // Reset dish state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetDishState());
    };
  }, [dispatch]);

  if (!currentDish) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body text-center">
                {dishLoading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <p>Loading dish details...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-primary text-center mb-4">Edit Dish</h1>
              <button 
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Dish Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Ingredients (comma separated)"
                    name="ingredients"
                    value={ingredients}
                    onChange={onChange}
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={price}
                    onChange={onChange}
                    required
                    min="0"
                    step="0.01"
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    placeholder="Description"
                    name="description"
                    value={description}
                    onChange={onChange}
                    className="form-control form-control-lg"
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image-upload" className="form-label">Dish Image</label>
                  <input
                    type="file"
                    id="image-upload"
                    name="image"
                    accept="image/*"
                    onChange={onImageChange}
                    className="form-control form-control-lg"
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }}
                      />
                      <p className="text-muted mt-1">Current image preview</p>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <select
                    name="category"
                    value={category}
                    onChange={onChange}
                    className="form-select form-select-lg"
                    required
                  >
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drink">Drink</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={dishLoading}
                  >
                    {dishLoading ? 'Updating...' : 'Update Dish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDish;
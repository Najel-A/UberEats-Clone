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
  const { restaurantId, dishId } = useParams();
  
  const { 
    dishLoading, 
    success, 
    currentDish,
    menu 
  } = useSelector((state) => state.restaurants);
  
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    price: '',
    description: '',
    image: '',
    category: 'Main Course'
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const { name, ingredients, price, description, image, category } = formData;

  // Load dish data when component mounts
  useEffect(() => {
    if (dishId && restaurantId) {
      dispatch(fetchDishDetails({ restaurantId, dishId }));
    }
  }, [dishId, restaurantId, dispatch]);

  // Set form data when currentDish is loaded
  useEffect(() => {
    if (dishId) {
      setFormData({
        name: dishId.name,
        ingredients: dishId.ingredients || '',
        price: dishId.price,
        description: dishId.description || '',
        image: dishId.image || '',
        category: dishId.category
      });
      setOriginalData(dishId);
    }
  }, [currentDish, dishId]);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmUpdate = () => {
    const dishData = {
      ...formData,
      price: parseFloat(price)
    };
    
    dispatch(updateDish({ restaurantId, dishId, dishData }))
      .unwrap()
      .then(() => {
        navigate(`/restaurant/menu`);
      })
      .catch((error) => {
        setShowConfirmation(false);
      });
  };

  const cancelUpdate = () => {
    setShowConfirmation(false);
  };

  // Reset dish state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetDishState());
    };
  }, [dispatch]);

  // Calculate changes
  const getChanges = () => {
    if (!originalData) return [];
    
    const changes = [];
    const fields = ['name', 'ingredients', 'price', 'description', 'image', 'category'];
    
    fields.forEach(field => {
      const originalValue = originalData[field] || '';
      const newValue = formData[field];
      
      if (originalValue !== newValue) {
        changes.push({
          field,
          original: originalValue,
          new: newValue
        });
      }
    });
    
    return changes;
  };

  const changes = getChanges();
//   console.log('Current Dish:', currentDish);
//   console.log('Current Dish id:', currentDish?._id);
//   console.log('Dish Id:', dishId);
  console.log('Original Data:', originalData);

  if (!dishId) {
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
              
              {showConfirmation ? (
                <div className="confirmation-modal">
                  <h4 className="mb-4">Confirm Changes</h4>
                  {changes.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <h5>Changes to be made:</h5>
                        <ul className="list-group">
                          {changes.map((change, index) => (
                            <li key={index} className="list-group-item">
                              <strong>{change.field}:</strong><br />
                              <span className="text-danger text-decoration-line-through">
                                {change.original}
                              </span>
                              {' → '}
                              <span className="text-success">
                                {change.new}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="d-flex justify-content-between">
                        <button
                          onClick={cancelUpdate}
                          className="btn btn-outline-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmUpdate}
                          className="btn btn-primary"
                          disabled={dishLoading}
                        >
                          {dishLoading ? 'Updating...' : 'Confirm Changes'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-info">
                      No changes detected.
                      <button
                        onClick={cancelUpdate}
                        className="btn btn-sm btn-outline-info ms-3"
                      >
                        Back to editing
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Dish Name</label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={onChange}
                      required
                      className="form-control form-control-lg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ingredients</label>
                    <input
                      type="text"
                      placeholder="Comma separated ingredients"
                      name="ingredients"
                      value={ingredients}
                      onChange={onChange}
                      className="form-control form-control-lg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
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
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={description}
                      onChange={onChange}
                      className="form-control form-control-lg"
                      rows="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={image}
                      onChange={onChange}
                      className="form-control form-control-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Category</label>
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
                    >
                      Review Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDish;
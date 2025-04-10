import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createDish, resetDishState } from '../../../../redux/slices/restaurantSlice';

const NewDish = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  
  const { dishLoading, success } = useSelector((state) => state.restaurants);
  
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    price: '',
    description: '',
    image: '',
    category: 'Main Course'
  });

  const { name, ingredients, price, description, image, category } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Convert price to number
    const dishData = {
      ...formData,
      price: parseFloat(price)
    };
    
    dispatch(createDish({ dishData, restaurantId }))
      .unwrap()
      .then(() => {
        navigate(`/restaurant/menu`);
      })
      .catch((error) => {
        // Error handling is done in the reducer
      });
  };

  // Reset dish state when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(resetDishState());
    };
  }, [dispatch]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-primary text-center mb-4">Add New Dish</h1>
              <button 
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <form onSubmit={onSubmit}>
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
                  <input
                    type="text"
                    placeholder="Image URL"
                    name="image"
                    value={image}
                    onChange={onChange}
                    className="form-control form-control-lg"
                  />
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
                    {dishLoading ? 'Creating...' : 'Create Dish'}
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

export default NewDish;
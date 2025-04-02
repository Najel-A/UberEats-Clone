import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./slices/authSlice";
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';
import customerReducer from './slices/customerSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurants: restaurantReducer,
  cart: cartReducer,
  customer: customerReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

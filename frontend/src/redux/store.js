import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./slices/authSlice";
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurants: restaurantReducer,
  cart: cartReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

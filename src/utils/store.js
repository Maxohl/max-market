// store.js

import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './Reducers/authReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers if you have more
  },
});

// Log the Redux store configuration whenever the state changes
store.subscribe(() => {
  console.log('Redux store configuration updated:', store.getState());
});

export default store;

// reducers/authReducer.js

const initialState = {
    isAuthenticated: false,
    token: null,
    // Add more authentication-related state here if needed
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          isAuthenticated: true,
          token: action.payload.token,
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          token: null,
        };
      // Add more cases as needed
      default:
        return state;
    }
  };
  
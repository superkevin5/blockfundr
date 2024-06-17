import { combineReducers } from '@reduxjs/toolkit';
// Import your slice reducers here
// import userReducer from './userSlice';

const rootReducer = combineReducers({
    // Add your slice reducers here
    // user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

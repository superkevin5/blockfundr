import { combineReducers } from '@reduxjs/toolkit';
import {fundingReducer, projectReducer, web3Reducer} from "@/redux/reducers/mainReducers";
// Import your slice reducers here
// import userReducer from './userSlice';


const rootReducer = combineReducers({
    // Add your slice reducers here
    // user: userReducer,
    web3: web3Reducer,
    funding: fundingReducer,
    project: projectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

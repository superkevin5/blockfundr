import { combineReducers } from "redux";

const initialState = {};

import {
    CROWD_FUNDING_CONTRACT_LOADED, INCREASE_PROGRESS, NEW_PROJECT_CONTRACT_LOADED, NEW_PROJECT_LOADED,
    PROJECT_CONTRACTS_LOADED, PROJECTS_LOADED, USER_LOADED,
    WALLET_ADDRESS_LOADED,
    WEB3_LOADED,
    WITHDRAW_BALANCE
} from "@/types";
import {weiToEther} from "@/utils/common";

//@ts-ignore
export const web3Reducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case USER_LOADED:
            return {
                ...state,
                user: action.payload,
            };
        case WEB3_LOADED:
            return {
                ...state,
                connection: action.payload,
            };
        case WALLET_ADDRESS_LOADED:
            return {
                ...state,
                account: action.payload,
            };
        default:
            return state;
    }
};

//@ts-ignore
export const fundingReducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case CROWD_FUNDING_CONTRACT_LOADED:
            return {
                ...state,
                contract: action.payload,
            };
        default:
            return state;
    }
};
//@ts-ignore
export const projectReducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case PROJECT_CONTRACTS_LOADED:
            return {
                ...state,
                projectContracts: action.payload,
            };
        case PROJECTS_LOADED:
            return {
                ...state,
                projects: action.payload,
            };
        case NEW_PROJECT_CONTRACT_LOADED:
            return {
                ...state,
                //@ts-ignore
                projectContracts: [...state.projectContracts,action.payload],
            };
        case NEW_PROJECT_LOADED:
            return {
                ...state,
                //@ts-ignore
                projects: [...state.projects,action.payload],
            };
        case INCREASE_PROGRESS:
            const {projectId,amount} = action.payload;
            //@ts-ignore
            var updatedState = state.projects.map(data=>{
                if(data.address === projectId){
                    data["progress"]=Math.round(((Number(data.currentAmount)+Number(weiToEther(amount)))/Number(data.goalAmount))*100)
                }
                return data
            })
            return {
                ...state,
                projects: updatedState,
            };
        case WITHDRAW_BALANCE:
            const {contractAddress,withdrawAmount} = action.payload;
            //@ts-ignore
            var updatedState = state.projects.map(data=>{
                if(data.address === contractAddress){
                    data["contractBalance"]=(Number(data.contractBalance)-Number(withdrawAmount))
                }
                return data
            })
            return {
                ...state,
                projects: updatedState,
            };
        default:
            return state;
    }
};


export default combineReducers({
    web3Reducer,
    fundingReducer,
    projectReducer
});
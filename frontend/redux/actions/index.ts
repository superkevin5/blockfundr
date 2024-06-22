// Web3 actions


import {
    CROWD_FUNDING_CONTRACT_LOADED, INCREASE_PROGRESS, NEW_PROJECT_CONTRACT_LOADED, NEW_PROJECT_LOADED,
    PROJECT_CONTRACTS_LOADED,
    PROJECTS_LOADED, USER_LOADED,
    WALLET_ADDRESS_LOADED,
    WEB3_LOADED, WEB3_PROVIDER_LOADED, WITHDRAW_BALANCE
} from "@/types";

export const web3Loaded = (web3: any) => {
    return {
        type: WEB3_LOADED,
        payload: web3
    }
}

export const walletAddressLoaded = (address: any) => {
    return {
        type: WALLET_ADDRESS_LOADED,
        payload: address
    }
}

export const userLoaded = (user: any) => {
    return {
        type: USER_LOADED,
        payload: user
    }
}




// Crowd funding actions
export const web3ProviderLoaded = (provider: any) => ({
    type: WEB3_PROVIDER_LOADED,
    payload: provider
});

export const crowdFundingContractLoaded = (contract: any) => {
    return {
        type: CROWD_FUNDING_CONTRACT_LOADED,
        payload: contract
    }
}

// Project actions

export const projectContractsLoaded = (contracts: any) => {
    return {
        type: PROJECT_CONTRACTS_LOADED,
        payload: contracts
    }
}

export const projectsLoaded = (projects: any) => {
    return {
        type: PROJECTS_LOADED,
        payload: projects
    }
}

export const newProjectContractsLoaded = (contract: any) => {
    return {
        type: NEW_PROJECT_CONTRACT_LOADED,
        payload: contract
    }
}

export const newProjectsLoaded = (project: any) => {
    return {
        type: NEW_PROJECT_LOADED,
        payload: project
    }
}

export const amountContributor = (data: any) => {
    return {
        type: INCREASE_PROGRESS,
        payload: data
    }
}

export const withdrawContractBalance = (data: any) => {
    return {
        type: WITHDRAW_BALANCE,
        payload: data
    }
}

import {GET_USER_BY_WALLET, SAVE_USER} from "@/requests/queries";
import _ from 'lodash'
export const saveOrFetchUser = async (client:any, walletAddress:any) => {
    try {
        const { data } = await client.query({
            query: GET_USER_BY_WALLET,
            variables: { wallet_address: walletAddress },
            fetchPolicy: 'network-only'
        });
        if (_.isEmpty(_.get(data, 'allUsers.nodes'))) {
            const d = await client.mutate({
                mutation: SAVE_USER,
                variables: { wallet_address: walletAddress }
            });
            return _.get(d, 'createUser.user')
        } else {
            return _.get(data, 'allUsers.nodes')[0]
        }
    } catch (error) {
        console.error("Error saving or fetching user:", error);
    }
};

export async function isAuthChecked() {

    try {
        // Send request to backend to check authentication
        const response = await fetch(process.env.apiRoot + '/api/protected', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            // Authentication cookie is valid, return true
            const responseData = await response.json();
            return responseData.user;
        } else {
            // Authentication cookie is not valid, return false
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

export async function login( walletAddress: String) {
    return fetch(process.env.apiRoot + '/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
    });
}

export async function logout() {
    return fetch(process.env.apiRoot + '/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
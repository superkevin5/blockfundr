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
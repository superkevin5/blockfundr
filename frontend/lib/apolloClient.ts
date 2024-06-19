// lib/apolloClient.js

import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {userLoaded, walletAddressLoaded} from "@/redux/actions";
import store from "@/redux/store";

let apolloClient:any;



// HTTP link for connecting to the GraphQL server

// Combine the links

function createApolloClient(router: any, store: any) {
// Create a custom Apollo Link to log responses
    const responseInterceptor = new ApolloLink((operation, forward) => {

        return forward(operation).map((response) => {
            // Intercept and log the response
            console.info('GraphQL Response:', response);
            // Perform other operations on the response if needed
            return response;
        });
    });


    // Error handling link
    const errorLink = onError(({ graphQLErrors, networkError }) => {

        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path, extensions }) => {
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    );

                    // Check for 401 Unauthorized status code
                    if (extensions?.code === 'UNAUTHENTICATED') {
                        alert('expired, please re-login')
                        store.dispatch(walletAddressLoaded(null)); // Dispatch the action
                        store.dispatch(userLoaded(null)); // Dispatch the action
                        router.push('/');
                    }
                }
            );
        }

        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
            // @ts-ignore
            if (networkError.statusCode === 401) {
                alert('expired, please re-login')
                store.dispatch(walletAddressLoaded(null)); // Dispatch the action
                store.dispatch(userLoaded(null));
                router.push('/');
            }
        }
    });


    const httpLink = new HttpLink({
        uri: `${process.env.apiRoot}/api/graphql`,
        credentials: 'include', // Include credentials with each request
    });


    const link = from([responseInterceptor, errorLink, httpLink]);


    return new ApolloClient({
        link: link,
        uri: `${process.env.apiRoot}/api/graphql`, // Your GraphQL endpoint
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = null, router: any, store:any) {
    const _apolloClient = apolloClient ?? createApolloClient(router, store);

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

// @ts-ignore
export function useApollo(initialState, router, store) {
    const apolloStore = useMemo(() => initializeApollo(initialState, router, store), [initialState]);
    return apolloStore;
}

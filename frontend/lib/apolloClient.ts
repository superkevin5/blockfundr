// lib/apolloClient.js

import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

let apolloClient:any;



// HTTP link for connecting to the GraphQL server

// Combine the links

function createApolloClient(router: any) {
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
                        alert('用户session 过期了， 请重新登陆')
                        router.push('/login');
                    }
                }

            );
        }

        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
            // @ts-ignore
            if (networkError.statusCode === 401) {
                alert('用户session 过期了， 请重新登陆')
                router.push('/login');
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

export function initializeApollo(initialState = null, router: any) {
    const _apolloClient = apolloClient ?? createApolloClient(router);

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
export function useApollo(initialState, router) {
    const store = useMemo(() => initializeApollo(initialState, router), [initialState]);
    return store;
}

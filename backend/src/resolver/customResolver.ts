import {gql, makeExtendSchemaPlugin} from "graphile-utils";
import {getPoolInstance} from "../db";
import _ from 'lodash'
import db from "../knex";

// Define custom GraphQL schema extension
const customSchemaExtension = `
  type CustomType {
    id: Int!
    name: String!
    description: String
  }


  extend type Mutation {
    customMutation(name: String!, description: String): CustomType
     }
  
    extend type Query {
    customQuery: CustomType
  }
`;

// Define custom resolvers for the custom queries and mutations
const customResolvers = {
    Query: {
        customQuery: () => {
            // Your custom logic here
            return {id: 1, name: "Custom Item", description: "This is a custom item."};
        },
    },
};

// Create a schema extension plugin
// eslint-disable-line
// @ts-ignore
export const customSchemaPlugin = makeExtendSchemaPlugin(build => { // eslint-disable-line
    try {
        const typeDefs = gql`${customSchemaExtension}`; // Use tagged template literal
        return {
            typeDefs,
            resolvers: customResolvers,
        };
    } catch (error) {
        console.error("Error creating schema extension plugin:", error);
        throw error;
    }
});

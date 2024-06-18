import gql from "graphql-tag";


export const GET_USER_BY_WALLET = gql`
 query GetUserByWalletAddress($wallet_address: String!) {
    allUsers(condition:{walletAddress: $wallet_address}) {
     nodes{
       id
       walletAddress
    }
    }
  }
`;

export const SAVE_USER = gql`
  mutation CreateUser($wallet_address: String!) {
    createUser(input: { user: { walletAddress: $wallet_address } }) {
      user {
        id
        walletAddress
      }
    }
  }
`;
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



export const GET_PROJECT_DETAILS = gql`
 query GetProjectsByFundRaiser($fundRaiserId: Int!) {
  allProjects(condition: { fundRaiserId: $fundRaiserId }) {
    nodes {
      id
      title
      description
      goal
      deadline
      isReachGoal
      isClosed
      videoUrl
      createdAt
      updatedAt
      fundRaiserId
      userByFundRaiserId{
        id
        walletAddress
      }
    }
  }
}
`;

export const UPLOAD_VIDEO = gql`
  mutation UploadVideo($projectId: Int!, $video: Upload!) {
    uploadVideo(projectId: $projectId, video: $video) {
      success
      message
    }
  }
`;


export const GET_PROJECT_BY_FUNDRAISER_ID = gql`
   query GetProjectByFundRaiserId($fundRaiserId: Int!) {
    allProjects(condition:{fundRaiserId: $fundRaiserId} ) {
     nodes{
       id
      title
      description
      goal
      deadline
      videoUrl
    }
    }
  }
`;
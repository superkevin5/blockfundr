import gql from "graphql-tag";

export const ADD_PROJECT_MUTATION = gql`
     mutation AddProject($title: String!, $description: String, $goal: BigFloat!, $deadline: Datetime!, $videoUrl: String, $fundRaiserId: Int) {
    createProject(input: {
      project: {
      title: $title,
      description: $description,
      goal: $goal,
      deadline: $deadline,
      videoUrl: $videoUrl,
      fundRaiserId: $fundRaiserId
      }
    }) {
       project {
         id
       }
      clientMutationId
    }
  }
`;
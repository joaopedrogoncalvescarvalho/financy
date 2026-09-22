import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      fullname
      email
      role
      createdAt
      updatedAt
    }
  }
`;

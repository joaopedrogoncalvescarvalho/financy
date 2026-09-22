import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      refreshToken
      user {
        id
        fullname
        email
        role
        createdAt
        updatedAt
      }
    }
  }
`;

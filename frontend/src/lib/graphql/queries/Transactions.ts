import { gql } from "@apollo/client";

export const LIST_TRANSACTIONS = gql`
  query ListTransactions {
    listTransactions {
      id
      description
      type
      value
      date
      categoryId
      userId
      createdAt
      updatedAt
      category {
        id
        title
        color
        icon
      }
    }
  }
`;

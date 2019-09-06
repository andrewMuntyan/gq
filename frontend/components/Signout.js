import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import { CURRENT_USER_QUERY } from './User';

export const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = () => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signoutmutation => (
      <button
        type="button"
        onClick={async () => {
          await signoutmutation();
          Router.push({
            pathname: '/'
          });
        }}
      >
        Sign Out
      </button>
    )}
  </Mutation>
);

export default Signout;

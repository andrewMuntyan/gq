import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';

import Form from './styles/Form';

import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

function Reset(props) {
  const { resetToken } = props;

  const [state, setState] = useState({
    password: '',
    confirmPassword: ''
  });
  const handleChange = useCallback(
    e => {
      const { value, name } = e.target;
      setState({
        ...state,
        [name]: value
      });
    },
    [setState, state]
  );
  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{ ...state, resetToken }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(resetMutation, { loading, error }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await resetMutation();
              // setState({
              //   password: '',
              //   confirmPassword: ''
              // });
              Router.push({
                pathname: '/me'
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Pasword</h2>
              <Error error={error} />
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  value={state.password}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Pasword
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="confirmPassword"
                  value={state.confirmPassword}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Reset Password</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
}

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired
};

export default Reset;

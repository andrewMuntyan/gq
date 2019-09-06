import React, { useState, useCallback } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

function Signin() {
  const [state, setState] = useState({
    email: '',
    password: ''
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
      mutation={SIGNIN_MUTATION}
      variables={{ ...state }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signinMutation, { loading, error }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signinMutation();
              setState({
                email: '',
                password: ''
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign into Your Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                email
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
                  value={state.email}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="password">
                password
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  value={state.password}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Sign In</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
}

export default Signin;

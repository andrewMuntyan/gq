import React, { useState, useCallback } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';

import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

function Signup() {
  const [state, setState] = useState({
    email: '',
    password: '',
    name: ''
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
      mutation={SIGNUP_MUTATION}
      variables={{ ...state }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signupMutation, { loading, error }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signupMutation();
              const {
                router: { route }
              } = Router;
              if (route === '/signup') {
                Router.push({
                  pathname: '/me'
                });
              } else {
                setState({
                  email: '',
                  password: '',
                  name: ''
                });
              }
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for An Account</h2>
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
              <label htmlFor="name">
                name
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="name"
                  value={state.name}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Sign Up</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
}

export default Signup;

import React, { useState, useCallback } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

function RequestReset() {
  const [state, setState] = useState({
    email: ''
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
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ ...state }}>
      {(requestResetMutation, { loading, error, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await requestResetMutation();
              setState({
                email: ''
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link</p>
              )}
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
              <button type="submit">Request Reset</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
}

export default RequestReset;

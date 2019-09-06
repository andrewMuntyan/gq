import React from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';

import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const PleaseSignIn = props => {
  const { children } = props;
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        const { me } = data;

        if (loading) {
          return <p>Loading...</p>;
        }

        if (!me) {
          return (
            <>
              <p>Please Sign In before Continuing</p>
              <Signin />
            </>
          );
        }
        return children;
      }}
    </Query>
  );
};

PleaseSignIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default PleaseSignIn;

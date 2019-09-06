import React from 'react';
import PropTypes from 'prop-types';

import Reset from '../components/Reset';

const ResetPage = props => {
  const {
    query: { resetToken }
  } = props;
  return <Reset resetToken={resetToken} />;
};

ResetPage.propTypes = {
  query: PropTypes.shape({
    resetToken: PropTypes.string.isRequired
  }).isRequired
};

export default ResetPage;

import React from 'react';
import PropTypes from 'prop-types';

import Items from '../components/Items';

const index = props => {
  const {
    query: { page = 1 }
  } = props;
  return (
    <div>
      <Items page={parseInt(page, 10)} />
    </div>
  );
};

index.propTypes = {
  query: PropTypes.shape({
    page: PropTypes.string
  }).isRequired
};

export default index;

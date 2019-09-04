import React from 'react';
import PropTypes from 'prop-types';

import SingleItem from '../components/SingleItem';

function itemPage(props) {
  const {
    query: { id }
  } = props;
  return (
    <div>
      <SingleItem id={id} />
    </div>
  );
}

itemPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default itemPage;

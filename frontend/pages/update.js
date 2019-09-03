import React from 'react';
import PropTypes from 'prop-types';

import UpdateItem from '../components/UpdateItem';

const UpdateItemPage = ({ query: { id } }) => <UpdateItem id={id} />;

UpdateItemPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default UpdateItemPage;

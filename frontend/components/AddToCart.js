import React from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_TO_CART = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

const AddToCart = ({ id }) => {
  console.log('------');
  console.log('id');
  console.log(id);
  console.log('------');

  return (
    <Mutation mutation={ADD_TO_CART} variables={{ id }}>
      {addToCartMutation => {
        return (
          <button type="button" onClick={addToCartMutation}>
            Add To Cart 🛒
          </button>
        );
      }}
    </Mutation>
  );
};

AddToCart.propTypes = {
  id: PropTypes.string.isRequired
};

export default AddToCart;

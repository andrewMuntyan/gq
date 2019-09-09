import React from 'react';

import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import Button from './styles/Button';

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {toggleCartMutation => {
        return (
          <Query query={LOCAL_STATE_QUERY}>
            {({ data: { cartOpen } }) => {
              return (
                <CartStyles open={cartOpen}>
                  <header>
                    <CloseButton onClick={toggleCartMutation}>
                      &times;
                    </CloseButton>
                    <Supreme>Your Cart</Supreme>
                    <p>You have __ Items in your Cart</p>
                    <footer>
                      <p>$10.10</p>
                      <Button>Checkout</Button>
                    </footer>
                  </header>
                </CartStyles>
              );
            }}
          </Query>
        );
      }}
    </Mutation>
  );
};

export default Cart;

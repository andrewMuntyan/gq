import React from 'react';

import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import Button from './styles/Button';
import User from './User';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

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
    <User>
      {({ data: { me } }) => {
        if (!me) {
          return null;
        }
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
                          <Supreme>{me.name}&apos;s Cart</Supreme>
                          <p>
                            You have {me.cart.length} Item
                            {me.cart.length === 1 ? '' : 's'} in your Cart
                          </p>
                        </header>
                        <ul>
                          {me.cart.map(cartItem => (
                            <CartItem key={cartItem.id} cartItem={cartItem} />
                          ))}
                        </ul>
                        <footer>
                          <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                          <Button>Checkout</Button>
                        </footer>
                      </CartStyles>
                    );
                  }}
                </Query>
              );
            }}
          </Mutation>
        );
      }}
    </User>
  );
};

export default Cart;

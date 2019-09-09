import React from 'react';
import Link from 'next/link';

import { Mutation } from 'react-apollo';

import User from './User';
import NavStyles from './styles/NavStyles';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        {me && (
          <Link href="/me">
            <a>{me.name}</a>
          </Link>
        )}
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            {/* <Link href="/me">
              <a>Account</a>
            </Link> */}
            <Signout href="/">
              <a>Sign Out</a>
            </Signout>
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCartMutation => {
                return (
                  <button type="button" onClick={toggleCartMutation}>
                    Cart
                  </button>
                );
              }}
            </Mutation>
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;

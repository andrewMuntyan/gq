import React from 'react';
import Link from 'next/link';

import User from './User';

import NavStyles from './styles/NavStyles';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        {me && <a>{me.name}</a>}
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
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Link href="/">
              <a>Sign Out</a>
            </Link>
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

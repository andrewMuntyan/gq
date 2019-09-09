import React from 'react';
import PropTypes from 'prop-types';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import Button from './styles/Button';

const Cart = ({ open }) => {
  return (
    <CartStyles open={open}>
      <header>
        <CloseButton>&times;</CloseButton>
        <Supreme>Your Cart</Supreme>
        <p>You have __ Items in your Cart</p>
        <footer>
          <p>$10.10</p>
          <Button>Checkout</Button>
        </footer>
      </header>
    </CartStyles>
  );
};

Cart.propTypes = {
  open: PropTypes.bool.isRequired
};

export default Cart;

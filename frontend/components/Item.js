import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
// eslint-disable-next-line import/no-cycle
import DeleteItem from './DeleteItem';

import formatMoney from '../lib/formatMoney';
import AddToCart from './AddToCart';

function Item({ item }) {
  return (
    <ItemStyles>
      {item.image && <img src={item.image} alt={item.title} />}
      <Title>
        <Link
          href={{
            pathname: './item',
            query: { id: item.id }
          }}
        >
          <a>{item.title}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(item.price)}</PriceTag>
      <p>{item.description}</p>
      <div className="buttonList">
        <Link
          href={{
            pathname: 'update',
            query: { id: item.id }
          }}
        >
          <a>Edit ✏️</a>
        </Link>
        <AddToCart id={item.id} />
        <DeleteItem id={item.id}>Delete This Item</DeleteItem>
      </div>
    </ItemStyles>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
    largeImage: PropTypes.string
  }).isRequired
};

export default Item;

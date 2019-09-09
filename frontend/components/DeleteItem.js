import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// eslint-disable-next-line import/no-cycle
import { ALL_ITEMS_QUERY } from './Items';

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteButton = ({ children, id }) => {
  const update = (cache, payload) => {
    // manually update the cache on the client, so it mathces the server
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // 2. filter the deleted item out of the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // 3. Put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };
  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id }}
      update={update}
    >
      {/* {(deleteItemMutation, { loading, error }) => { */}
      {deleteItemMutation => {
        return (
          <button
            type="button"
            onClick={async () => {
              // eslint-disable-next-line no-alert,no-restricted-globals
              if (confirm('Are you sure you want to delete this item?')) {
                // eslint-disable-next-line no-alert,no-restricted-globals
                deleteItemMutation().catch(error => alert(error.message));
              }
            }}
          >
            {children}
          </button>
        );
      }}
    </Mutation>
  );
};

DeleteButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  id: PropTypes.string.isRequired
};

export default DeleteButton;

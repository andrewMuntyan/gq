import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
// import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
    }
  }
`;

function UpdateItem(props) {
  const { id: itemId } = props;
  const [state, setState] = useState({});

  const handleChange = useCallback(
    e => {
      const { name: stateKey, value, type } = e.target;

      const newState = {
        ...state,
        [stateKey]: type === 'number' ? parseFloat(value) : value
      };
      setState(newState);
    },
    [setState, state]
  );

  const updateItem = useCallback(async (e, updateItemMutation) => {
    e.preventDefault();
    return updateItemMutation();
  }, []);

  return (
    <Query
      query={SINGLE_ITEM_QUERY}
      variables={{
        id: itemId
      }}
    >
      {({ data: { item }, loading: loadingItem }) => {
        if (loadingItem) {
          return <p>Loading...</p>;
        }
        if (!item) {
          return <p>No item found for ID {itemId}</p>;
        }
        return (
          <Mutation
            mutation={UPDATE_ITEM_MUTATION}
            variables={{ ...state, id: itemId }}
          >
            {(updateItemMutation, { loading: loadingResponse, error }) => (
              <Form onSubmit={async e => updateItem(e, updateItemMutation)}>
                <Error error={error} />
                <fieldset
                  disabled={loadingResponse}
                  aria-busy={loadingResponse}
                >
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Title"
                      // required
                      defaultValue={item.title}
                      onChange={handleChange}
                    />
                  </label>

                  <label htmlFor="price">
                    Price
                    <input
                      type="number"
                      name="price"
                      id="price"
                      placeholder="Price"
                      // required
                      defaultValue={item.price}
                      onChange={handleChange}
                    />
                  </label>

                  <label htmlFor="description">
                    Description
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Enter A Description"
                      // required
                      defaultValue={item.description}
                      onChange={handleChange}
                    />
                  </label>
                  <button type="submit">
                    Sav{loadingResponse ? 'ing' : 'e'}
                  </button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired
};

export default UpdateItem;

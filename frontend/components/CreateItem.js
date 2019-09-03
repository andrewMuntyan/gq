import React, { useState, useCallback } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
// import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

function CreateItem() {
  const [state, setState] = useState({
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  });

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

  const uploadFile = useCallback(
    async e => {
      const { files } = e.target;
      if (!files.length) {
        return false;
      }
      const data = new FormData();
      data.append('file', files[0]);
      data.append('upload_preset', 'testgq');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/andriimuntian/image/upload',
        {
          method: 'POST',
          body: data
        }
      );

      const file = await res.json();

      if (!file.error) {
        setState({
          ...state,
          image: file.secure_url,
          largeImage: file.eager[0].secure_url
        });
      }
      return file;
    },
    [state, setState]
  );

  const createItem = useCallback(async (e, createItemMutation) => {
    e.preventDefault();
    const result = await createItemMutation();

    Router.push({
      pathname: '/item',
      query: {
        id: result.data.updateItem.id
      }
    });
  }, []);

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItemMutation, { loading, error }) => (
        <Form onSubmit={async e => createItem(e, createItemMutation)}>
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                name="file"
                id="file"
                placeholder="Upload an image"
                required
                onChange={uploadFile}
              />
              {state.image && <img src={state.image} alt={state.title} />}
            </label>

            <label htmlFor="title">
              Title
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                required
                value={state.title}
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
                required
                value={state.price}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="description">
              Description
              <textarea
                name="description"
                id="description"
                placeholder="Enter A Description"
                required
                value={state.description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Save</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
}

export default CreateItem;

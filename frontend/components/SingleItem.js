import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Head from 'next/head';

import Error from './ErrorMessage';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

function SingleItem(props) {
  const { id } = props;

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
      {({ error, loading, data }) => {
        const { item } = data;

        if (error) {
          return <Error error={error} />;
        }
        if (loading) {
          return <p>Loading...</p>;
        }
        if (!item) {
          return <p>No Item Found for {id}</p>;
        }

        const { title, largeImage, description } = item;
        return (
          <SingleItemStyles>
            <Head>
              <title>{title}</title>
            </Head>
            <img src={largeImage} alt={title} />
            <div className="details">
              <h2>Viewing {title}</h2>
              <p>{description}</p>
            </div>
          </SingleItemStyles>
        );
      }}
    </Query>
  );
}

SingleItem.propTypes = {
  id: PropTypes.string.isRequired
};

export default SingleItem;

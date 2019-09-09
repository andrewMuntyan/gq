import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import Button from './styles/SickButton';

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UserRow = ({ user }) => {
  const { permissions, id: userId } = user;
  const [permissionsState, setPermissionsState] = useState(permissions);

  const handlePermissionChange = useCallback(
    e => {
      const {
        target: { value, checked }
      } = e;
      let updatedPermissions = [...permissionsState];
      if (checked) {
        updatedPermissions.push(value);
      } else {
        updatedPermissions = updatedPermissions.filter(
          permission => permission !== value
        );
      }
      setPermissionsState(updatedPermissions);
    },
    [permissionsState, setPermissionsState]
  );

  const { id, name, email } = user;
  return (
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{
        permissions: permissionsState,
        userId
      }}
    >
      {(updatePermissionsMutation, { loading, error }) => (
        <>
          {error && (
            <tr>
              <td colSpan="8">
                <ErrorMessage error={error} />
              </td>
            </tr>
          )}
          <tr key={id}>
            <td>{name}</td>
            <td>{email}</td>
            {possiblePermissions.map(permission => {
              const rowId = `${id}-permission-${permission}`;
              return (
                <td key={permission + id}>
                  <label htmlFor={rowId}>
                    <input
                      type="checkbox"
                      name={`${id}-permission-${permission}`}
                      id={`${id}-permission-${permission}`}
                      checked={permissionsState.includes(permission)}
                      value={permission}
                      onChange={handlePermissionChange}
                    />
                  </label>
                </td>
              );
            })}
            <td>
              <Button onClick={updatePermissionsMutation} disabled={loading}>
                Updat{loading ? 'ing' : 'e'}
              </Button>
            </td>
          </tr>
        </>
      )}
    </Mutation>
  );
};

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    permissions: PropTypes.string.isRequired
  }).isRequired
};

const Permissions = () => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => {
        if (error && !data) {
          return <ErrorMessage error={error} />;
        }

        if (loading) {
          return <p>Loading...</p>;
        }

        return (
          <>
            <ErrorMessage error={error} />
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => (
                    <th key={permission}>{permission}</th>
                  ))}
                  <th>👇</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <UserRow user={user} />
                ))}
              </tbody>
            </Table>
          </>
        );
      }}
    </Query>
  );
};

export default Permissions;

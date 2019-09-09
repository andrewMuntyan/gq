import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid ${props => props.theme.offWhite};
  thead {
    font-size: 10px;
  }
  td,
  th {
    user-select: none;
    border-bottom: 1px solid ${props => props.theme.offWhite};
    border-right: 1px solid ${props => props.theme.offWhite};

    position: relative;
    &:last-child {
      border-right: none;
      width: 150px;
      button {
        width: 100%;
      }
    }
    label {
      padding: 10px 5px;
      display: block;
      text-align: center;
    }
  }

  tr {
    &:hover {
      background: ${props => props.theme.offWhite};
    }
    &:first-child {
      th {
        padding: 10px 5px;
      }
    }
  }
`;

export default Table;

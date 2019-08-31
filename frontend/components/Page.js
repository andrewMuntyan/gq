import React from "react";
import PropTypes from "prop-types";

import Header from "./Header";
import Meta from "./Meta";

const Page = ({ children }) => {
  return (
    <div>
      <Meta />
      <Header />
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;

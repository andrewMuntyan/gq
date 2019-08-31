import React from "react";
import Link from "next/link";

const Nav = () => (
  <div>
    <Link href="/sell">
      <a href="/sell">Sell!</a>
    </Link>
    <Link href="/">
      <a href="/">Home!</a>
    </Link>
  </div>
);

export default Nav;

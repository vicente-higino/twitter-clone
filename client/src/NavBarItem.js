import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

export function NavBarItem({ label, to, activeOnlyWhenExact }) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });
  return (
    <li>
      <Link className={match ? "active" : ""} to={to}>{label}</Link>
    </li>
  );
}

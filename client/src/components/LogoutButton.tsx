import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { API } from "../api/endpoints";
import { url, StateContext } from "../App";

const LogoutLink = styled(Link)`
  float: right;
  border: 2px solid white;
  display: block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
`;

export function LogoutButton() {
  const { state, setState } = useContext(StateContext);
  return (
    <LogoutLink
      onClick={() => {
        setState &&
          setState({ ...state, isLoggedin: false, profile: { username: "" } });
        API.logout();
      }}
      to=""
    >
      Logout
    </LogoutLink>
  );
}

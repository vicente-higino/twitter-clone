import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { API } from "../api/endpoints";
import { StateContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
const LogoutLink = styled(Link)`
  display: block;
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 1.25rem;
  padding-inline: 1rem;
`;
const FlexConteiner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export function LogoutButton() {
  const { state, setState } = useContext(StateContext);
  return (
    <FlexConteiner>
      <LogoutLink
        onClick={() => {
          setState && setState({ ...state, isLoggedin: false, profile: { username: "" } });
          API.logout();
        }}
        to=""
      >
        <FontAwesomeIcon icon={faSignOutAlt} /> Log out
      </LogoutLink>
    </FlexConteiner>
  );
}

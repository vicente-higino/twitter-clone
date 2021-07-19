import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/endpoints";
import { url, StateContext } from "../App";

export function LogoutButton() {
    const [state, setState] = useContext(StateContext);
    return (
        <Link className="logoutButton" onClick={() => {
            setState({ ...state, isLoggedIn: false, profile: {} });
            API.logout();
        }} to="">Logout</Link>
    );
}
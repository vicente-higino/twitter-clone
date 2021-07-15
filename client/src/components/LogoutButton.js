import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { url, StateContext } from "../App";

export function LogoutButton() {
    const [state, setState] = useContext(StateContext);
    return (
        <Link className="logoutButton" onClick={() => {
            setState({ ...state, isLoggedIn: false, profile: {} });
            axios.get(`${url}/logout`);
        }} to="">Logout</Link>
    );
}
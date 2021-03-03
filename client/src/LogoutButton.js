import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { url, StateContext } from "./App";

export function LogoutButton() {
    const [state, setState] = useContext(StateContext);
    return (
        <li className="logoutButton" onClick={() => {
            setState({ ...state, isLoggin: false, profile: {} });
            axios.get(url + "/logout");
        }}>
            <Link to="">Logout</Link>
        </li>
    );
}
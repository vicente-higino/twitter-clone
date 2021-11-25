import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API } from "../api/endpoints";
import { url, StateContext } from "../App";
import { useCheckIfIsLoggedIn } from "../utils";

export function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const { state, setState } = useContext(StateContext);
  let history = useHistory();
  useCheckIfIsLoggedIn();

  const login: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const body = new window.URLSearchParams(data).toString();
    axios
      .post(url + "/login", body)
      .then(async (e) => {
        const {
          data: { username },
        } = await API.getUserProfile();
        setState && setState({ ...state, isLoggedin: true, profile: { username } });
        history.push("/home");
      })
      .catch(() => {
        setData({ ...data, username: "Wrong login" });
      });
  };

  return (
    <section>
      <form action="/" method="post" onSubmit={(e) => login(e)}>
        <label>Email</label>
        <input
          type="username"
          value={data.username}
          placeholder="your email..."
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          value={data.password}
          placeholder="your password..."
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <input type="submit" value="Login" />
      </form>
    </section>
  );
}

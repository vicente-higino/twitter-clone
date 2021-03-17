import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { url, StateContext } from './App';
import { checkIfIsLoggedIn } from "./utils";

export function Login(params) {
  const [data, setData] = useState({ username: "", password: "" });
  const [state, setState] = useContext(StateContext);
  let history = useHistory();
  useEffect(async () => {
    if (await checkIfIsLoggedIn(setState, state)) history.push("/home");
  }, []);

  function login(e) {
    e.preventDefault();
    const body = new window.URLSearchParams(data).toString();
    axios.post(url + "/login", body).then(async (e) => {
      const { data: { username } } = await axios.get(url + "/profile");
      setState({ ...state, isLoggin: true, profile: { username } });
      history.push("/myprofile");
    }).catch(() => {
      setData({ ...data, username: "Wrong login" });
    });
  }

  return <section>
    <form action="/" method="post" onSubmit={(e) => login(e)}>
      <label>Email</label>
      <input type="username" value={data.username} placeholder="jon@doe.com" onChange={(e) => setData({ ...data, username: e.target.value })} />
      <label>Password</label>
      <input type="password" value={data.password} placeholder="password" onChange={(e) => setData({ ...data, password: e.target.value })} />
      <input type="submit" value="Login" />
    </form>
  </section>;
}

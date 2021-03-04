import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { url } from './App';

export function Login(params) {
  const [data, setData] = useState({ username: "", password: "" });
  let history = useHistory();
  function login(e, data, setData) {
    e.preventDefault();
    const body = new window.URLSearchParams(data).toString();
    axios.post(url + "/login", body).then((e) => {
      if (e.data === "ok") {
        history.push("/myprofile");
      }
      if (e.data === "fail") {
        setData({ ...data, username: "Wrong login" });
      }
    });
  }

  return <div className="App">
    <form action="/" method="post" onSubmit={(e) => login(e, data, setData)}>
      <label>Email</label>
      <input type="username" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
      <label>Password</label>
      <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
      <input type="submit" value="Login" />
    </form>
  </div>;
}

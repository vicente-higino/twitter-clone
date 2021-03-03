import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { url } from './App';

export function SignUp() {
  const [data, setData] = useState({ email: "", password: "", name: "" });
  let history = useHistory();
  function signup(e, data, setData) {
    e.preventDefault();
    const body = data;
    axios.post(url + "/signup", body).then((e) => {
      if (e.status == 200) {
        alert("You created a new account");
        history.push("/login");
      }

    }).catch(e => {
      if (e.response.status == 400) {
        alert("You fail to create a new account");
      }
    });
  }

  return <div className="App">
    <form action="/" method="post" onSubmit={(e) => signup(e, data, setData)}>
      <label>Name</label>
      <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
      <label>Email</label>
      <input type="username" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
      <label>Password</label>
      <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
      <input type="submit" value="Create" />
    </form>
  </div>;
}

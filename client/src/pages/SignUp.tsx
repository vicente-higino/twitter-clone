import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { url } from "../App";

type FormData = {
  email: string;
  password: string;
  name: string;
};

export function SignUp() {
  const [data, setData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });
  let history = useHistory();
  const signup = async () => {
    try {
      const { status } = await axios.post<void>(url + "/signup", data);
      if (status == 200) {
        alert("You created a new account");
        history.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          alert("You fail to create a new account");
        }
      }
    }
  };

  return (
    <section>
      <form
        action="/"
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          signup();
        }}
      >
        <label>Name</label>
        <input
          type="text"
          value={data.name}
          placeholder="Jon"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label>Email</label>
        <input
          type="username"
          value={data.email}
          placeholder="jon@doe.com"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          value={data.password}
          placeholder="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <input type="submit" value="Create" />
      </form>
    </section>
  );
}

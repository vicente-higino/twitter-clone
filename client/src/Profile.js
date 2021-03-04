import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Feed } from './Feed';
import { StateContext, url } from './App';
import { checkIfIsLoggedIn as check_if_is_LoggedIn } from "./utils";

export function Profile() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  let history = useHistory();
  useEffect(async () => {
    if (!state.isLoggin) {
      try {
        await check_if_is_LoggedIn(setState, state);
        await getPosts(setPosts);
      } catch (error) {
        errorHandler(error, history, setState);
      }
    }
    if (state.isLoggin) {
      try {
        await getPosts(setPosts);
      } catch (error) {
        errorHandler(error, history, setState);
      }
    }
  }, []);

  return <>
    {state.isLoggin && <>
      <h1>{"@" + state.profile.username}</h1>
      <section>
        <Feed posts={posts} />
      </section>
    </>}
  </>;
}

async function getPosts(setPosts) {
  const { data: { texts: posts } } = await axios.get(url + "/myposts");
  setPosts(posts);
}

function errorHandler(error, history, setState) {
  const { status } = error.response;
  if (status == 401) {
    setState({ ...state, isLoggin: false, profile: {} });
    history.push("/login");
  }
}

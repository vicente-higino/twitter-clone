import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Feed } from './Feed';
import { StateContext, url } from './App';
import { checkIfIsLoggedIn as check_if_is_LoggedIn } from "./utils"

export function PublicProfile() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState();
  let history = useHistory();
  let { username: user } = useParams();
  useEffect(async () => {
    if (!state.isLoggin) {
      try {
        await check_if_is_LoggedIn(setState, state);
        await getPosts(user, setPosts);
      } catch (error) {
        errorHandler(error, history, setMessage, setState);
      }
    }
    if (state.isLoggin) {
      try {
        await getPosts(user, setPosts);
      } catch (error) {
        errorHandler(error, history, setMessage, setState);
      }
    }
  }, []);

  return <>
    {message && <h1>{message}</h1>}
    {state.isLoggin && <Feed posts={posts} />}
  </>;
}
function errorHandler(error, history, setMessage, setState) {
  const { status } = error.response;
  if (status == 401) {
    setState({ ...state, isLoggin: false, profile: {} });
    history.push("/login");
  }
  if (status == 404)
    setMessage("User not found!");
}

async function getPosts(user, setPosts) {
  const { data: { texts: posts } } = await axios.get(url + "/profile/" + user);
  setPosts(posts);
}


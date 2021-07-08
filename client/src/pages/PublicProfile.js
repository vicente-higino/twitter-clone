import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Feed } from '../components/Feed';
import { StateContext, url } from '../App';

export function PublicProfile() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState();
  let history = useHistory();
  let { username: user } = useParams();
  useEffect(async () => {
    try {
      await getPosts(user, setPosts);
    } catch (error) {
      errorHandler(error, history, setMessage, setState, state);
    }
  }, []);

  return <>
    {message && <h1>{message}</h1>}
    {state.isLoggedIn && <section><Feed posts={posts} /></section>}
  </>;
}
function errorHandler(error, history, setMessage, setState, state) {
  const { status } = error.response;
  if (status == 401) {
    setState({ ...state, isLoggedIn: false, profile: {} });
    history.push("/login");
  }
  if (status == 404)
    setMessage("User not found!");
}

async function getPosts(user, setPosts) {
  const { data: { texts: posts } } = await axios.get(url + "/profile/" + user);
  setPosts(posts);
}


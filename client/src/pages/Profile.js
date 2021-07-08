import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Feed } from '../components/Feed';
import { StateContext, url } from '../App';

export function Profile() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  let history = useHistory();
  useEffect(async () => {
    try {
      await getPosts(setPosts);
    } catch (error) {
      errorHandler(error, history, state, setState);
    }
  }, []);

  return <>
    {state.isLoggedIn && <>
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

function errorHandler(error, history, state, setState) {
  const { status } = error.response;
  if (status == 401) {
    setState({ ...state, isLoggedIn: false, profile: {} });
    history.push("/login");
  }
}

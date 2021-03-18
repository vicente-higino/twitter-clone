import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Feed } from './Feed';
import { PostMaker } from './PostMaker';
import { StateContext, url } from './App';

export function Home() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  let history = useHistory();
  useEffect(async () => {
    try {
      await getPosts(setPosts);
    } catch (error) {
      setState({ ...state, isLoggin: false, profile: {} });
      errorHandler(error, history);
    }
  }, []);

  return <section>
    <PostMaker />
    <Feed posts={posts} />
  </section>;
}
function errorHandler(error, history) {
  const { status } = error.response;
  if (status == 401)
    history.push("/login");
}

async function getPosts(setPosts) {
  const { data: { feed: posts } } = await axios.get(url + "/feed?limit=50");
  setPosts(posts);
}


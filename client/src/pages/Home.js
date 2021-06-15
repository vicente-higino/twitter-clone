import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Feed } from '../Feed';
import { PostMaker } from '../PostMaker';
import { StateContext, url } from '../App';

export function Home() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  const { ref, inView, entry } = useInView();
  const count = useRef(1);
  let history = useHistory();
  useEffect(async () => {
    try {
      await getPosts(setPosts);
    } catch (error) {
      setState({ ...state, isLoggin: false, profile: {} });
      errorHandler(error, history);
    }
  }, []);
  useEffect(async () => {
    if (inView) {
      console.log(inView);
      await getPosts(setPosts, 50 * count.current);
      count.current++;
    }
  }, [inView])
  return <section>
    <PostMaker />
    <Feed inview={ref} posts={posts} />
  </section>;
}
function errorHandler(error, history) {
  const { status } = error.response;
  if (status == 401)
    history.push("/login");
}

async function getPosts(setPosts, offset = 0) {
  const { data: { feed: posts } } = await axios.get(url + "/feed?limit=50&offset=" + offset);
  setPosts((prev) => prev.concat(posts));
}



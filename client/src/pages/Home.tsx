import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Feed } from "../components/Feed";
import { PostMaker } from "../components/PostMaker";
import { StateContext, url } from "../App";
import { IPost } from "../api/ProfileByUsername";

export function Home() {
  const { state, setState } = useContext(StateContext);
  const [posts, setPosts] = useState<IPost[]>([]);
  const offset = useRef(0);
  let history = useHistory();
  const addPosts = (posts: IPost[]) => setPosts((prev) => prev.concat(posts));
  const insertPost = (post: IPost) => setPosts((prev) => [post, ...prev]);
  const removePost = (id: number) => setPosts((prev) => prev.filter((v) => id != v.id));
  const getPosts = async () => {
    const {
      data: { feed: posts },
    } = await axios.get<{ feed: IPost[] }>(`${url}/feed?limit=50&offset=${offset.current}`);
    addPosts(posts);
    offset.current += 50;
  };

  useEffect(() => {
    (async () => {
      try {
        await getPosts();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            setState && setState({ ...state, isLoggedin: false, profile: { username: "" } });
            history.push("/login");
          }
        }
      }
    })();
  }, []);

  return (
    <section>
      <PostMaker addPost={insertPost} />
      <Feed {...{ posts, getPosts, removePost }} />
    </section>
  );
}

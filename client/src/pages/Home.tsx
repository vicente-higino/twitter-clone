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
  const { ref, inView } = useInView();
  const offset = useRef(0);
  let history = useHistory();
  const props = { inviewRef: ref, posts };
  const getPosts = async () => {
    const {
      data: { feed: posts },
    } = await axios.get(`${url}/feed?limit=50&offset=${offset.current}`); //TODO: Add reponse type2
    setPosts((prev) => prev.concat(posts));
    offset.current += 50;
  };

  useEffect(() => {
    (async () => {
      try {
        await getPosts();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            setState &&
              setState({
                ...state,
                isLoggedin: false,
                profile: { username: "" },
              });
            history.push("/login");
          }
        }
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (inView) {
        await getPosts();
      }
    })();
  }, [inView]);

  return (
    <section>
      <PostMaker />
      <Feed {...props} />
    </section>
  );
}

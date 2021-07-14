import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Feed } from '../components/Feed';
import { StateContext, url } from '../App';
import { ProfileInfo } from "../components/ProfileInfo";

export function PublicProfile() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState();
  const [message, setMessage] = useState();
  let history = useHistory();
  let { username: user } = useParams();
  const profileProps = { profile, setProfile };
  const getPosts = async () => {
    const { data: { texts: posts, profile } } = await axios.get(url + "/profile/" + user);
    setPosts(posts);
    setProfile(profile);
  }
  useEffect(async () => {
    try {
      await getPosts();
    } catch (error) {
      errorHandler(error, history, setMessage, setState, state);
    }
  }, []);

  return <>
    {message && <h1>{message}</h1>}
    <section><ProfileInfo {...profileProps} /></section>
    <section><Feed posts={posts} /></section>
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



import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Feed } from '../components/Feed';
import { StateContext, url } from '../App';
import { ProfileInfo } from "../components/ProfileInfo";
import styled from "styled-components";
import { API } from "../api/endpoints";

export function PublicProfile() {
  const [state, setState] = useContext(StateContext);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState();
  const [message, setMessage] = useState();
  let history = useHistory();
  const location = useLocation();
  let { username } = useParams();
  const profileProps = { profile, setProfile };
  const getPosts = async () => {
    setMessage();
    setPosts([]);
    setProfile();
    try {
      const { data: { texts: posts, profile } } = await API.getProfileByUsername(username);
      setPosts(posts);
      setProfile(profile);
    } catch (error) {
      const { status } = error.response;
      if (status == 401) {
        setState({ ...state, isLoggedIn: false, profile: {} });
        history.push("/login");
      }
      if (status == 404)
        setMessage(`User '${username}' doesn't exist.`);
    }
  }
  useEffect(async () => {
    getPosts();
  }, [location]);

  return <section>
    {message && <ErrorMessage><h2>{message}</h2></ErrorMessage>}
    <ProfileInfo {...profileProps} />
    <Feed posts={posts} />
  </section>;
}

const Container = styled.div`
  background-color: #656161;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  &>h1, h2, h3, h4, h5, h6 {
    color: white;
    margin: 0;
  }
`;

function ErrorMessage({ children }) {
  return <Container>
    {children}
  </Container>
}



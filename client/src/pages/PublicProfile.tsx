import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Feed } from "../components/Feed";
import { StateContext, url } from "../App";
import { ProfileInfo } from "../components/ProfileInfo";
import styled from "styled-components";
import { API } from "../api/endpoints";
import axios from "axios";
import { Profile, IPost } from "../api/ProfileByUsername";

export function PublicProfile() {
  const { state, setState } = useContext(StateContext);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [profile, setProfile] = useState<Profile | null>();
  const [message, setMessage] = useState<string>();
  let history = useHistory();
  const location = useLocation();
  let { username } = useParams<{ username: string }>();
  const profileProps = { profile, setProfile };
  const getPosts = async () => {
    setMessage("");
    setPosts([]);
    setProfile(null);
    try {
      const {
        data: { texts: posts, profile },
      } = await API.getProfileByUsername(username);
      posts && setPosts(posts);
      setProfile(profile);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status } = error.response;
          if (status == 401) {
            setState &&
              setState({
                ...state,
                isLoggedin: false,
                profile: { username: "" },
              });
            history.push("/login");
          }
          if (status == 404) setMessage(`User '${username}' doesn't exist.`);
        }
      }
    }
  };
  useEffect(() => {
    getPosts();
  }, [location]);

  return (
    <section>
      {message && (
        <ErrorMessage>
          <h2>{message}</h2>
        </ErrorMessage>
      )}
      <ProfileInfo {...profileProps} />
      <Feed posts={posts} />
    </section>
  );
}

const Container = styled.div`
  background-color: #656161;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  & > h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: white;
    margin: 0;
  }
`;

function ErrorMessage({ children }) {
  return <Container>{children}</Container>;
}

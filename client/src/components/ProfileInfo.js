import React from "react";
import styled from 'styled-components';
import axios from "axios";
import { url } from "../App";

const H1 = styled.h1`
    color:white;
    margin:0;
`;

const Container = styled.div`
background-color:#656161;
display:flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding:1rem;

`;

const ProfileImage = styled.img`
width: 20%;
aspect-ratio: 1/1;
border-radius: 50%;
`;

const FollowButton = styled.button`
font-size: 0.7rem;
padding: 0.6em;
background: none;
color: white;
text-transform: uppercase;
border: 2px solid white;
border-radius: 5px;
&:hover{
  background:#00000025;
  cursor:pointer;
}
`;

const Span = styled.span`
color:white;
&:first-child{
  margin-right: 5px;
}
`;

const SpanDiv = styled.div`
  margin: 5px 0;
`;

export function ProfileInfo({ profile, setProfile }) {
  const handleClick = async () => {
    if (profile.following) {
      await axios.get(`${url}/profile/${profile.id}/unfollow`);
      const followers = profile.followers - 1;
      setProfile({ ...profile, followers, following: false });
    } else {
      await axios.get(`${url}/profile/${profile.id}/follow`);
      const followers = profile.followers + 1;
      setProfile({ ...profile, followers, following: true });

    }
  }
  return profile ? <Container>
    <ProfileImage src={url + profile.images[0]} />
    <H1>{`@${profile.username}`}</H1>
    <SpanDiv>
      <Span>{"Following: " + profile.follows}</Span>
      <Span>{"Followers: " + profile.followers}</Span>
    </SpanDiv>
    <FollowButton onClick={handleClick}>{profile.following ? "Unfollow" : "Follow"}</FollowButton>
  </Container> : null;
}


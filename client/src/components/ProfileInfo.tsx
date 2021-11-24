import React, { FC, useContext } from "react";
import styled from "styled-components";
import { url, StateContext } from "../App";
import { API } from "../api/endpoints";
import { Profile } from "../api/ProfileByUsername";
const Container = styled.div`
  background-color: #656161;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  & h1 {
    color: white;
    margin: 0;
  }
`;

const ProfileImage = styled.img`
  width: 6rem;
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
  &:hover {
    background: #00000025;
    cursor: pointer;
  }
`;

const Span = styled.span`
  color: #1e1e1e;
`;

const SpanDiv = styled.div`
  margin: 5px 0;
  & :not(:last-child) {
    margin-right: 5px;
  }
`;

const SpanNumber = styled.span`
  color: white;
`;

export const ProfileInfo: FC<{
  profile: Profile | null | undefined;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null | undefined>>;
}> = ({ profile, setProfile }) => {
  const { state } = useContext(StateContext);
  const handleClick = async () => {
    if (profile && setProfile) {
      if (profile.following) {
        await API.unfollowProfileById(profile.id);
        const followers = profile.followers - 1;
        setProfile({ ...profile, followers, following: false });
      } else {
        await API.followProfileById(profile.id);
        const followers = profile.followers + 1;
        setProfile({ ...profile, followers, following: true });
      }
    }
  };
  return profile ? (
    <Container>
      <ProfileImage src={url + profile.images?.at(0)} />
      <h1>{`@${profile.username}`}</h1>
      <SpanDiv>
        <SpanNumber>{profile.follows}</SpanNumber>
        <Span>{"following"}</Span>
        <SpanNumber>{profile.followers}</SpanNumber>
        <Span>{"Followers"}</Span>
      </SpanDiv>
      {state.profile?.username !== profile.username && (
        <FollowButton onClick={handleClick}>
          {profile.following ? "Unfollow" : "Follow"}
        </FollowButton>
      )}
    </Container>
  ) : null;
};

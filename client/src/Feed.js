import React from "react";
import { Link } from "react-router-dom";
import { getTimePassed } from "./utils";

export function Feed({ posts }) {
  const feed = posts.map(post => {
    return <div key={post.id} className="post">
      <h3 className="post-username"><Link className="profile-link" to={`/profile/${post.profile.username}`}>@{post.profile.username}</Link> </h3>
      <p className="post-sideTime">{getTimePassed(post.createdAt)}</p>
      <p className="post-mainText">{post.text}</p>
    </div>;
  });
  return feed;
}

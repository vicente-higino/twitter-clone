import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getTimePassed } from "./utils";
import { url, StateContext } from "./App"

export function Feed({ posts }) {
  const [state] = useContext(StateContext);
  const feed = posts.map(post => {
    return <div key={post.id} className="post">
      <div className="post-header">
        <Link className="profile-link" to={profileLink(post, state)}>
          <img className="post-profile-img" src={url + post.profile.images[0]} />
        </Link>
        <h1 className="post-username">
          <Link className="profile-link" to={profileLink(post, state)}>{"@" + post.profile.username}</Link>
        </h1>
        <p className="post-sideTime">{getTimePassed(post.createdAt)}</p>
      </div>
      {post.text && <p className="post-mainText">{post.text}</p>}
      {post?.images && <div className="image-container"><Images images={post.images}></Images></div>}
    </div>
  });
  return feed;
}
function profileLink(post, state) {
  return post.profile.username === state.profile.username ? "/myprofile" : `/profile/${post.profile.username}`;
}

function Images({ images }) {
  return images.map((image, index) => {
    if (!image) return;
    if (image.type.startsWith("image")) return <img loading="lazy" className="post-img" src={url + image.url} key={index} />
    if (image.type.startsWith("video")) return <video loading="lazy" controls loop autoPlay muted className="post-img" src={url + image.url} key={index} />
  })

}
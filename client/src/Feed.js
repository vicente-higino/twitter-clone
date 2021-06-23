import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTimePassed } from "./utils";
import { url, StateContext } from "./App"
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
export function Feed({ posts, inview }) {
  const [state] = useContext(StateContext);
  const feed = posts.map((post) => {
    return <Post inview={inview} post={post} state={state} />
  });
  return feed;
}
function Post({ post, state, inview }) {
  const [likes, setLikes] = useState({ likes: post.likes.length, liked: isLiked(post, state) });
  return <div ref={inview} key={post.id} className="post">
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
    {post?.images?.length > 0 && <Images images={post.images} />}
    <div className="post-footer">
      <p className="post-like">{likes.likes}</p>
      <button className="post-button-like" onClick={async () => {
        if (likes.liked) {
          const { data } = await axios.get(url + `/post/${post.id}/unlike`);
          setLikes({ likes: data, liked: false });
        } else {
          const { data } = await axios.get(url + `/post/${post.id}/like`);
          setLikes({ likes: data, liked: true });
        }

      }} >{likes.liked ? "unlike" : "like"}</button>
    </div>
  </div>;
}

function isLiked(post, state) {
  const { likes } = post;
  const { username } = state.profile;
  return likes.find(x => x.profile.username === username) !== undefined;
}
function profileLink(post, state) {
  return post.profile.username === state.profile.username ? "/myprofile" : `/profile/${post.profile.username}`;
}

function Images({ images }) {
  return <Carousel onClickItem={(i, item) => console.log(item)}
    autoPlay={false} infiniteLoop={true} showStatus={false} showThumbs={false} showIndicators={images.length > 1 ? true : false}>
    {
      images.map((image) => {
        return <Image key={image.url} image={image}></Image>
      })
    }
  </Carousel >

}

function Image({ image }) {
  if (!image) return;
  if (image.type.startsWith("image")) return <img loading="lazy"
    src={url + image.url} />
  if (image.type.startsWith("video")) return <video loading="lazy"
    controls muted
    src={url + image.url} />
}

function FullScrenImage({ image }) {
  return <img className="fullScreen" src={image.url} />
}

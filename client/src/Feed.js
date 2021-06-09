import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTimePassed } from "./utils";
import { url, StateContext } from "./App"
import axios from "axios";

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
    {post?.images?.length > 0 && <ImageContainer images={post.images} />}
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

function ImageContainer({ images }) {
  const imgs = useRef();
  return <div style={{ position: "relative" }}>
    <div ref={imgs} className="image-container">
      <Images images={images} />
    </div>
    {images?.length > 1 && <ImagesButtons imgs={imgs} />}
  </div>

}
function ImagesButtons({ imgs }) {
  return <>
    <div className="left-img-button img-button" onClick={(e) => {
      const activeElement = imgs.current.getElementsByClassName("img-active")[0];
      const previousElement = activeElement.previousElementSibling;
      if (previousElement) {
        activeElement.classList.remove("img-active");
        previousElement.classList.add("img-active");
      }
    }}>
      <svg width="50" height="50" className="arrow-left-white" viewBox="0 0 10 10" fill="none">
        <path d="M5 7L1 3H9L5 7Z" fill="currentColor" />
      </svg>

    </div>
    <div className="right-img-button img-button" onClick={(e) => {
      const activeElement = imgs.current.getElementsByClassName("img-active")[0];
      const nextElement = activeElement.nextElementSibling;
      if (nextElement) {
        activeElement.classList.remove("img-active");
        nextElement.classList.add("img-active");
      }
    }}><svg width="50" height="50" className="arrow-right-white" viewBox="0 0 10 10" fill="none">
        <path d="M5 7L1 3H9L5 7Z" fill="currentColor" />
      </svg></div>
  </>
}
function Images({ images }) {
  return images.map((image, index) => {
    if (!image) return;
    if (image.type.startsWith("image")) return <img loading="lazy"
      onClick={(e) => fullImg(e)}
      className={`post-img${index == 0 ? " img-active" : ""}`}
      src={url + image.url} key={image.url} />
    if (image.type.startsWith("video")) return <video loading="lazy"
      onTouchEnd={(e) => fullImg(e)}
      onClick={(e) => fullImg(e)}
      controls loop autoPlay muted
      className={`post-img${index == 0 ? " img-active" : ""}`}
      src={url + image.url} key={image.url} />
  })

}

function fullImg(e) {
  e.preventDefault();
  const img = e.target;
  const root = document.getElementsByTagName("body")[0]
  root.style.overflow = root.style.overflow === "hidden" ? "auto" : "hidden";
  img.classList.contains("full-img") ? img.classList.remove("full-img") : img.classList.add("full-img");

}

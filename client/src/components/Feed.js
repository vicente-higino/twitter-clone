import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getTimePassed, disableScroll, enableScroll } from "../utils";
import { url, StateContext } from "../App"
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const FullScreenImageContext = React.createContext();
const PostContext = React.createContext();

export function Feed({ posts, inview }) {
  const [fullScreen, setFullScreen] = useState();
  const feed = posts.map((post) => {
    return <Post key={post.id} {...{ inview, post }} />
  });
  return <FullScreenImageContext.Provider value={{ fullScreen, setFullScreen }}>
    {feed}
    {fullScreen && <FullScrenImage />}
  </FullScreenImageContext.Provider>;
}

function Post({ post, inview }) {
  return <PostContext.Provider value={post}>
    <div ref={inview} className="post">
      <PostHeader />
      <PostMainText />
      <Images />
      <PostFooter />
    </div>
  </PostContext.Provider>

}
function PostMainText() {
  const { text } = useContext(PostContext);
  return text && <p className="post-mainText">{text}</p>;
}

function PostHeader() {
  const [{ profile }] = useContext(StateContext);
  const { profile: { username, images: [profileImageUrl] }, createdAt } = useContext(PostContext);
  const profileLink = () => {
    return username === profile.username ? "/myprofile" : `/profile/${username}`;
  }
  return <div className="post-header">
    <Link className="profile-link" to={profileLink}>
      <img className="post-profile-img" src={url + profileImageUrl} />
    </Link>
    <h1 className="post-username">
      <Link className="profile-link" to={profileLink}>{`@${username}`}</Link>
    </h1>
    <p className="post-sideTime">{getTimePassed(createdAt)}</p>
  </div>;
}

function PostFooter() {
  const isLiked = () => {
    const { likes } = post;
    const { username } = state.profile;
    return likes.find(x => x.profile.username === username) !== undefined;
  }
  const handleLikes = async () => {
    if (likes.liked) {
      const { data } = await axios.get(`${url}/post/${post.id}/unlike`);
      setLikes({ likes: data, liked: false });
    } else {
      const { data } = await axios.get(`${url}/post/${post.id}/like`);
      setLikes({ likes: data, liked: true });
    }
  };
  const [state] = useContext(StateContext);
  const post = useContext(PostContext);
  const [likes, setLikes] = useState({ likes: post.likes.length, liked: isLiked() });
  return <div className="post-footer">
    <p className="post-like">{likes.likes}</p>
    <button className="post-button-like" onClick={handleLikes}>{likes.liked ? "unlike" : "like"}</button>
  </div>;
}

function Images() {
  const { setFullScreen } = useContext(FullScreenImageContext);
  const { images } = useContext(PostContext);
  const handleImageClick = (i, item) => {
    if (item.props.image.type.startsWith("video")) return;
    disableScroll();
    setFullScreen(item.props.image.url);
  };
  return images && <Carousel
    onClickItem={handleImageClick} autoPlay={false} infiniteLoop={true}
    showStatus={false} showThumbs={false} showIndicators={images.length > 1 ? true : false}>
    {
      images.map((image) => {
        return <Image key={image.url} {...{ image }} />
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

function FullScrenImage() {
  const { fullScreen, setFullScreen } = useContext(FullScreenImageContext);
  return <div className="fullScreen-container">
    <img onClick={() => { enableScroll(); setFullScreen() }} className="fullScreen" src={url + fullScreen} />
  </div>
}

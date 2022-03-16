import React, { FC, ReactElement, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTimePassed, disableScroll, enableScroll } from "../utils";
import { url, StateContext } from "../App";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { ImagesEntity, IPost } from "../api/ProfileByUsername";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faEllipsisV, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";

interface IFullScreenContext {
  fullScreenURL?: string | null;
  setFullScreenURL?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FullScreenImageContext = React.createContext<IFullScreenContext>({});

export const FullScreenImageContextProvider: FC = ({ children }) => {
  const [fullScreenURL, setFullScreenURL] = useState<string | null>(null);
  return (
    <FullScreenImageContext.Provider value={{ fullScreenURL, setFullScreenURL }}>
      {children}
    </FullScreenImageContext.Provider>
  );
};

export const Feed: FC<{
  posts: IPost[];
  getPosts?: () => Promise<void>;
  removePost?: (id: number) => void;
}> = ({ posts, getPosts, removePost }) => {
  const feed = posts.map((post, i) => {
    return <Post key={post.id} {...{ post, isLast: i == posts.length - 1, getPosts, removePost }} />;
  });
  return (
    <FullScreenImageContextProvider>
      {feed}
      <FullScrenImage />
    </FullScreenImageContextProvider>
  );
};

const Post: FC<{
  post: IPost;
  isLast: boolean;
  getPosts?: () => Promise<void>;
  removePost?: (id: number) => void;
}> = ({ post, getPosts, isLast, removePost }) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    (async () => {
      isLast && inView && getPosts && (await getPosts());
    })();
  }, [inView]);
  return (
    <div ref={ref} className="post">
      <PostHeader post={post} removePost={removePost} />
      <PostText post={post} />
      <Images post={post} />
      <PostFooter post={post} />
    </div>
  );
};

const MainText = styled.p<{ collapsed: boolean }>`
  white-space: pre-line;
  max-height: ${({ collapsed }) => (collapsed ? "150px" : "1000px")};
  overflow-y: hidden;
  word-break: break-word;
  margin: 0;
  font-size: 1.2em;
  line-height: 1.2;
  transition: max-height 0.5s ease-in;
`;

const PostText: FC<{ post: IPost }> = ({ post }) => {
  const [collapsed, setCollapsed] = useState(true);
  if (!post.text) return null;
  return (
    <MainText
      onClick={() => {
        setCollapsed((prev) => !prev);
      }}
      collapsed={collapsed}
    >
      {post.text}
    </MainText>
  );
};

const PostHeader: FC<{
  post: IPost;
  removePost?: (id: number) => void;
}> = ({ post, removePost }) => {
  const { state } = useContext(StateContext);
  const {
    id,
    profile: { username, images },
    createdAt,
  } = post;

  return (
    <div className="post-header">
      <Link className="profile-link" to={`/profile/${username}`}>
        {images && <img className="post-profile-img" src={url + images[0]} />}
      </Link>
      <h1 className="post-username">
        <Link className="profile-link" to={`/profile/${username}`}>{`@${username}`}</Link>
      </h1>
      <p className="post-sideTime">{getTimePassed(createdAt)}</p>
      {state.profile?.username == username && <PostMenuOptions id={id} removePost={removePost} />}
    </div>
  );
};

const PostMenuOptions: FC<{ id: number; removePost?: (id: number) => void }> = ({ id, removePost }) => {
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const deletePost = async () => {
    try {
      setLoading(true);
      await axios.delete(`${url}/post/${id}`);
      removePost && removePost(id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [toggle]);
  return (
    <div ref={ref} style={{ marginInlineStart: "5px", position: "relative" }}>
      <FontAwesomeIcon className="hover-pointer" icon={faEllipsisV} onClick={() => setToggle((prev) => !prev)} />
      <div
        style={{
          position: "absolute",
          display: toggle ? "inline-block" : "none",
          backgroundColor: "#4c4c4c",
          minWidth: "4rem",
          width: "max-content",
          padding: ".25rem",
          maxWidth: "90vw",
          zIndex: 5,
          inset: "70% 0px auto auto",
        }}
      >
        <button disabled={loading} onClick={deletePost}>
          Delete post <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
};

const PostFooter: FC<{
  post: IPost;
}> = ({ post }) => {
  const isLiked = () => {
    const { likes } = post;
    return likes?.find((x) => x?.profile.username === state.profile?.username) !== undefined;
  };
  const { state } = useContext(StateContext);
  const [likes, setLikes] = useState({
    likes: post?.likes?.length,
    liked: isLiked(),
  });
  const handleLikes = async () => {
    if (likes.liked) {
      const { data } = await axios.get<number>(`${url}/post/${post.id}/unlike`);
      setLikes({ likes: data, liked: false });
    } else {
      const { data } = await axios.get<number>(`${url}/post/${post.id}/like`);
      setLikes({ likes: data, liked: true });
    }
  };
  return (
    <div className="post-footer">
      <p className="post-like" onClick={handleLikes}>
        {likes.liked ? <FontAwesomeIcon icon={faHeart} color="red" /> : <FontAwesomeIcon icon={farHeart} />}
        <span> {likes.likes}</span>
      </p>
    </div>
  );
};

const Images: FC<{
  post: IPost;
}> = ({ post }) => {
  const { images } = post;
  const { setFullScreenURL } = useContext(FullScreenImageContext);
  const handleImageClick = (url: string) => {
    disableScroll();
    setFullScreenURL && setFullScreenURL(url);
    // imageRef?.current?.scrollIntoView({
    //   behavior: "smooth",
    //   block: "center",
    // });
  };
  return images ? (
    <Carousel
      onClickItem={(index, item) => {
        const img = item as ReactElement<{ image: ImagesEntity }>;
        if (img.props.image.type.startsWith("image")) handleImageClick(img.props.image.url);
      }}
      autoPlay={false}
      infiniteLoop={true}
      interval={99999999}
      showStatus={false}
      showThumbs={false}
      showIndicators={images.length > 1 ? true : false}
    >
      {images.flatMap((image) => (image ? <Image key={image.url} {...{ image }} /> : []))}
    </Carousel>
  ) : null;
};

const Image: FC<{
  image: ImagesEntity;
}> = ({ image }) => {
  if (image.type.startsWith("image")) return <img loading="lazy" src={url + image.url} />;
  if (image.type.startsWith("video")) return <video controls muted src={url + image.url} />;
  return null;
};

const FullScrenImage: FC = () => {
  const { fullScreenURL, setFullScreenURL } = useContext(FullScreenImageContext);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    imgRef?.current?.classList.add("full-opacity");
  }, [fullScreenURL]);
  if (fullScreenURL && fullScreenURL.length > 0) {
    return (
      <div
        className="fullScreen-container"
        onClick={() => {
          enableScroll();
          setFullScreenURL && setFullScreenURL(null);
        }}
      >
        <img ref={imgRef} className="fullScreen" src={url + fullScreenURL} />
      </div>
    );
  }
  return null;
};

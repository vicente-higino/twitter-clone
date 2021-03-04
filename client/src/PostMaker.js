import React from "react";
import axios from "axios";
import { url } from './App';
function makeUserPost(text) {
  axios.post(url + "/post", { text });
}
export function PostMaker(pros) {
  return <form onSubmit={(e) => { e.preventDefault(); makeUserPost(e.target[0].value); e.target[0].value = ""; window.location.reload(); }}>
    <textarea className="post-maker" name="postarea" id="post" width="100%" placeholder="Write something..." />
    <input type="submit" className="post-button" value="Post" />
  </form>;
}

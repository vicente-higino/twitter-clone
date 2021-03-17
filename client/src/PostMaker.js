import React, { useRef, useState } from "react";
import axios from "axios";
import { url } from './App';
import FileType from 'file-type/browser';
async function makeUserPost(textElement, imagesUrl) {
  const text = textElement.value;
  const images = []
  for (const imageUrl of imagesUrl) {
    if (imageUrl) {
      const { data } = await axios.post(url + "/saveimage", await imageUrl.file.arrayBuffer(), {
        headers: { 'Content-Type': 'application/octet-stream' }
      })
      images.push(data);
    }
  }
  if (images.length > 0 || text) {
    axios.post(url + "/post", { text, images });
    window.location.reload();
  }

}
export function PostMaker(pros) {
  const textRef = useRef();
  const file = useRef();
  const [text, setText] = useState();
  const [imagesUrl, setImagesUrl] = useState([]);
  return <form onSubmit={(e) => { e.preventDefault(); makeUserPost(textRef.current, imagesUrl); }}>
    <textarea className="post-maker" placeholder="Write something..." ref={textRef} value={text} onChange={(e) => { validate(setText, e.target.value) }} />
    <p className="form-text-length">{showTextLength(text)}</p>
    <input type="submit" className="post-button" value="Post" />
    <label className="select-file" htmlFor='select-file'>Select Images</label>
    <input type="file" id="select-file" ref={file} onChange={(e) => filePreview(e.target.files[0], setImagesUrl, imagesUrl)} />
    <Images imagesUrl={imagesUrl} />
  </form>;
}
function showTextLength(text) {
  return `${text ? text.length : 0}/256`;
}

async function filePreview(file, setImagesUrl, imagesUrl) {
  if (file) {
    const filePreview = window.URL.createObjectURL(file);
    const { mime } = await FileType.fromBlob(file);
    setImagesUrl([{ filePreview, file, mime }].concat(imagesUrl));
  }
}

function Images({ imagesUrl }) {
  return imagesUrl.map((image, index) => {
    if (!image) return;
    if (image.mime.startsWith("image")) return <img className="post-img" src={image.filePreview} key={index} />
    if (image.mime.startsWith("video")) return <video loop autoPlay muted className="post-img" src={image.filePreview} key={index} />
  })

}

function validate(setText, value) {
  if (value.length <= 256) {
    setText(value);
  }
}
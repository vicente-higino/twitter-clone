import React, { FC, useState, useRef } from "react";
import axios from "axios";
import { url } from "../App";
import FileType from "file-type/browser";
import core from "file-type/core";
import { IPost } from "../api/ProfileByUsername";

interface IImagesUrl {
  filePreview: string;
  file: File;
  mime: core.MimeType;
}

export const PostMaker: FC<{ setPosts: React.Dispatch<React.SetStateAction<IPost[]>> }> = ({ setPosts }) => {
  const file = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState<string>();
  const [imagesUrl, setImagesUrl] = useState<IImagesUrl[]>([]);
  const validate = (value: string) => {
    if (value.length <= 256) {
      setText(value);
    }
  };
  const filePreview = async (file: File) => {
    try {
      const filePreview = window.URL.createObjectURL(file);
      const filetype = await FileType.fromBlob(file);
      if (filetype?.mime.startsWith("image") || filetype?.mime.startsWith("video")) {
        const { mime } = filetype;
        setImagesUrl([{ filePreview, file, mime }].concat(imagesUrl));
      } else alert("Only images or videos allowed!");
    } catch (error) {
      alert("Something went wrong!");
    }
  };
  const clearForm = () => {
    setText("");
    for (const imgUrl of imagesUrl) {
      window.URL.revokeObjectURL(imgUrl.filePreview);
    }
    setImagesUrl([]);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        (async () => {
          try {
            text && (await makeUserPost(text, imagesUrl, setPosts));
            clearForm();
          } catch (error) {
            if (axios.isAxiosError(error)) {
              alert("Something went wrong");
              clearForm();
            }
          }
        })();
      }}
    >
      <textarea
        className="post-maker"
        placeholder="Write something..."
        value={text}
        onChange={(e) => {
          validate(e.target.value);
        }}
      />
      <p className="form-text-length">{`${text ? text.length : 0}/256`}</p>
      <input type="submit" className="post-button" value="Post" />
      <label className="select-file" htmlFor="select-file">
        Select Images
      </label>
      <input
        type="file"
        id="select-file"
        accept="image/*,video/*"
        ref={file}
        onChange={(e) => {
          const file = e.target.files?.item(0);
          file && filePreview(file);
        }}
      />
      <Images imagesUrl={imagesUrl} />
    </form>
  );
};
interface ISaveImageReponse {
  url: string;
  type: string;
}
async function makeUserPost(
  textElement: string,
  imagesUrl: IImagesUrl[],
  setPost: React.Dispatch<React.SetStateAction<IPost[]>>
) {
  const text = textElement;
  const images: ISaveImageReponse[] = [];
  for (const imageUrl of imagesUrl) {
    if (imageUrl) {
      const { data } = await axios.post<ISaveImageReponse>(`${url}/saveimage`, await imageUrl.file.arrayBuffer(), {
        headers: { "Content-Type": "application/octet-stream" },
      });
      images.push(data);
    }
  }
  if (images.length > 0 || text) {
    const {
      data: { post },
    } = await axios.post<{ post: IPost }>(`${url}/post`, { text, images });
    setPost((prev) => [post].concat(prev));
  }
}

const Images: FC<{ imagesUrl: IImagesUrl[] }> = ({ imagesUrl }) => {
  return (
    <div>
      {imagesUrl.flatMap((image) => {
        if (image.mime.startsWith("image"))
          return <img className="post-img" src={image.filePreview} key={image.filePreview} />;
        else if (image.mime.startsWith("video"))
          return <video loop autoPlay muted className="post-img" src={image.filePreview} key={image.filePreview} />;
        else return [];
      })}
    </div>
  );
};

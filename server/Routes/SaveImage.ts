import fs from "fs";
import path from "path";
import crypto from "crypto";
import FileType from 'file-type';
import { Handler } from "express";

export const SaveImage: Handler = async (req, res) => {
  try {
    if (!req.body.length) {
      throw new Error("No image");
    }
    const file = await FileType.fromBuffer(req.body);
    if (file) {
      const { ext, mime } = file;
      const imageBytes = await req.body;
      const name = crypto.createHash("SHA1").update(imageBytes).digest('hex');
      const fullPath = path.join("./images/", name.slice(0, 2), name.slice(2, 4));
      const imagePath = path.join(fullPath, `${name}.${ext}`);
      if (!fs.existsSync(imagePath)) {
        if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
        fs.writeFileSync(imagePath, imageBytes);
      }
      res.json({ url: `/${imagePath}`, type: mime });
    }
  } catch (error) {
    res.status(400).json({ message: "Image coud not be saved!" });
  }
}

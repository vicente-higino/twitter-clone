import fs from "fs";
import path from "path";
import crypto from "crypto";
import FileType from 'file-type';

export async function SaveImageRoute(req, res) {
  try {
    if (!req.body.length) {
      throw new Error("No image");
    }
    const { ext, mime } = await FileType.fromBuffer(req.body);
    const imageBytes = await req.body;
    const name = crypto.createHash("SHA1").update(imageBytes).digest('hex');
    const fullPath = path.join("./images/", name.substr(0, 2), name.substr(2, 2));
    const imagePath = path.join(fullPath, `${name}.${ext}`);
    if (!fs.existsSync(imagePath)) {
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      fs.writeFileSync(imagePath, imageBytes);
    }
    res.json({ url: `/${imagePath}`, type: mime });
  } catch (error) {
    res.status(400).json({ message: "Image coud not be saved!" });
  }
}

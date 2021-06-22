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
    const text = await req.body;
    const name = crypto.createHash("SHA1").update(text).digest('hex');
    const firtPart = "./images/" + name.substr(0, 2);
    const secondPart = firtPart + "/" + name.substr(2, 2) + "/";
    const imagePath = path.join(secondPart, name + "." + ext);
    if (!fs.existsSync("./images"))
      fs.mkdirSync("./images");
    if (!fs.existsSync(firtPart))
      fs.mkdirSync(firtPart);
    if (!fs.existsSync(secondPart))
      fs.mkdirSync(secondPart);
    fs.writeFileSync(imagePath, text);
    res.json({ url: "/" + imagePath, type: mime });
  } catch (error) {
    res.status(400).json({ message: "Image coud not be saved!" });
  }
}

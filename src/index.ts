import Jimp from "jimp";
import axios from "axios";

export default async function convertGifToPng(gifUrl: string, outputDir: string) {
  try {
    const gifName = gifUrl.split("/").pop();
    if (!gifName) throw new Error("Gif name is undefined. The url may be malformed.");

    // If the gifName ends in .gif, replace .gif with .png
    // Otherwise, just append .png
    let pngName: string;
    if (gifName.endsWith(".gif")) {
      pngName = gifName?.replace(".gif", ".png");
    } else {
      pngName = `${gifName}.png`;
    }

    const outputFilePath = `${outputDir}/${pngName}`;

    // Get the gif as a buffer
    const response = await axios.get(gifUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Convert the gif to a png
    const image = await Jimp.read(buffer);

    // Write the image to a file
    await image.writeAsync(outputFilePath);
    return outputFilePath;
  } catch (err) {
    console.error(`Error converting ${gifUrl} to png`, err);
    throw err;
  }
}

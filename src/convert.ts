import { unlink } from 'fs';
import Jimp from 'jimp';

export async function convertGifToPng(gifPath: string) {
  try {
    // Convert the gif to a png
    const image = await Jimp.read(gifPath);
    const pngPath = gifPath.replace('.gif', '.png');
    await image.writeAsync(pngPath);

    // Delete the gif
    unlink(gifPath, (err) => {
      if (err) throw err;
      console.log(`${gifPath} was deleted`);
    });
  } catch (err) {
    console.error(`Error converting ${gifPath} to png`, err);
    throw err;
  }
}

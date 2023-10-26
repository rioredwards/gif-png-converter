import convertGifToPng from '../src/index';
import { describe, expect, it } from '@jest/globals';
import dotenv from 'dotenv';
import axios from 'axios';
import { rmSync, rmdirSync } from 'fs';

dotenv.config();

const OUTPUT_DIRNAME = 'imageTest';
const RANDOM_GIPHY_ENDPOINT = '/v1/gifs/random';
const API_KEY: string | undefined = process.env.GIPHY_API_KEY;
const cwd = process.cwd();

type GifType = {
  data: {
    title: string;
    images: {
      downsized_medium: {
        url: string;
      };
    };
  };
};

export const fetchGif = async () => {
  const tag: string = 'cat';
  const requestUrl: string = `https://api.giphy.com${RANDOM_GIPHY_ENDPOINT}?api_key=${API_KEY}&rating=g&tag=${tag}`;

  const response = await axios.get(requestUrl);

  const gif: GifType = response.data;

  return gif;
};

beforeAll(async () => {
  rmSync(`${cwd}/${OUTPUT_DIRNAME}`, { recursive: true });
});

describe('fetchGif', () => {
  it('fetches a random gif from the giphy api', async () => {
    const gif = await fetchGif();
    expect(gif.data.title).toBeDefined();
    expect(gif.data.images.downsized_medium.url).toBeDefined();
  });
});

describe('convertGifToPng', () => {
  it('converts a gif to a png', async () => {
    const gif = await fetchGif();
    const url = gif.data.images.downsized_medium.url;
    const destDir = `${cwd}/${OUTPUT_DIRNAME}`;

    const filePath = await convertGifToPng(url, destDir);
    expect(filePath).toBeDefined();
    expect(filePath).toContain(destDir);
    expect(filePath.endsWith('.png')).toBe(true);
  });
});

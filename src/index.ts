// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

import { getCodeProjectCardsContent } from './api.js';
import { convertGifToPng } from './convert.js';
import { downloadImage } from './download.js';

export default async function main(baseDir: string) {
  // Fetch the project content from the contentful CMS
  const projectCardContent = await getCodeProjectCardsContent();

  // Store the paths to the downloaded images
  const newImagePaths: string[] = [];

  // For each project, download the preview image
  for (const project of projectCardContent) {
    const previewImageUrl = project.preview.url;

    // Skip projects without a preview image
    if (!previewImageUrl) continue;

    const previewImageFilename = previewImageUrl.split('/').pop() as string;
    const filePath = `${baseDir}/${project.slug}/${previewImageFilename}`;

    console.log(`Downloading ${previewImageUrl} to ${filePath}`);

    try {
      await downloadImage(previewImageUrl, filePath);
      newImagePaths.push(filePath);
    } catch (err) {
      console.error(`Error downloading ${previewImageUrl}`, err);
      process.exit(1);
    }
  }

  // Convert the gifs at each filepath to .pngs using jimp
  for (const filePath of newImagePaths) {
    await convertGifToPng(filePath);
  }
}

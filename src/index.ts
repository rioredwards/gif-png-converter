// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

import { getCodeProjectCardsContent } from './api.js';
import { downloadImage } from './download.js';

async function main() {
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
    const filePath = `./gifs/${project.slug}/${previewImageFilename}`;

    console.log(`Downloading ${previewImageUrl} to ${filePath}`);

    try {
      downloadImage(previewImageUrl, filePath);
      newImagePaths.push(filePath);
    } catch (err) {
      console.error(`Error downloading ${previewImageUrl}`, err);
      process.exit(1);
    }
  }
}

main().catch((error) => console.error(error));

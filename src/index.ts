// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

import { CodeProjectCard, getCodeProjectCardsContent } from './api.js';
import { downloadImage } from './download.js';

async function main() {
  let projectCardContent: CodeProjectCard[] = [];

  // Fetch all projects from the contentful CMS
  try {
    projectCardContent = await getCodeProjectCardsContent();
  } catch (err) {
    console.error('Error fetching project content from contentful CMS', err);
    process.exit(1);
  }

  // For each project, download the preview image
  for (const project of projectCardContent) {
    const previewImageUrl = project.preview.url;
    const projectSlug = project.slug;
    const previewImageFilename = previewImageUrl.split('/').pop() as string;
    const filePath = `./images/${projectSlug}/${previewImageFilename}`;

    // eslint-disable-next-line no-console
    console.log(`Downloading ${previewImageUrl} to ${filePath}`);

    try {
      downloadImage(previewImageUrl, filePath);
    } catch (err) {
      console.error(`Error downloading ${previewImageUrl}`, err);
      process.exit(1);
    }
  }
}

main().catch((error) => console.error(error));

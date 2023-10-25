// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

import fs from 'fs';
import fetch from 'node-fetch';
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
    const previewImageFilename = previewImageUrl.split('/').pop() as string;

    console.log(`Downloading ${previewImageUrl} to ${previewImageFilename}`);

    try {
      downloadImage(previewImageUrl, previewImageFilename);
    } catch (err) {
      console.error(`Error downloading ${previewImageUrl}`, err);
      process.exit(1);
    }
  }
}

main().catch((error) => console.error(error));

// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

import { getCodeProjectCardsContent } from './api.js';

async function main() {
  const projectCardContent = await getCodeProjectCardsContent();
  console.log(projectCardContent);
}

main().catch((error) => console.error(error));

// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

// Import the required modules
import dotenv from 'dotenv';
dotenv.config();

// Configure the environment variables
console.log(process.env.CONTENTFUL_SPACE_ID);

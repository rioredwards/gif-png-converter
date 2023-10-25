// This script will download the preview images for all projects in the contentful CMS
// and save them to the local filesystem

// Import the required modules
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

interface CodeProjectCard {
  title: string;
  slug: string;
  preview: {
    title: string;
    url: string;
  };
  tags: string[];
}

const CODE_PROJECT_CARDS_GRAPHQL_FIELDS = `
  title
  slug
  preview {
    title
    url
  }
  tagsCollection {
    items {
      text
    }
  }
`;

function extractCodeProjectCardEntries(fetchResponse: any): any[] {
  const entries = fetchResponse?.data?.featuredCodeProjectCollection?.items;
  const entiresWithExtractedTags = entries?.map((entry: any) => {
    const tags = entry?.tagsCollection?.items?.map((item: any) => item?.text);
    delete entry.tagsCollection;
    return {
      ...entry,
      tags,
    };
  });
  return entiresWithExtractedTags;
}

async function fetchGraphQL(query: string): Promise<any> {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response: any) => response.json());
}

async function getCodeProjectCardsContent(): Promise<CodeProjectCard[]> {
  const entries = await fetchGraphQL(
    `query {
      featuredCodeProjectCollection(
        order: sys_publishedAt_DESC,
      ) {
        items {
          ${CODE_PROJECT_CARDS_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractCodeProjectCardEntries(entries);
}

async function main() {
  const projectCardContent = await getCodeProjectCardsContent();
  console.log(projectCardContent);
}

main().catch((error) => console.error(error));

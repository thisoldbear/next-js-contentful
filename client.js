import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`
);

export const previewClient = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN_PREVIEW}`
);

export const getClient = (preview) => (preview ? previewClient : client);

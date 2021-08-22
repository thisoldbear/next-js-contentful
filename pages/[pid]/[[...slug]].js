import { GraphQLClient } from "graphql-request";

const graphcms = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`
);

export const buildSlugFromParams = (obj) => {
  let string = obj.pid;

  if (obj.slug) {
    string = `${string}/${obj.slug.join("/")}`;
  }

  return string;
};

export async function getStaticProps({ params }) {
  const slug = buildSlugFromParams(params);

  const { pageCollection } = await graphcms.request(
    `
      query Page {
        pageCollection (where: {slug: "${slug}"}) {
          items {
            title
            slug
            childPagesCollection {
              items {
                title
                slug
              }
            }
          }
        }
      }
    `
  );

  return {
    props: {
      page: pageCollection.items[0],
    },
  };
}

export async function getStaticPaths() {
  const { pageCollection } = await graphcms.request(
    `
      query Page {
        pageCollection {
          items {
            title
            slug
            childPagesCollection {
              items {
                title
                slug
              }
            }
          }
        }
      }
    `
  );

  return {
    paths: pageCollection.items.map((page) => {
      const paramsArray = page.slug.split("/");

      const [pid, ...rest] = paramsArray;

      return {
        params: {
          pid: pid,
          slug: rest,
        },
      };
    }),

    fallback: false,
  };
}

const Page = (props) => {
  const { page } = props;

  if (!page) {
    return null;
  }

  return (
    <div>
      <h1>{page.title}</h1>
      {JSON.stringify(page)}
    </div>
  );
};

export default Page;

import { useRouter } from "next/router";
import { getClient } from "../../client";

export const buildSlugFromParams = (obj) => {
  let string = obj.pid;

  if (obj.slug) {
    string = `${string}/${obj.slug.join("/")}`;
  }

  return string;
};

export async function getStaticProps({ params, preview = false }) {
  const slug = buildSlugFromParams(params);

  const client = getClient(preview);

  const { pageCollection } = await client.request(
    `
      query Page {
        pageCollection (where: {slug: "${slug}"}, preview: ${preview}) {
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
      page: pageCollection.items[0] || null,
    },
  };
}

export async function getStaticPaths() {
  const client = getClient();

  const { pageCollection } = await client.request(
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
  const { isPreview } = useRouter();
  const { page } = props;

  if (!page) {
    return null;
  }

  return (
    <div>
      <h1>{page.title}</h1>
      {JSON.stringify(page)}
      {isPreview && (
        <p>
          <a href={`${process.env.BASE_URL}/api/preview-end?slug=${page.slug}`}>
            Exit Preview
          </a>
        </p>
      )}
    </div>
  );
};

export default Page;

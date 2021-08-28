import { useRouter } from "next/router";
import { client, getClient } from "../client";

export async function getStaticProps({ params, preview = false }) {
  const slug = params.slug.join("/");

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
      return {
        params: {
          slug: page.slug.split("/"),
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
          <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/preview-end?slug=${page.slug}`}>
            Exit Preview
          </a>
        </p>
      )}
    </div>
  );
};

export default Page;

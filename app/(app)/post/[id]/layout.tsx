import { fetchPostWithId } from "@actions/postActions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await fetchPostWithId(params.id);

  if (data.status === 200 && data.data) {
    const post = data.data;
    return {
      title: post.title,
      openGraph: {
        siteName: "Le Gallerie",
        title: post.title,
        description: post.description,
        images: [
          {
            url: post.image[0],
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/post/${post._id}`,
        type: "website",
      },
    };
  }

  return {
    title: "Post Not Found",
    openGraph: {
      title: "Post Not Found",
      description: "This post is unavailable.",
    },
  };
}

export default function SettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}

import prisma from "@/lib/prisma";

async function getPosts() {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return feed;
}

export default async function HomePage() {
  const posts = await getPosts();
  console.log(posts);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        Carousel <br />
        features with 3 colums <br />
        deals <br />
        categories <br />
      </main>
    </div>
  );
}

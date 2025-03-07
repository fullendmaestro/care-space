"use client";
import { useQuery, useMutation } from "@tanstack/react-query";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
}

export default function Home() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <p> Loading...</p>;

  if (isError) return <p> Error: {(error as Error).message}</p>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {data?.map((post, key) => (
        <div key={key}>
          {" "}
          <h4> Title: {post.title}</h4> <p> Body: {post.body}</p>{" "}
        </div>
      ))}
    </div>
  );
}

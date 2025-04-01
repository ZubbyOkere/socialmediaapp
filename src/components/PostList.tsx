import { useQuery } from "@tanstack/react-query";
import React from "react";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Post {
  title: string;
  content: string;
  id: number;
  image_url: string;
  created_at: string;
  avatar_url: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const PostList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div>Loading data</div>;
  }
  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
  console.log(data);

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {data?.map((item) => (
        <Link to={`/post/${item.id}`}>
          <div
            key={item.id}
            className="bg-white shadow-2xl rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <img
                src={item.avatar_url}
                alt="user avatar"
                className="w-8 h-8 rounded-full object-cover bg-red-700"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
            </div>
            <img
              src={item.image_url}
              alt=""
              className="w-full max-w-md h-full rounded-md mb-4 object-cover"
            />
            <p className="text-gray-600 mb-4">{item.content}</p>
            <p className="text-sm text-gray-400">
              Posted on: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostList;

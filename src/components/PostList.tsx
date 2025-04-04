import { useQuery } from "@tanstack/react-query";
import React from "react";
import { supabase } from "../supabase-client";
import { Link } from "react-router";
import PostItem from "./PostItem";

export interface Post {
  title: string;
  content: string;
  id: number;
  image_url: string;
  created_at: string;
  avatar_url: string;
  like_count?: number;
  comment_count?: number;
}
// helper function to fetch post from supabase

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");
  console.log(data);
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
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};

export default PostList;

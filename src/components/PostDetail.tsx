import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import LikeButton from "./LikeButton";

interface PostDetails {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

const PostDetail = ({ postId }: PostDetails) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 mt-10">Data is loading...</div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        There was an error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg ">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{data?.title}</h2>
        {data?.avatar_url && (
          <img
            src={data?.avatar_url}
            alt={data?.title}
            className="w-20 h-20 object-cover rounded-full mb-6"
          />
        )}
      </div>
      <p className="text-gray-700 text-lg leading-relaxed mb-4">
        {data?.content}
      </p>
      <p className="text-sm text-gray-500 italic">
        {new Date(data!.created_at).toLocaleString()}
      </p>
      <LikeButton postId={postId} />
    </div>
  );
};

export default PostDetail;

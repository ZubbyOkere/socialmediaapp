import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import PostItem from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

const fetchCommunityPosts = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

const SingleCommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPosts(communityId),
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        Error: {error.message}
      </div>
    );
  }
  return (
    <div className="bg-white shadow-lg rounded-lg mt-20 mx-auto max-w-3xl">
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Communities
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          {data && data[1]?.communities.name}
        </h2>
        {data && data.length > 0 ? (
          <div className="space-y-6">
            {data.map((post, key) => (
              <PostItem post={post} key={key} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-lg">
            No posts available here
          </p>
        )}
      </div>
    </div>
  );
};

export default SingleCommunityDisplay;

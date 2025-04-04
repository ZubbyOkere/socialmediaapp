import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}
interface Vote {
  id: number;
  post_Id: number;
  user_Id: string;
  vote: number;
}
// helper function for sending votes to supabase

const vote = async (voteValue: number, postId: number, userId: string) => {
  // Check if the user has already voted on this post
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      // User clicked the same vote (e.g., upvote again), so delete it
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      // User switched their vote (e.g., from upvote to downvote), so an update here
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    // No existing vote, so insert a new one
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

// fetch total sum of votes here helper function
const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);
  if (error) throw new Error(error.message);
  return data as Vote[];
};

const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  // fetch total sum of votes here from supabase with useQuery
  const {
    data: votes,
    error,
    isLoading,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  // mutation function for sending votes to supabase

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You need to be logged in to vote");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["votes", postId] }),
  });

  if (error) {
    return <div>Error getting votes...</div>;
  }

  if (isLoading) {
    return <div>Data is loading...</div>;
  }

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  return (
    <div>
      <button
        onClick={() => mutate(+1)}
        className={`cursor-pointer transition-colors duration-150 py-1 px-3 ${
          likes === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍{likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`cursor-pointer transition-colors duration-150 py-1 px-3 ${
          dislikes === 1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎{dislikes}
      </button>
    </div>
  );
};

export default LikeButton;

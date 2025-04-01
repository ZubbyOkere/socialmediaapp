import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}

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
        .eq("id", existingVote.id); // Corrected: Changed "existingVote" to "existingVote.id" to use the ID value
      if (error) throw new Error(error.message);
    } else {
      // User switched their vote (e.g., from upvote to downvote), so update it
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id); // Corrected: Changed "existingVote" to "existingVote.id" to use the ID value
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

const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You need to be logged in to vote");
      return vote(voteValue, postId, user.id);
    },
  });

  return (
    <div>
      <button onClick={() => mutate(+1)}>👍</button>
      <button onClick={() => mutate(-1)}>👎</button>
    </div>
  );
};

export default LikeButton;

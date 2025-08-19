import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id: number | null;
}

export interface Comments {
  id: number;
  created_at: string;
  author: string;
  post_id: number;
  content: string;
  parent_comment_id: number | null;
}

// utitility function adds comment with user id and username to supabase
const createComment = async (
  newComments: NewComment,
  postId: number,
  userId: string,
  author: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to create comment");
  }
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    author: author,
    content: newComments.content,
    parent_comment_id: newComments.parent_comment_id,
  });
  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comments[];
};
const CommentSection = ({ postId }: Props) => {
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    error,
    isLoading,
  } = useQuery<Comments[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComments: NewComment) =>
      createComment(
        newComments,
        postId,
        user!.id,
        user!.user_metadata.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!newComment || !user) return;
    mutate({ content: newComment, parent_comment_id: null });
    setNewComment("");
  };

  const buildCommentTree = (
    flatComments: Comments[]
  ): (Comments & { children?: Comments[] })[] => {
    const map = new Map<number, Comments & { children?: Comments[] }>();
    const roots: (Comments & { children?: Comments[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });
    console.log("Comment Tree:", roots); // Debug the tree
    return roots;
  };

  if (error) {
    return <div>Error getting Comments...</div>;
  }

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Comments</h1>
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={3}
            placeholder="Enter comments here"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-y 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newComment || isPending}
            className={`w-full sm:w-auto px-6 py-2 rounded-md text-white font-medium
                       transition-colors duration-200 cursor-pointer
                       ${
                         !newComment || isPending
                           ? "bg-gray-400 cursor-not-allowed"
                           : "bg-blue-600 hover:bg-blue-700"
                       }`}
          >
            {isPending ? "Posting Comment..." : "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 text-sm">Error posting comment</p>
          )}
        </form>
      ) : (
        <p className="text-gray-600 italic">Log in to post a comment</p>
      )}

      {commentTree.map((comment, key) => (
        <CommentItem comment={comment} key={key} postId={postId} />
      ))}
    </div>
  );
};

export default CommentSection;

import { useState } from "react";
import { Comments } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface Props {
  comment: Comments & {
    children?: Comments[];
  };
  postId: number;
}

const createReply = async (
  replyContent: string,
  parentCommentId: number,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to replay");
  }
  const { error } = await supabase.from("comments").insert({
    content: replyContent,
    parent_comment_id: parentCommentId,
    post_id: postId,
    user_id: userId,
    author: author,
  });
  if (error) throw new Error(error.message);
};

const CommentItem = ({ comment, postId }: Props) => {
  //   console.log(comment);

  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const { user } = useAuth();
  const [collapsedComment, setCollapsedComment] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        comment.id,
        postId,
        user?.id,
        user?.user_metadata.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  //   SVG components
  const ArrowUp = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 19V5M12 5L5 12M12 5L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowDown = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M12 19L5 12M12 19L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      className={`py-4 ${
        comment.parent_comment_id
          ? "ml-6 border-l-2 border-gray-200 pl-4"
          : "border-b border-gray-200 bg-gray-50 rounded-lg"
      }`}
    >
      <div className="empty-div-hidden" />
      <div className="flex flex-col space-y-3">
        <div className="flex items-baseline space-x-3">
          <span
            className={`font-semibold ${
              comment.parent_comment_id
                ? "text-gray-700 text-base"
                : "text-gray-800 text-lg"
            }`}
          >
            {comment.author}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p
          className={`${
            comment.parent_comment_id
              ? "text-gray-600"
              : "text-gray-700 font-medium"
          }`}
        >
          {comment.content}
        </p>
        <span className="text-red-500">Delete comment</span>
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="text-blue-500 hover:underline text-sm w-fit font-medium transition-colors duration-200"
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="space-y-4 mt-4">
          <textarea
            rows={3}
            placeholder="Enter reply here"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-y 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent text-gray-700 placeholder-gray-400
                       bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={!replyText || isPending}
            className={`w-full sm:w-auto px-6 py-2 rounded-md text-white font-medium
                       transition-colors duration-200 cursor-pointer shadow-sm
                       ${
                         !replyText || isPending
                           ? "bg-gray-400 cursor-not-allowed"
                           : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                       }`}
          >
            {isPending ? "Posting Reply..." : "Post Reply"}
          </button>
          {isError && (
            <p className="text-red-500 text-sm font-medium">
              Error posting reply
            </p>
          )}
        </form>
      )}
      {comment.children && comment.children.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setCollapsedComment((prev) => !prev)}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
          >
            {!collapsedComment ? (
              <>
                <ArrowDown />
                <span>Hide replies ({comment.children.length})</span>
              </>
            ) : (
              <>
                <ArrowUp />
                <span>Show replies ({comment.children.length})</span>
              </>
            )}
          </button>
          {!collapsedComment && (
            <div className="mt-2 space-y-2">
              {comment.children.map((child, key) => (
                <CommentItem comment={child} key={key} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

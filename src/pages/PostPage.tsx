import React from "react";
import PostDetail from "../components/PostDetail";
import { useParams } from "react-router";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mt-24">
      <PostDetail postId={Number(id)} />
    </div>
  );
};

export default PostPage;

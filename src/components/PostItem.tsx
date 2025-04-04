import React from "react";
import { Link } from "react-router";
import { Post } from "./PostList";

interface PostItemProps {
  post: Post;
}
const PostItem = ({ post }: PostItemProps) => {
  return (
    <div>
      <Link to={`/post/${post.id}`}>
        <div
          key={post.id}
          className="bg-white shadow-2xl rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <img
              src={post.avatar_url}
              alt="user avatar"
              className="w-8 h-8 rounded-full object-cover bg-red-700"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h3>
          </div>
          <img
            src={post.image_url}
            alt=""
            className="w-full max-w-md h-full rounded-md mb-4 object-cover"
          />
          <p className="text-gray-600 mb-4">{post.content}</p>
          <p className="text-sm text-gray-400">
            Posted on: {new Date(post.created_at).toLocaleString()}
          </p>
          <span>🩷 {post.like_count} </span>
          <span>💬 {post.comment_count} </span>
        </div>
      </Link>
    </div>
  );
};

export default PostItem;

import { Link } from "react-router";
import { Post } from "./PostList";

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="w-full overflow-hidden">
      <Link to={`/post/${post.id}`}>
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
          {/* Header with Avatar and Title */}
          <div className="flex items-center space-x-3 mb-4 overflow-hidden">
            <img
              src={post.avatar_url}
              alt="user avatar"
              className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate flex-1">
              {post.title}
            </h3>
          </div>

          {/* Image */}
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-48 sm:h-56 object-cover rounded-md mb-4"
          />

          {/* Content */}
          <p className="text-gray-600 text-sm sm:text-base mb-4 flex-1 line-clamp-3">
            {post.content}
          </p>

          {/* Meta Info */}
          <div className="text-sm text-gray-400 mb-2">
            Posted on: {new Date(post.created_at).toLocaleString()}
          </div>

          {/* Likes and Comments */}
          <div className="flex justify-between items-center space-x-10 text-sm text-gray-500">
            <div>
              <span>🩷 {post.like_count || 0}</span>
              <span>💬 {post.comment_count || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostItem;

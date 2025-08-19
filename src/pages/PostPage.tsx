import PostDetail from "../components/PostDetail";
import { useParams } from "react-router";
import CommentSection from "../components/CommentSection";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mt-24">
      <PostDetail postId={Number(id)} />
      <CommentSection postId={Number(id)} />
    </div>
  );
};

export default PostPage;

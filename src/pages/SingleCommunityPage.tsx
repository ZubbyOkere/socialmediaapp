import { useParams } from "react-router";
import SingleCommunityDisplay from "../components/SingleCommunityDisplay";

const SingleCommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen bg-gray-100">
      <SingleCommunityDisplay communityId={Number(id)} />
    </div>
  );
};

export default SingleCommunityPage;

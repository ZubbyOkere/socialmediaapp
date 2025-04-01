import { CreatePost } from "../components/CreatePost";

const CreatePostPage = () => {
  return (
    <div className="mt-24">
      <h1 className=" text-center font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase text-3xl">
        create post here
      </h1>
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;

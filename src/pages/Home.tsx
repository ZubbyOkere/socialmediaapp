import PostList from "../components/PostList";

const Home = () => {
  return (
    <div className="mt-24">
      <h2 className="text-center font-extrabold text-3xl text-purple-500">
        Recent Posts
      </h2>
      <PostList />
    </div>
  );
};

export default Home;

import CommunitiesList from "../components/CommunitiesList";

const CommunitiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        </div>
      </div>
      <CommunitiesList />
    </div>
  );
};

export default CommunitiesPage;

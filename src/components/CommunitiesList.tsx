import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Communities {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Communities[]> => {
  const { error, data } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Communities[];
};

const CommunitiesList = () => {
  const { data, isError, isLoading } = useQuery<Communities[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isError) {
    return (
      <div className="text-red-500 text-center text-lg font-medium">
        Error fetching data...
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="text-gray-600 text-center text-lg font-medium">
        Data is Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {data?.map((community, key) => (
          <div
            key={key}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 
                       hover:shadow-lg transition-shadow duration-200"
          >
            <Link
              to={`/communityid/${community.id}`} // Updated to include dynamic ID
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 
                         transition-colors duration-200"
            >
              {community.name}
            </Link>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {community.description}
            </p>
            <p className="mt-3 text-sm text-gray-400">
              Created: {new Date(community.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesList;

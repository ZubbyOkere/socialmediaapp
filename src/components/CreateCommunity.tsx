import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);
  if (error) throw new Error(error.message);
  return data;
};

const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create Community
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Community Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent text-gray-700 placeholder-gray-400 
                       shadow-sm transition-all duration-200"
            placeholder="Enter community name"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Community Description
          </label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent text-gray-700 placeholder-gray-400 
                       shadow-sm resize-y min-h-[100px] transition-all duration-200"
            placeholder="Describe your community"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={`w-full px-6 py-3 rounded-md text-white font-medium
                     transition-colors duration-200 shadow-sm
                     ${
                       isPending
                         ? "bg-gray-400 cursor-not-allowed"
                         : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                     }`}
        >
          {isPending ? "Creating..." : "Create Community"}
        </button>
        {isError && (
          <p className="text-red-500 text-sm font-medium text-center">
            Error creating community
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateCommunity;

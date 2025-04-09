import { ChangeEvent, useRef, useState } from "react";
import { supabase } from "../supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Communities, fetchCommunities } from "./CommunitiesList";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id: number | null;
}

const createPost = async (post: PostInput, image_url: File) => {
  const filePath = `${post.title}-${Date.now()}-${image_url.name}`;
  const { error: uploadError } = await supabase.storage
    .from("posts-image")
    .upload(filePath, image_url);
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("posts-image")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicUrlData.publicUrl })
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const { data: communities } = useQuery<Communities[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data: { post: PostInput; imageUrl: File }) => {
      return createPost(data.post, data.imageUrl);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      setTitle("");
      setContent("");
      setSelectedFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: Error) => {
      setSuccess(false);
      setError(error.message);
      console.log("Error creating post:", error);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(e.target.files[0]);
    }
  };
  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedFiles) {
      setError("Please select an image");
      return;
    }
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageUrl: selectedFiles,
    });
  };

  return (
    <form
      className="w-full max-w-md mx-auto px-4 py-8 space-y-5"
      onSubmit={handleSubmit}
    >
      {/* Error/Success Messages */}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && (
        <div className="text-green-500 text-sm text-center">
          Post created successfully!
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <textarea
          id="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-[120px]"
        />
      </div>

      {/* Community Select */}
      <div className="space-y-2">
        <label
          htmlFor="community"
          className="block text-sm font-medium text-gray-700"
        >
          Choose Community
        </label>
        <select
          id="community"
          onChange={handleCommunityChange}
          required
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">---Choose Community---</option>
          {communities?.map((community, key) => (
            <option value={community.id} key={key}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-500 file:text-white file:hover:bg-purple-600 file:cursor-pointer"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-purple-500 text-white rounded-md text-sm font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

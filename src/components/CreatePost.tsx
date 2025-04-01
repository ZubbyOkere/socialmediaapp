import { ChangeEvent, useRef, useState } from "react";
import { supabase } from "../supabase-client";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
}

const createPost = async (post: PostInput, image_url: File) => {
  // uploading image

  // create a unique file path/url
  const filePath = `${post.title}-${Date.now()}-${image_url.name}`;

  // upload image using filepath as the unique name
  const { error: uploadError } = await supabase.storage
    .from("posts-image")
    .upload(filePath, image_url);
  if (uploadError) throw new Error(uploadError.message);

  // get image url from storage bucket
  const { data: publicUrlData } = supabase.storage
    .from("posts-image")
    .getPublicUrl(filePath);

  // adding image url to the table here
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: Error) => {
      setSuccess(false);
      setError(error.message);
      console.log("Error creaating post:", error);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(e.target.files[0]);
    }
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
      },
      imageUrl: selectedFiles,
    });
  };

  return (
    <form className="max-w-2xl mx-auto space-y-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      {success && (
        <div className="text-green-500">Post created successfully!</div>
      )}
      <div className="mb-4 flex justify-between">
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>

        <input
          type="text"
          id="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full border border-black bg-transparent p-2 rounded text-gray-600 focus:outline-none "
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="w-full border border-black bg-transparent p-2 rounded text-gray-600 focus:outline-none resize-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block mb-2 font-medium">
          Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full border border-black bg-transparent p-2 rounded text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>

      {error && <p className="text-red-500">Error Creating Post</p>}
    </form>
  );
};

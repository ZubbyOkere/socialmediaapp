import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage.tsx/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import SingleCommunityPage from "./pages/SingleCommunityPage";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communityid/:id" element={<SingleCommunityPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

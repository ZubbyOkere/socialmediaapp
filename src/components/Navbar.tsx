import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGitHub, signOut, user } = useAuth();

  const displayUser = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-mono text-lg font-bold text-white md:text-xl md:font-extrabold"
          >
            Social <span className="text-purple-500">Media</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors md:font-semibold"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors md:font-semibold"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-300 hover:text-white transition-colors md:font-semibold"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white transition-colors md:font-semibold"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop User/Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="user avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300 md:font-semibold">
                  {displayUser}
                </span>
                <button
                  onClick={signOut}
                  className="px-3 py-1 bg-red-500 rounded-2xl text-white hover:bg-red-600 transition-colors md:font-semibold"
                >
                  Signout
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="px-3 py-1 bg-blue-500 rounded-2xl text-white hover:bg-blue-600 transition-colors md:font-semibold"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[rgba(10,10,10,0.9)] border-t border-white/10 absolute left-0 right-0 top-16">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/create"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-bold text-2xl"
                onClick={() => setMenuOpen(false)}
              >
                Create Post
              </Link>
              <Link
                to="/communities"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Communities
              </Link>
              <Link
                to="/community/create"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Create Community
              </Link>
              {/* Mobile User/Auth */}
              {user ? (
                <div className="flex items-center space-x-4 px-3 py-2">
                  {user.user_metadata.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="user avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-gray-300 flex-1 font-medium">
                    {displayUser}
                  </span>
                  <button
                    onClick={signOut}
                    className="px-3 py-1 bg-red-500 rounded-2xl text-white hover:bg-red-600 transition-colors font-medium"
                  >
                    Signout
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGitHub}
                  className="w-full px-3 py-2 bg-blue-500 rounded-2xl text-white hover:bg-blue-600 transition-colors text-center font-medium"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

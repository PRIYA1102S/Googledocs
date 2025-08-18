import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "https://collabdocs-oeum.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering
        ? `${API_BASE}/api/users/register`
        : `${API_BASE}/api/users/login`;
      const payload = isRegistering
        ? { username, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate("/documents");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? "bg-blue-600" : "bg-blue-500"
            }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            CollabDocs
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:items-center min-h-[calc(100vh-120px)]">
          {/* Left Side - Hero Section */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h2
                className={`text-4xl lg:text-5xl font-bold leading-tight mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Create, Edit, <span className="text-blue-500">Collaborate</span>
              </h2>
              <p
                className={`text-lg lg:text-xl leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Professional real-time collaborative document editor with live
                cursor tracking, user presence indicators, and seamless
                multi-user editing.
              </p>
            </div>

            {/* Features Grid with Text Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {[
                {
                  icon: (
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  text: "Real-time collaboration",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                  text: "Live cursor tracking",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                  text: "Role-based permissions",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                  ),
                  text: "Auto-save & sync",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  ),
                  text: "Secure sharing",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ),
                  text: "Rich text editing",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 lg:p-4 rounded-xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                    isDark
                      ? "bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50"
                      : "bg-white/60 hover:bg-white/80 border border-gray-200/50 shadow-sm hover:shadow-md"
                  }`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0,
                    animation: `fadeInUp 0.6s ease-out ${
                      index * 0.2
                    }s forwards`,
                  }}
                >
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      isDark
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <span
                    className={`font-medium text-sm lg:text-base transition-all duration-300 hover:text-blue-500 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <style jsx>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center">
            <div
              className={`w-full max-w-md ${
                isDark
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/80 border-gray-200 shadow-2xl"
              } p-8 rounded-3xl border backdrop-blur-lg`}
            >
              <div className="text-center mb-8">
                <h3
                  className={`text-3xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {isRegistering ? "Create Account" : "Welcome Back"}
                </h3>
                <p
                  className={`text-base ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isRegistering
                    ? "Join thousands of teams collaborating on CollabDocs"
                    : "Sign in to continue to your documents"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isRegistering && (
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700/50 border-gray-600 text-gray-900 placeholder-gray-400"
                          : "border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                )}

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700/50 border-gray-600 text-gray-900 placeholder-gray-400"
                        : "border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700/50 border-gray-600 text-gray-900 placeholder-gray-400"
                        : "border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isRegistering ? "Create Account" : "Sign In"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isRegistering
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200 hover:underline"
                  >
                    {isRegistering ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

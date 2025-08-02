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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "/api/users/register" : "/api/users/login";
      const payload = isRegistering ? { username, email, password } : { email, password };

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
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-100 to-blue-200'}`}>
      {/* Header with theme toggle */}
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-8 rounded-lg shadow-md w-full max-w-md border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {isRegistering ? "Register" : "Login"}
          </h1>
          <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {isRegistering
              ? "Create an account to get started"
              : "Log in to your account"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegistering && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>

          <p className={`text-center mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

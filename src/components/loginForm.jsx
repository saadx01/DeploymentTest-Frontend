
// PHASE 2: Login Form Component (UNCOMMENT WHEN READY)

import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import axiosInstance from "../redux/axiosInstance";

const LoginForm = () => {
  const { login, user, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, show logout option
  if (user) {
    return (
      <div className="max-w-md mx-auto mt-6 p-4 shadow border rounded bg-white">
        <div className="text-center">
          <h2 className="text-xl font-bold text-green-600 mb-4">✅ Welcome, {user.name}!</h2>
          <p className="text-gray-600 mb-4">You are logged in as: {user.email}</p>
          <button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // const response = await axios.post("http://localhost:4000/api/v1/user/login", form);
      const response = await axiosInstance.post("/api/v1/user/login", form);
      const { accessToken, user: userData } = response.data;
      
      // Use the login function from context
      login(userData, accessToken);
      
      // Reset form
      setForm({ email: "", password: "" });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 shadow border rounded bg-white">
      <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">🔐 Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;



// PHASE 3: Login Form with Validation (UNCOMMENT WHEN READY)

import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import axiosInstance from "../redux/axiosInstance";

const LoginFormWithValidation = () => {
  const { login, user, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    console.log("event",e)
    const { name, value } = e.target;
    console.log("name",name)
    console.log("value",value)
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const fieldErrors = {};

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email) {
        fieldErrors.email = "Email is required";
      } else if (!emailRegex.test(form.email)) {
        fieldErrors.email = "Please enter a valid email address";
      }
    }

    if (name === "password" && form.password.length > 0 && form.password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters";
    }

    console.log("fieldErrors",fieldErrors)

    setErrors({ ...errors, ...fieldErrors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/v1/user/login", form);
      const { accessToken, user: userData } = response.data;
      
      // Use the login function from context
      login(userData, accessToken);
      
      // Reset form
      setForm({ email: "", password: "" });
      setErrors({});
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle server-side validation errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ 
          general: err.response?.data?.message || "Login failed. Please check your credentials." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 shadow border rounded bg-white">
      <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">🔐 Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-describedby="submit-status"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm text-gray-600">
          <p>* Required fields</p>
        </div>
      </form>
    </div>
  );
};

export default LoginFormWithValidation;



// PHASE 1: Basic User Registration Component
import { useState } from "react"
import axios from "axios"
import axiosInstance from "../redux/axiosInstance"

const RegisterUsers = ({ onRegisterSuccess }) => {
  // PHASE 1: State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    image: null,
  })

  // PHASE 1: State for loading and messages
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // PHASE 1: Handle form input changes
  const handleChange = (e) => {
    console.log("Input changed:", e)
    if (e.target.name === "image") {
      console.log("File input name:", e.target.name)
      console.log("File selected:", e.target.files[0])
      setFormData({ ...formData, image: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  // PHASE 1: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    // PHASE 1: Create FormData for file upload
    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("password", formData.password)
    data.append("role", formData.role)
    if (formData.image) {
      data.append("image", formData.image)
    }

    try {
      // PHASE 1: Make API request to register user
      const response = await axiosInstance.post("/api/v1/user/new", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 201) {
        setMessage("User registered successfully!")

        // PHASE 1: Trigger parent component to refresh user list
        if (onRegisterSuccess) {
          onRegisterSuccess()
        }

        // PHASE 1: Reset form after successful registration
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
          image: null,
        })

        // Clear file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ""
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border mt-8">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">👤 Register New User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Registering..." : "Register User"}
        </button>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{message}</div>
        )}

        {/* Error Message */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      </form>
    </div>
  )
}

export default RegisterUsers

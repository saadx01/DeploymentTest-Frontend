
// PHASE 1: Basic User List Component with CRUD Operations
import { useEffect, useState } from "react"
import axios from "axios"
import axiosInstance, { ENDPOINT } from "../redux/axiosInstance"

// Edit User Form Component
const EditUserForm = ({ user, onCancel, onUpdated }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "user" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axiosInstance.put(`/api/v1/user/${user._id}`, form)
      onUpdated() // Refresh user list
      onCancel() // Close edit form
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8 max-w-md mx-auto border">
      <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">✏️ Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

const UserList = ({ refreshTrigger }) => {
  // PHASE 1: State management for users, loading, and errors
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  // PHASE 1: useEffect hook to fetch data when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchUsers()


    // return () => {

    // }
  }, [refreshTrigger])

  // PHASE 1: Function to fetch users from Express API
  const fetchUsers = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await axiosInstance.get("/api/v1/user/all",{
        headers: {
          // PHASE 2: With Authentication Headers (UNCOMMENT WHEN READY)
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setUsers(response.data.users || [])
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to fetch users. Please check if the server is running.")
    } finally {
      setLoading(false)
    }

    // PHASE 2: With Authentication Headers (UNCOMMENT WHEN READY)
    /*
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch users. Please check authentication.");
    } finally {
      setLoading(false);
    }
    */
  }

  // PHASE 1: Function to handle user deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?")
    if (!confirmDelete) return

    try {
      await axios.delete(`/api/v1/user/${id}`)
      fetchUsers() // Refresh the list after deletion
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete user.")
    }
  }

  // PHASE 1: Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-blue-600 text-lg">Loading users...</div>
      </div>
    )
  }

  // PHASE 1: Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        <button onClick={fetchUsers} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">📋 Registered Users</h2>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No users found. Register the first user!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* User Profile Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={`${ENDPOINT}/${user.profileImage?.replace(/\\\\/g, "/").replace(/\\/g, "/")}`}
                  alt={user.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-gray-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=User"
                  }}
                />
              </div>

              {/* User Information */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Role: <span className="font-medium capitalize">{user.role}</span>
                </p>
                <p className="text-xs text-gray-400">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form Modal */}
      {selectedUser && (
        <EditUserForm user={selectedUser} onCancel={() => setSelectedUser(null)} onUpdated={fetchUsers} />
      )}
    </div>
  )
}

export default UserList

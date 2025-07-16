"use client";

import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../redux/axiosInstance";

// Yup validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required")
    .trim(),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .lowercase(),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  role: Yup.string()
    .oneOf(["user", "admin"], "Please select a valid role")
    .required("Role is required"),

  image: Yup.mixed()
    .required("Profile image is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Only JPEG, PNG, and GIF files are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          value.type
        )
      );
    }),
});

const RegisterUsersWithValidation = ({ onRegisterSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");



  // Initialize Formik at the top
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
    isValid,
    dirty,
    submitCount,
    setFieldValue
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setLoading(true);
      setMessage("");
      setServerError("");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("email", values.email.toLowerCase());
      formData.append("password", values.password);
      formData.append("role", values.role);
      formData.append("image", values.image);

      try {
        const response = await axiosInstance.post(
          "/api/v1/user/new",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          setMessage("User registered successfully! 🎉");

          // Trigger parent component to refresh user list
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }

          // Reset form after successful registration
          resetForm();

          // Clear file input manually
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = "";
        }
      } catch (err) {
        console.error("Registration error:", err);

        // Handle server-side validation errors
        if (err.response?.data?.errors) {
          // Set individual field errors from server
          const serverErrors = err.response.data.errors;
          Object.keys(serverErrors).forEach((field) => {
            setFieldError(field, serverErrors[field]);
          });
        } else if (err.response?.data?.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Helper function to get field error state
  const getFieldError = (fieldName) => {
    return errors[fieldName] && touched[fieldName];
  };

  // Helper function to get field classes
  const getFieldClasses = (fieldName) => {
    return `w-full border p-3 rounded focus:outline-none focus:ring-2 transition-colors ${
      getFieldError(fieldName)
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border mt-8">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        👤 Register New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Server Error */}
        {serverError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <strong>Error:</strong> {serverError}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
            role="alert"
          >
            {message}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClasses("name")}
            // aria-describedby={getFieldError("name") ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClasses("email")}
            // aria-describedby={getFieldError("email") ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClasses("password")}
            // aria-describedby={getFieldError("password") ? "password-error" : undefined}
          />
          {errors.password && (
            <p
              id="password-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Must contain uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClasses("confirmPassword")}
            // aria-describedby={getFieldError("confirmPassword") ? "confirmPassword-error" : undefined}
          />
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Role Field */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.role}
            </p>
          )}
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Profile Image *
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              setFieldValue("image", file);
            }}
            onBlur={handleBlur}
            className={getFieldClasses("image")}
            aria-describedby={
              getFieldError("image") ? "image-error" : undefined
            }
          />
          {errors.image && (
            <p
              id="image-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.image}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Accepted formats: JPEG, PNG, GIF (Max 5MB)
          </p>

          {/* Show selected file name */}
          {values.image && (
            <p className="text-green-600 text-sm mt-1">
              Selected: {values.image.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading || !isValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-describedby="submit-status"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Register User"
          )}
        </button>

        {/* Form Validation Status */}
        <div className="text-center text-sm">
          <p className="text-gray-600">* Required fields</p>
          {!isValid && submitCount > 0 && (
            <p className="text-red-500 mt-1">
              Please fix the errors above before submitting
            </p>
          )}
        </div>

        {/* Form Debug Info (Remove in production) */}
        {import.meta.env.VITE_NODE_ENV === "development" && (
          <details className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <summary className="cursor-pointer text-gray-600">
              Debug Info (Dev Only)
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>Form Valid:</strong> {isValid ? "✅" : "❌"}
              </div>
              <div>
                <strong>Form Dirty:</strong> {dirty ? "✅" : "❌"}
              </div>
              <div>
                <strong>Submit Count:</strong> {submitCount}
              </div>
              <pre className="text-gray-500 bg-white p-2 rounded">
                <strong>Errors:</strong>
                {JSON.stringify(errors, null, 2)}
              </pre>
              <pre className="text-gray-500 bg-white p-2 rounded">
                <strong>Touched:</strong>
                {JSON.stringify(touched, null, 2)}
              </pre>
              <pre className="text-gray-500 bg-white p-2 rounded">
                <strong>Values:</strong>
                {JSON.stringify(
                  {
                    ...values,
                    image: values.image ? `File: ${values.image.name}` : null,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </details>
        )}
      </form>
    </div>
  );
};

export default RegisterUsersWithValidation;

// // PHASE 3: Registration Form with Validation (UNCOMMENT WHEN READY)

// import React, { useState } from "react";
// import axios from "axios";

// const RegisterUsersWithValidation = ({ onRegisterSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "user",
//     image: null
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   // Validation rules
//   const validateForm = () => {
//     const newErrors = {};

//     // Name validation
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     // Image validation
//     if (!formData.image) {
//       newErrors.image = "Profile image is required";
//     } else {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//       if (!allowedTypes.includes(formData.image.type)) {
//         newErrors.image = "Please select a valid image file (JPEG, PNG, GIF)";
//       } else if (formData.image.size > 5 * 1024 * 1024) { // 5MB limit
//         newErrors.image = "Image size must be less than 5MB";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "image") {
//       setFormData({ ...formData, image: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }

//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;

//     // Validate individual field on blur
//     const fieldErrors = {};

//     if (name === "name" && !formData.name.trim()) {
//       fieldErrors.name = "Name is required";
//     } else if (name === "name" && formData.name.trim().length < 2) {
//       fieldErrors.name = "Name must be at least 2 characters";
//     }

//     if (name === "email") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!formData.email) {
//         fieldErrors.email = "Email is required";
//       } else if (!emailRegex.test(formData.email)) {
//         fieldErrors.email = "Please enter a valid email address";
//       }
//     }

//     if (name === "password" && formData.password.length > 0 && formData.password.length < 6) {
//       fieldErrors.password = "Password must be at least 6 characters";
//     }

//     if (name === "confirmPassword" && formData.confirmPassword && formData.password !== formData.confirmPassword) {
//       fieldErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors({ ...errors, ...fieldErrors });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     // Validate form before submission
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     const data = new FormData();
//     data.append("name", formData.name.trim());
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     data.append("role", formData.role);
//     data.append("image", formData.image);

//     try {
//       const response = await axios.post("http://localhost:4000/api/v1/user/new", data, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.status === 201) {
//         setMessage("User registered successfully!");

//         if (onRegisterSuccess) {
//           onRegisterSuccess();
//         }

//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//           role: "user",
//           image: null
//         });
//         setErrors({});

//         const fileInput = document.querySelector('input[type="file"]');
//         if (fileInput) fileInput.value = '';
//       }
//     } catch (err) {
//       console.error("Registration error:", err);

//       // Handle server-side validation errors
//       if (err.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       } else {
//         setErrors({ general: err.response?.data?.message || "Registration failed. Please try again." });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border mt-8">
//       <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">👤 Register New User</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {errors.general && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {errors.general}
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Enter full name"
//             value={formData.name}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
//               errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//           />
//           {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter email address"
//             value={formData.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
//               errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//           />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password (min 6 characters)"
//             value={formData.password}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
//               errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//           />
//           {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm your password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
//               errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//           />
//           {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image *</label>
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
//               errors.image ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//           />
//           {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
//           <p className="text-gray-500 text-xs mt-1">Accepted formats: JPEG, PNG, GIF (Max 5MB)</p>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading ? "Registering..." : "Register User"}
//         </button>

//         {message && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//             {message}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default RegisterUsersWithValidation;

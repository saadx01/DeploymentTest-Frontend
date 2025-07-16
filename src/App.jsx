"use client"
import { useState } from "react"

// PHASE 1: Basic React-Express Connection
import UserList from "./components/UserLists"
import RegisterUsers from "./components/RegisterUsers"

// PHASE 2: Authentication (UNCOMMENT WHEN READY)
import { AuthProvider } from "./context/authContext";
import LoginForm from "./components/loginForm";
import ProtectedRoute from "./components/ProtectedRoute";

// PHASE 3: Form Validation (UNCOMMENT WHEN READY)
import RegisterUsersWithValidation from "./components/registerUserWithValidation";
import LoginFormWithValidation from "./components/loginWithFormValidation";

function App() {
  // PHASE 1: Basic state management for refreshing user list
  const [refreshUsers, setRefreshUsers] = useState(false)

  const handleUserRegistered = () => {
    // Toggle to trigger re-fetch of user list
    setRefreshUsers((prev) => !prev)
  }

  return (
    // PHASE 1: Basic App Structure
    // <div className="App w-full flex flex-col justify-center items-center min-h-screen bg-gray-100">
    //   <h1 className="text-3xl font-bold text-blue-600 mb-8">React + Express App</h1>
    //   <UserList refreshTrigger={refreshUsers} />
    //   <RegisterUsers onRegisterSuccess={handleUserRegistered} />
    // </div>

    // PHASE 2: With Authentication (UNCOMMENT WHEN READY)
    
    // <AuthProvider>
    //   <div className="App w-full min-h-screen bg-gray-100">
    //     <LoginForm />
    //     <ProtectedRoute>
    //       <div className="flex flex-col justify-center items-center pt-8">
    //         <h1 className="text-3xl font-bold text-blue-600 mb-8">React + Express App</h1>
    //         <UserList refreshTrigger={refreshUsers} />
    //         <RegisterUsers onRegisterSuccess={handleUserRegistered} />
    //       </div>
    //     </ProtectedRoute>
    //   </div>
    // </AuthProvider>
    

    // PHASE 3: With Form Validation (UNCOMMENT WHEN READY)
    
    <AuthProvider>
      <div className="App w-full min-h-screen bg-gray-100">
        <LoginFormWithValidation />
        <ProtectedRoute>
          <div className="flex flex-col justify-center items-center pt-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-8">React + Express App</h1>
            <UserList refreshTrigger={refreshUsers} />
            <RegisterUsersWithValidation onRegisterSuccess={handleUserRegistered} />
          </div>
        </ProtectedRoute>
      </div>
    </AuthProvider>
    
  )
}

export default App

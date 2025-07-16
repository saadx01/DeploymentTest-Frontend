import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading, } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">🔒 Access Denied</p>
          <p>Please login to access this content.</p>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;


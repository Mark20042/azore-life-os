import { Navigate, Outlet } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuth";

export const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useAuthSession();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold animate-pulse">
          Loading Life OS...
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

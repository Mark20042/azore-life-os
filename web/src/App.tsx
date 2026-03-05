import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Login = () => <div className="p-8 text-2xl">Login Page Placeholder</div>;
const Register = () => (
  <div className="p-8 text-2xl">Register Page Placeholder</div>
);
const Dashboard = () => (
  <div className="p-8 text-2xl">Welcome to your Life OS Dashboard!</div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Only logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* If they visit the root URL '/', redirect them to the dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

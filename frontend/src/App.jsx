import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import PredictRole from "./pages/PredictRole";
import PredictionHistory from "./pages/PredictionHistory";
import InterviewAgent from "./pages/InterviewAgent";
import Dashboard from "./pages/Dashboard";
import JobSearch from "./pages/JobSearch";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predict-role"
          element={
            <ProtectedRoute>
              <PredictRole />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction-history"
          element={
            <ProtectedRoute>
              <PredictionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-agent"
          element={
            <ProtectedRoute>
              <InterviewAgent />
            </ProtectedRoute>
          }
        />


  
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobSearch />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
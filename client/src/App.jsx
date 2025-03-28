import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// import Dashboard from "./pages/dashboard/Dashboard";
import CandidateList from "./pages/candidates/CanditatesList";
// import CandidateDetails from "./pages/candidates/CandidateDetails";
import EmployeeList from "./pages/employees/EmployeeList";
// import EmployeeDetails from "./pages/employees/EmployeeDetails";
// import Attendance from "./pages/attendance/Attendance";
// import Leaves from "./pages/leaves/Leaves";
// import LeaveCalendar from "./pages/leaves/LeaveCalendar";
// import NotFound from "./pages/NotFound";

// Components
import Layout from "./components/layout/Layout";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CandidateList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/candidates" element={<CandidateList />} />
          {/* 
          <Route path="/candidatelist/:id" element={<CandidateDetails />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/leaves/calendar" element={<LeaveCalendar />} /> */}
        </Route>

        {/* Default Route for Unauthenticated Users */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Not Found Route */}
        <Route path="*" element={<CandidateList />} />
      </Routes>
    </Router>
  );
}

export default App;
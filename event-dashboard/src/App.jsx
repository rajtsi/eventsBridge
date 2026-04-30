import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import DeliveriesPage from "./pages/DeliveriesPage";
import DLQPage from "./pages/DLQPage";
import EventDetail from "./pages/EventDetail";


function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg transition ${location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="w-60 bg-white shadow-lg p-4 space-y-4">
      <h2 className="text-xl font-bold text-blue-600">EventBridge</h2>

      <nav className="space-y-2">
        <Link to="/" className={linkClass("/")}>Dashboard</Link>
        <Link to="/events" className={linkClass("/events")}>Events</Link>
        <Link to="/deliveries" className={linkClass("/deliveries")}>Deliveries</Link>
        <Link to="/dlq" className={linkClass("/dlq")}>Failed Jobs</Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/deliveries" element={<DeliveriesPage />} />
            <Route path="/dlq" element={<DLQPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
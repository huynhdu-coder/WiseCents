import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-100 p-4 shadow-sm flex justify-between items-center">
      <h2 className="text-wisegreen font-semibold">WiseCents Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Welcome back {user.first_name} 👋</span>
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
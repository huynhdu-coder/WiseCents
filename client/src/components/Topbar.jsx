import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="bg-gray-100 p-4 shadow-sm flex justify-between items-center">
      <h2 className="text-wisegreen font-semibold">WiseCents Dashboard</h2>
      <div className="text-sm text-gray-500">Welcome back {user.first_name} 👋</div>
    </header>
  );
}


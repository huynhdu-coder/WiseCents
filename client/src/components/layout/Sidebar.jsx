import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";
import ThemeToggle from "../ui/ThemeToggle";
import owlImage from "../../assets/owl-logo.png";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: HiOutlineHome },
  { label: "Reports", to: "/dashboard/reports", icon: HiOutlineChartBar },
  { label: "AI Chat", to: "/dashboard/chat", icon: HiOutlineChatBubbleLeftRight },
  { label: "Investments", to: "/dashboard/investments", icon: HiOutlineBanknotes },
  { label: "Settings", to: "/dashboard/settings", icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-full w-[250px] shrink-0 flex-col justify-between border-r border-white/10 bg-[#155740] px-4 py-6 text-white">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">
            <img src={owlImage} alt="WiseCents Owl" className="w-15 h-15" />
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight">WiseCents</h2>
            <p className="text-sm text-white/70">Budget smarter</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-md font-medium transition",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="text-lg" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-3">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-md font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
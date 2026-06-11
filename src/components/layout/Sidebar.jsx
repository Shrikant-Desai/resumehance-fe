import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Briefcase,
  BarChart3,
  LogOut,
  Plus,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Resumes", path: "/resumes", icon: FileText },
  { name: "Job Descriptions", path: "/jobs", icon: Briefcase },
  { name: "Analysis History", path: "/analysis", icon: BarChart3 },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 z-50
          bg-slate-50 dark:bg-slate-900
          border-r border-slate-200/50 dark:border-slate-800/50
          flex flex-col p-4 gap-2
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand Header */}
        <div className="mb-6 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight font-headline">
                Curator AI
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                Resume Matching
              </p>
            </div>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Active User Panel */}
        {user && (
          <div className="mt-auto mb-2 px-2">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/30 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active User
              </p>
              <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-300">
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="mt-2 text-left text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1.5 transition-colors"
                aria-label="Log out of your account"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            onClick={() => {
              navigate("/analysis");
              if (onClose) onClose();
            }}
            className="w-full bg-primary-gradient text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-95 hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            New Analysis
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

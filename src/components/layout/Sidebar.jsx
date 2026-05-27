import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Resumes", path: "/resumes", icon: "description" },
    { name: "Job Descriptions", path: "/jobs", icon: "work" },
    { name: "Analysis History", path: "/analysis", icon: "analytics" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col p-4 gap-2 z-50 border-r border-slate-200/50 dark:border-slate-800/50">
      {/* Brand Header */}
      <div className="mb-6 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center text-white shadow-md">
          <span className="material-symbols-outlined">auto_awesome</span>
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

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats / Storage panel */}
      {user && (
        <div className="mt-auto mb-2 px-2">
          <div className="p-4 rounded-xl bg-surface-container-high/50 dark:bg-slate-800/30 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Active User
            </p>
            <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-300">
              {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="mt-2 text-left text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Primary CTA */}
      <div className="pt-2">
        <button
          onClick={() => navigate("/analysis")}
          className="w-full bg-primary-gradient text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-95 hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Analysis
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

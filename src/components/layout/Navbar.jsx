import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, Bell, Settings, Menu } from "lucide-react";

const Navbar = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none flex justify-between items-center h-16 px-4 sm:px-8 select-none border-b border-slate-100 dark:border-slate-800/40">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h2 className="font-headline text-base sm:text-lg font-bold text-on-surface truncate max-w-[180px] sm:max-w-none">
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Search Input — hidden on small screens */}
        <div className="relative hidden md:flex items-center">
          <Search
            size={14}
            className="absolute left-3 text-slate-400 pointer-events-none"
          />
          <input
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-9 pr-4 py-1.5 text-xs w-56 lg:w-64 focus:ring-2 focus:ring-primary/20 dark:text-slate-200 outline-none transition-all"
            placeholder="Search resumes, jobs..."
            type="text"
            aria-label="Search resumes and jobs"
          />
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="View notifications"
          >
            <Bell size={18} />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </button>

          <Link to="/profile" className="flex items-center" aria-label="Go to profile">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "US"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8 select-none border-b border-slate-100 dark:border-slate-800/40">
      <div className="flex items-center gap-4">
        <h2 className="font-headline text-lg font-bold text-on-surface">
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-sm">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-slate-200 outline-none transition-all"
            placeholder="Search resumes, jobs..."
            type="text"
          />
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          <Link to="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center text-indigo-700 font-bold text-xs ring-1 ring-primary/20">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "US"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { toast } from "sonner";
import { LogOut, User, Mail, Shield, Calendar, Hash } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // API shape: { id, email, is_active, created_at }
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const displayName = user?.email ? user.email.split("@")[0] : "Active User";
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "US";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const infoFields = [
    {
      icon: Hash,
      label: "User ID",
      value: user?.id ?? "—",
    },
    {
      icon: Mail,
      label: "Registered Email",
      value: user?.email || "—",
    },
    {
      icon: Shield,
      label: "Account Status",
      value: user?.is_active ? "Active" : "Inactive",
      badge: user?.is_active ? "active" : "inactive",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: memberSince,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-left select-none max-w-3xl">
      <div>
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
          My Profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your account information linked to this ResumeHance session.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Avatar + Identity card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                {displayName}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
                {user?.email}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                  ResumeHance User
                </span>
                {user?.is_active && (
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-secondary dark:text-emerald-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2 cursor-pointer border border-rose-100 dark:border-rose-900/30 self-start sm:self-auto"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>

        {/* Account details (read-only) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Account Details
            </h4>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Read Only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {infoFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Icon size={10} />
                    {field.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {field.value}
                    </div>
                    {field.badge && (
                      <span
                        className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          field.badge === "active"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {field.value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <User size={18} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Profile updates are not available yet
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Account details like email and name are managed by the server. Profile editing
              will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

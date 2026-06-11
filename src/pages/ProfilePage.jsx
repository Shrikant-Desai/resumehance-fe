import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LogOut, User, Briefcase, Mail, Save } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: user?.email || "",
      fullName: user?.email ? user.email.split("@")[0] : "John Doe",
      title: "Senior Product Engineer",
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const onSubmit = () => {
    toast.success("Profile details updated successfully! (Mocked)");
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left select-none max-w-3xl">
      <div>
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
          Profile Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal details and credential preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* User details card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                {user?.email ? user.email.split("@")[0] : "Active User"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
                {user?.email}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                PRO Member
              </span>
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

        {/* Profile edit form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm">
          <h4 className="font-headline font-bold text-sm mb-5 sm:mb-6 uppercase tracking-widest text-slate-400">
            Edit Details
          </h4>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <User size={10} />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("fullName", { required: "Name is required" })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Briefcase size={10} />
                  Professional Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Mail size={10} />
                Registered Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="bg-primary-gradient text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer flex items-center gap-2"
            >
              <Save size={14} />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

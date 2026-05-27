import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
  } = useForm({
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
    <div className="space-y-8 text-left select-none max-w-3xl">
      <div>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight">Profile Settings</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage your personal details and credential preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* User details card */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-xl shadow-md">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold text-slate-800 dark:text-slate-200">
                {user?.email ? user.email.split("@")[0] : "Active User"}
              </h3>
              <p className="text-on-surface-variant text-xs mt-1 font-semibold">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                PRO Member
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-rose-100 transition-colors flex items-center gap-2 cursor-pointer border-none"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Log Out
          </button>
        </div>

        {/* Profile edit form */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/10 shadow-sm">
          <h4 className="font-headline font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">
            Edit Details
          </h4>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("fullName", { required: "Name is required" })}
                  className="w-full px-4 py-2.5 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-4 py-2.5 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Registered Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-2.5 bg-surface-container-highest dark:bg-slate-800 text-slate-500 border-none rounded-xl text-xs outline-none cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="bg-primary-gradient text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [themeMode, setThemeMode] = useState("light");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    toast.success("Security credentials updated! (Mocked)");
  };

  const handleToggleTheme = (mode) => {
    setThemeMode(mode);
    toast.success(`Theme mode updated to ${mode}! (UI Only)`);
  };

  return (
    <div className="space-y-8 text-left select-none max-w-3xl">
      <div>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight">System Settings</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage system configurations, notifications, and security preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Preferences */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/10 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
            Interface Theme
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Customize the look and feel of the Curator AI dashboard on your device.
          </p>
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleToggleTheme("light")}
              className={`px-6 py-3 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all flex items-center gap-2 border ${
                themeMode === "light"
                  ? "bg-white text-primary border-primary ring-2 ring-primary-fixed"
                  : "bg-surface-container-lowest text-slate-650 border-transparent hover:bg-white"
              }`}
            >
              <span className="material-symbols-outlined text-sm">light_mode</span>
              Light Mode
            </button>

            <button
              onClick={() => handleToggleTheme("dark")}
              className={`px-6 py-3 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all flex items-center gap-2 border ${
                themeMode === "dark"
                  ? "bg-slate-800 text-indigo-400 border-indigo-400 ring-2 ring-indigo-950"
                  : "bg-surface-container-lowest text-slate-650 border-transparent hover:bg-white"
              }`}
            >
              <span className="material-symbols-outlined text-sm">dark_mode</span>
              Dark Mode
            </button>
          </div>
        </div>

        {/* Security / Password updates */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/10 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
            Security & Authentication
          </h4>
          <form onSubmit={handleSaveSecurity} className="space-y-4 max-w-md">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-gradient text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Alert configs */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/10 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
            Notifications
          </h4>
          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between cursor-pointer max-w-md">
              <div>
                <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Email Analysis Alerts</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  Receive email digest once parsing runs are completed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="rounded text-primary focus:ring-primary/20"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer max-w-md border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div>
                <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Weekly Performance Summary</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  Get weekly reviews of top matching statistics and learning roadmaps.
                </p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={() => setWeeklyDigest(!weeklyDigest)}
                className="rounded text-primary focus:ring-primary/20"
              />
            </label>
          </div>
        </div>

        {/* API Limit statistics */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/10 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
            Storage & API Quotas
          </h4>
          <div className="flex flex-col gap-2 pt-2 max-w-md">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">Gemini Parsing Credits</p>
            <div className="w-full h-2 bg-surface-container-highest dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-primary-gradient rounded-full"></div>
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-medium mt-1">
              <span>750 Used</span>
              <span>1000 Total Credits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

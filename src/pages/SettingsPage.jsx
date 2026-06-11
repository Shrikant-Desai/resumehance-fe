import { useState } from "react";
import { toast } from "sonner";
import { Sun, Moon, Shield, Bell, Database, Check } from "lucide-react";

const ToggleSwitch = ({ checked, onChange, id }) => (
  <button
    role="switch"
    id={id}
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 cursor-pointer shrink-0 ${
      checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const SettingsPage = () => {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);


  const handleToggleTheme = (mode) => {
    setThemeMode(mode);
    localStorage.setItem("theme", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    toast.success(`Theme mode updated to ${mode}!`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left select-none max-w-3xl">
      <div>
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
          System Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage system configurations, notifications, and security preferences.
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {/* Theme Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Sun size={16} className="text-amber-500" />
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Interface Theme
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Customize the look and feel of the Curator AI dashboard on your device.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleToggleTheme("light")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all border ${
                themeMode === "light"
                  ? "bg-white text-primary border-primary ring-2 ring-indigo-100"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700"
              }`}
              aria-pressed={themeMode === "light"}
            >
              <Sun size={14} />
              Light Mode
              {themeMode === "light" && <Check size={12} className="ml-1 text-primary" />}
            </button>

            <button
              onClick={() => handleToggleTheme("dark")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all border ${
                themeMode === "dark"
                  ? "bg-slate-800 text-indigo-400 border-indigo-400 ring-2 ring-indigo-950"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700"
              }`}
              aria-pressed={themeMode === "dark"}
            >
              <Moon size={14} />
              Dark Mode
              {themeMode === "dark" && <Check size={12} className="ml-1 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* Security / Password updates */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-primary" />
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Security &amp; Authentication
            </h4>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 flex items-start gap-3">
            <Shield size={16} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password management coming soon
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Password change and account security features are not yet available in this version.
                They will be added in a future update.
              </p>
            </div>
          </div>
        </div>

        {/* Alert configs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} className="text-secondary" />
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Notifications
            </h4>
          </div>
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between gap-4 max-w-md">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Email Analysis Alerts
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Receive email digest once parsing runs are completed.
                </p>
              </div>
              <ToggleSwitch
                id="email-alerts"
                checked={emailAlerts}
                onChange={setEmailAlerts}
              />
            </div>

            <div className="flex items-center justify-between gap-4 max-w-md border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Weekly Performance Summary
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Get weekly reviews of top matching statistics and learning roadmaps.
                </p>
              </div>
              <ToggleSwitch
                id="weekly-digest"
                checked={weeklyDigest}
                onChange={setWeeklyDigest}
              />
            </div>
          </div>
        </div>

        {/* API Limit statistics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Database size={16} className="text-amber-500" />
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Storage &amp; API Quotas
            </h4>
          </div>
          <div className="flex flex-col gap-2.5 pt-2 max-w-md">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Gemini Parsing Credits
            </p>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-primary-gradient rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
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

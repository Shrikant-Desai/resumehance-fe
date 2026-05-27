import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const location = useLocation();

  // Determine navbar title based on path
  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard Overview";
    if (path.startsWith("/resumes")) return "Resume Library";
    if (path.startsWith("/jobs")) return "Job Descriptions Library";
    if (path.startsWith("/analysis")) {
      if (path.includes("/run") || path.split("/").length > 2) {
        return "Match Analysis Results";
      }
      return "New Match Analysis";
    }
    if (path.startsWith("/profile")) return "Account Profile";
    if (path.startsWith("/settings")) return "System Settings";
    return "Curator AI Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Right Area */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen relative">
        <Navbar title={getTitle()} />

        {/* Dynamic Page Content */}
        <main className="flex-grow p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

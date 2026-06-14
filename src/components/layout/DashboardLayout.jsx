import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine navbar title based on path
  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard Overview";
    if (path.startsWith("/resumes")) return "Resume Library";
    if (path.startsWith("/jobs")) return "Job Descriptions Library";
    if (path.startsWith("/analysis")) {
      if (path === "/analysis/new") return "New Match Analysis";
      if (path.split("/").length > 2 && path !== "/analysis/new") return "Match Analysis Results";
      return "Analysis History";
    }
    if (path.startsWith("/profile")) return "Account Profile";
    if (path.startsWith("/settings")) return "System Settings";
    return "Curator AI Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Right Area — full width on mobile, offset on desktop */}
      <div className="flex-1 flex flex-col min-h-screen relative lg:ml-64 w-full min-w-0">
        <Navbar
          title={getTitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

// layout/dashboardLayout.jsx
export const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </div>
);

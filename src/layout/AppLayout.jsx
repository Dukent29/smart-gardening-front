import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const AppLayout = ({ children, title = "Page Title" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Header */}
      <Header title={title} />

      {/* Body */}
      <main className="flex-1 w-full max-w-md mx-auto overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
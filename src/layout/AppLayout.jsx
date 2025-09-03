import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const AppLayout = ({ children, title = "Page Title" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header title={title} />
      </div>

      {/* Scrollable Body with proper spacing */}
      <main className="flex-1 w-full max-w-lg mx-auto pt-20 pb-24 overflow-y-auto min-h-screen bg-[#E7EFEA]">
        {children}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
};
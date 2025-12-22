import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="flex gap-1 min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1">
        <div className="w-full min-h-screen mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

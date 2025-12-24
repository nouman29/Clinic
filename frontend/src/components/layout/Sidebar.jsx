import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const allLinks = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "doctor", "nurse", "patient"] },
  { to: "/settings", label: "Profile / Settings", roles: ["admin", "doctor", "nurse", "patient"] },

  // Admin Only
  { to: "/doctors", label: "Doctors", roles: ["admin"] },
  { to: "/nurses", label: "Nurses", roles: ["admin"] },
  { to: "/medicines", label: "Medicines", roles: ["admin"] },
  { to: "/reports", label: "Reports / Analytics", roles: ["admin"] },
  { to: "/system-settings", label: "User Management", roles: ["admin"] },

  // Shared Admin/Staff
  { to: "/patients", label: "Patients", roles: ["admin"] },
  { to: "/my-patients", label: "My Patients", roles: ["doctor"] },
  { to: "/assigned-patients", label: "Assigned Patients", roles: ["nurse"] },

  { to: "/appointments", label: "Appointments", roles: ["admin", "doctor", "nurse"] },
  { to: "/my-appointments", label: "My Appointments", roles: ["patient"] },
  { to: "/book-appointment", label: "Book Appointment", roles: ["patient"] },

  { to: "/prescriptions", label: "Prescriptions", roles: ["admin", "doctor", "patient"] },
  { to: "/lab-reports", label: "Lab Reports", roles: ["doctor"] },
  { to: "/patient-vitals", label: "Vitals / Updates", roles: ["nurse"] },

  { to: "/billing", label: "Billing / Payments", roles: ["admin", "patient"] },
];

function NavItems({ onNavigate, role }) {
  const filteredLinks = allLinks.filter(link => link.roles.includes(role));

  return (
    <nav className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-lg transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-black hover:bg-accent hover:text-accent-foreground"
              }`
            }
            onClick={onNavigate}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="border-r bg-green-100 h-screen text-black">
      <div className="hidden w-56 min-h-screen justify-between flex-col gap-4 p-4 md:flex">
        <div className="">
          <h1 className="text-5xl text-center font-semibold mb-5 text-primary">Clinic</h1>
          <NavItems role={user?.role} />
        </div>
        <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="flex items-center gap-2 p-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="mb-4 text-lg font-semibold">Clinic</div>
            <NavItems role={user?.role} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="text-lg font-semibold ">Clinic</div>
      </div>
    </aside>
  );
}


import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { logout } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/patients", label: "Patients" },
  { to: "/prescriptions", label: "Prescriptions" },
  { to: "/doctor-profile", label: "Doctor Profile" },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {links.map((link) => (
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="border-r bg-green-100 h-screen text-black">
      <div className="hidden w-56 min-h-screen justify-between flex-col gap-4 p-4 md:flex">
        <div className="">
          <h1 className="text-5xl text-center font-semibold mb-5 text-primary">Clinic</h1>
          <NavItems onLogout={handleLogout} />
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
            <NavItems onNavigate={() => setOpen(false)} onLogout={() => { handleLogout(); setOpen(false); }} />
          </SheetContent>
        </Sheet>
        <div className="text-lg font-semibold ">Clinic</div>
      </div>
    </aside>
  );
}


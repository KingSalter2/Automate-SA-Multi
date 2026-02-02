
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  CreditCard,
  Layers,
  ToggleLeft,
  ShieldAlert,
  MessageSquare,
  BarChart3,
  Megaphone,
  FileClock,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";

const SupaAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOutUser } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/ops" },
    { icon: Users, label: "Clients & Onboarding", path: "/ops/clients" },
    { icon: MessageSquare, label: "Tickets", path: "/ops/tickets" },
    { icon: Layers, label: "Tier Management", path: "/ops/tiers" },
    { icon: ToggleLeft, label: "Feature Control", path: "/ops/features" },
    { icon: CreditCard, label: "Billing Status", path: "/ops/billing" },
    { icon: BarChart3, label: "Advanced Analytics", path: "/ops/analytics" },
    { icon: Megaphone, label: "Announcements", path: "/ops/announcements" },
    { icon: FileClock, label: "Audit Logs", path: "/ops/audit-logs" },
    { icon: Shield, label: "Admin Team", path: "/ops/team" },
  ];

  return (
    <div className="h-screen overflow-hidden bg-secondary/30 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <Link to="/ops" className="text-xl font-display font-bold text-primary">
                SupaAdmin
              </Link>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start gap-3 mb-1"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Profile & Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Link to="/ops/settings">
              <Button 
                variant={location.pathname === "/ops/settings" ? "default" : "ghost"} 
                className="w-full justify-start gap-3 mb-1"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-accent cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                SA
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Super Admin</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Super Administrator Access
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-secondary/30 p-6 lg:p-8 text-foreground">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="flex-shrink-0 py-4 px-6 border-t border-border bg-card flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground z-10">
          <p>© 2026 EB Motors. All rights reserved. | Registered Motor Dealer</p>
          <p>Built by <a href="https://www.rabbit365.co.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Rabbit 365</a></p>
        </footer>
      </div>
    </div>
  );
};

export default SupaAdminLayout;

import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut,
  Menu,
  X,
  Car,
  MessageSquare,
  FileText,
  BarChart3,
  ClipboardList,
  Shield,
  LifeBuoy,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mockAnnouncements } from "@/data/mockSupaAdmin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/auth/AuthContext";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeAnnouncement, setActiveAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOutUser } = useAuth();

  useEffect(() => {
    // Find the latest 'Sent' announcement
    const latestAnnouncement = mockAnnouncements
      .filter(a => a.status === 'Sent')
      .sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0))[0];
    
    if (latestAnnouncement) {
      setActiveAnnouncement(latestAnnouncement);
    }
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/portal" },
    { icon: BarChart3, label: "Analytics", path: "/portal/analytics" },
    { icon: MessageSquare, label: "Communication", path: "/portal/communication" },
    { icon: ClipboardList, label: "Assignments", path: "/portal/assignments" },
    { icon: Users, label: "Leads & CRM", path: "/portal/leads" },
    { icon: Car, label: "Inventory", path: "/portal/inventory" },
    { icon: FileText, label: "Sales Records", path: "/portal/sales" },
    { icon: CalendarIcon, label: "Calendar", path: "/portal/calendar" },
    { icon: Shield, label: "System Logs", path: "/portal/logs" },
    { icon: LifeBuoy, label: "Support", path: "/portal/support" },
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
            <Link to="/" className="text-2xl font-display font-bold text-primary">
              EB Motors
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-2">
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

          {/* User Profile */}
          <div className="p-4 border-t border-border space-y-2">
            <Link to="/portal/settings">
              <Button 
                variant={location.pathname === "/portal/settings" ? "default" : "ghost"} 
                className="w-full justify-start gap-3 mb-1"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
            
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-accent cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    RA
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">Rameez Admin</p>
                    <p className="text-xs text-muted-foreground truncate">Admin</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>My Profile</DialogTitle>
                  <DialogDescription>
                    View and manage your account details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                      RA
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Rameez Admin</h3>
                      <p className="text-sm text-muted-foreground">Admin</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <div className="p-2 border rounded-md bg-muted/50 text-sm">rameez@ebmotors.co.za</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <div className="p-2 border rounded-md bg-muted/50 text-sm">+27 82 123 4567</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">All Access</Badge>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="w-full gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Mobile Only) */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:hidden flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-4 font-bold">Dashboard</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeAnnouncement && showAnnouncement && (
            <Alert 
              className={cn(
                "mb-6 relative pr-10", 
                activeAnnouncement.type === 'Warning' ? "border-amber-500/50 text-amber-600 dark:border-amber-500/30 dark:text-amber-500 bg-amber-500/10" :
                activeAnnouncement.type === 'Critical' ? "border-destructive/50 text-destructive dark:border-destructive/30 bg-destructive/10" :
                activeAnnouncement.type === 'Success' ? "border-green-500/50 text-green-600 dark:border-green-500/30 dark:text-green-500 bg-green-500/10" :
                "bg-primary/5 border-primary/20 text-primary"
              )}
            >
              <Megaphone className="h-4 w-4" />
              <AlertTitle>{activeAnnouncement.title}</AlertTitle>
              <AlertDescription>
                {activeAnnouncement.message}
              </AlertDescription>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 hover:bg-transparent"
                onClick={() => setShowAnnouncement(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </Alert>
          )}
          <Outlet />
        </div>
          
        {/* Dashboard Footer */}
        <footer className="flex-shrink-0 py-4 px-6 border-t border-border bg-card flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground z-10">
          <p>© 2026 EB Motors. All rights reserved. | Registered Motor Dealer</p>
          <p>Built by <a href="https://www.rabbit365.co.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Rabbit 365</a></p>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;

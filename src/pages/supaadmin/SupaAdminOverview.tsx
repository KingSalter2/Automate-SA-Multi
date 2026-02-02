
import { 
  Users, 
  DollarSign, 
  Activity, 
  ArrowUpRight,
  Building2,
  Settings
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { singleClient } from "@/data/mockSupaAdmin";

const SupaAdminOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Managing {singleClient.name}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/ops/clients">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Client Configuration
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{singleClient.status}</div>
            <p className="text-xs text-muted-foreground mt-1">{singleClient.tier} Plan</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R 4,999</div>
            <p className="text-xs text-muted-foreground mt-1">Next billing: {singleClient.nextBillingDate.toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">148</div>
            <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">System Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { event: "Daily backup completed", time: "2 hours ago" },
                { event: "New feature 'Social Media' enabled", time: "Yesterday" },
                { event: "Monthly invoice generated", time: "2 days ago" }
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Management Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/ops/clients">
              <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                <Settings className="mr-2 h-4 w-4" />
                Configure Dealership
              </Button>
            </Link>
            <Link to="/ops/features">
              <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                <Activity className="mr-2 h-4 w-4" />
                Manage Features
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupaAdminOverview;

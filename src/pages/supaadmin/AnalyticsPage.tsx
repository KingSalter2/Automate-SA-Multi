import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Users, Activity, HardDrive, FileText, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const AnalyticsPage = () => {
  // Single Tenant / System Admin Metrics
  const metrics = {
    systemHealth: { label: 'System Uptime', value: '99.9%', change: 0.1, trend: 'up' as const },
    activeUsers: { label: 'Active Users', value: '8', change: 2, trend: 'up' as const },
    storage: { label: 'Storage Used', value: '45 GB', change: 1.2, trend: 'up' as const }, // increasing storage is "neutral" or "up" in usage
    apiCalls: { label: 'API Requests (24h)', value: '14.2k', change: -5.4, trend: 'down' as const }
  };

  // Mock data for System Load (last 24 hours or 6 days)
  const systemLoadData = [
    { time: '00:00', load: 12 },
    { time: '04:00', load: 8 },
    { time: '08:00', load: 45 },
    { time: '12:00', load: 78 },
    { time: '16:00', load: 65 },
    { time: '20:00', load: 34 },
  ];

  // Mock data for Feature Usage (Top features used by the single tenant)
  const featureUsageData = [
    { name: 'Inventory', usage: 1450 },
    { name: 'CRM', usage: 980 },
    { name: 'Invoicing', usage: 450 },
    { name: 'Reports', usage: 120 },
    { name: 'Settings', usage: 50 },
  ];

  interface MetricCardProps {
    title: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    icon: React.ElementType;
    inverseTrend?: boolean; // if true, 'up' is bad (e.g. error rate)
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, inverseTrend }: MetricCardProps) => {
    const isPositive = inverseTrend ? trend === 'down' : trend === 'up';
    const isNegative = inverseTrend ? trend === 'up' : trend === 'down';

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            <div className={cn(
              "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
              isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
              isNegative ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
               trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : 
               <Minus className="w-3 h-3 mr-1" />}
              {Math.abs(change)}%
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground">Monitor system health and resource usage.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title={metrics.systemHealth.label} 
          value={metrics.systemHealth.value} 
          change={metrics.systemHealth.change} 
          trend={metrics.systemHealth.trend} 
          icon={Activity} 
        />
        <MetricCard 
          title={metrics.activeUsers.label} 
          value={metrics.activeUsers.value} 
          change={metrics.activeUsers.change} 
          trend={metrics.activeUsers.trend} 
          icon={Users} 
        />
        <MetricCard 
          title={metrics.storage.label} 
          value={metrics.storage.value} 
          change={metrics.storage.change} 
          trend={metrics.storage.trend} 
          icon={HardDrive} 
        />
        <MetricCard 
          title={metrics.apiCalls.label} 
          value={metrics.apiCalls.value} 
          change={metrics.apiCalls.change} 
          trend={metrics.apiCalls.trend} 
          icon={Server} 
          inverseTrend // Less API calls might be neutral, but let's say "down" is good for load? Or "up" is usage? Let's keep it simple. Actually, let's treat "down" as "less load" -> good? No, usually usage implies value. Let's just standard trend.
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>System Load (CPU %)</CardTitle>
            <CardDescription>
              Average CPU utilization over the last 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={systemLoadData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="load" stroke="#8884d8" fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Module Usage</CardTitle>
            <CardDescription>
              Most active system modules by interaction count.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={featureUsageData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="usage" fill="#adfa1d" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;

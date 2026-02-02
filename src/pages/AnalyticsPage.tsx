import { useState, useMemo, type ReactNode } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieChartIcon,
  Target,
  Activity,
  CreditCard,
  Download,
  Clock,
  Briefcase,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockLeads, mockSalespeople } from "@/data/mockLeads";
import { mockSoldLeads, mockSoldVehicles } from "@/data/mockSalesData";
import { mockVehicles } from "@/data/mockVehicles";
import { mockTasks } from "@/data/mockTasks";
import { format, isWithinInterval, startOfDay, subDays, subMonths, startOfYear, parseISO, differenceInDays, isSameMonth } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { downloadCSV } from "@/utils/exportUtils";
import { Badge } from "@/components/ui/badge";
import { type TaskStatus } from "@/types/task";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("this_month");

  // --- Helper Functions ---
  const getDateRange = (range: string) => {
    const now = new Date();
    switch (range) {
      case "today": return { start: startOfDay(now), end: now };
      case "this_week": return { start: subDays(now, 7), end: now };
      case "this_month": return { start: subMonths(now, 1), end: now };
      case "last_month": return { start: subMonths(now, 2), end: subMonths(now, 1) };
      case "this_year": return { start: startOfYear(now), end: now };
      case "all_time": return { start: new Date(0), end: now };
      default: return { start: subMonths(now, 1), end: now };
    }
  };

  const { start, end } = getDateRange(timeRange);

  const isInPeriod = (date: Date) => isWithinInterval(date, { start, end });

  // --- Data Filtering & Aggregation ---

  // 1. Sales Data (Filtered by Period)
  const periodSoldLeads = useMemo(() => 
    mockSoldLeads.filter(l => l.saleDetails?.soldDate && isInPeriod(l.saleDetails.soldDate)), 
  [timeRange]);

  const periodRevenue = periodSoldLeads.reduce((sum, l) => sum + (l.saleDetails?.salePrice || 0), 0);
  
  // 2. Leads Data (Created in Period)
  const periodNewLeads = useMemo(() => 
    mockLeads.filter(l => isInPeriod(l.createdAt)), 
  [timeRange]);

  const periodTestDrives = useMemo(() => 
    mockLeads.filter(l => l.status === 'test-drive' && isInPeriod(l.createdAt)), // Using createdAt as proxy for activity in this mock
  [timeRange]);

  // 3. Inventory Data (Snapshot - usually strictly "current", but we can show added stock in period)
  const currentStock = mockVehicles.filter(v => v.status === 'available');
  const stockValue = currentStock.reduce((sum, v) => sum + v.price, 0);
  const stockCount = currentStock.length;

  // 4. Staff Performance
  const staffPerformance = useMemo(() => {
    return mockSalespeople.map(staff => {
      const sold = periodSoldLeads.filter(l => l.assignedTo === staff.name);
      const active = mockLeads.filter(l => l.assignedTo === staff.name && !['sold', 'lost'].includes(l.status));
      const testDrives = mockLeads.filter(l => l.assignedTo === staff.name && l.status === 'test-drive');
      
      const revenue = sold.reduce((sum, l) => sum + (l.saleDetails?.salePrice || 0), 0);
      
      return {
        name: staff.name,
        soldCount: sold.length,
        activeLeads: active.length,
        testDrives: testDrives.length,
        revenue,
        activeLeadDetails: active
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [periodSoldLeads, mockLeads]);

  // 5. Conversion Metrics
  const avgConversionDays = useMemo(() => {
    if (periodSoldLeads.length === 0) return 0;
    const totalDays = periodSoldLeads.reduce((sum, lead) => {
      if (!lead.saleDetails?.soldDate) return sum;
      return sum + differenceInDays(lead.saleDetails.soldDate, lead.createdAt);
    }, 0);
    return Math.round(totalDays / periodSoldLeads.length);
  }, [periodSoldLeads]);

  // 6. Charts Data
  const salesTrendData = useMemo(() => {
    // Generate last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push({
        name: format(date, 'MMM'),
        fullName: format(date, 'MMMM yyyy'),
        date: date
      });
    }

    return months.map(month => {
      const monthSales = mockSoldLeads.filter(l => 
        l.saleDetails?.soldDate && isSameMonth(l.saleDetails.soldDate, month.date)
      );
      
      const revenue = monthSales.reduce((sum, l) => sum + (l.saleDetails?.salePrice || 0), 0);
      
      return {
        name: month.name,
        revenue: revenue,
        count: monthSales.length
      };
    });
  }, []);

  const leadSourceData = useMemo(() => {
    const sources = mockLeads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    })).sort((a, b) => b.value - a.value);
  }, []);

  // --- Task Analytics Data ---
  const taskAnalytics = useMemo(() => {
    // 1. Extend mock tasks with synthetic data for better visualization
    const syntheticTasks = [...mockTasks];
    const statuses: TaskStatus[] = ['completed', 'completed', 'rejected', 'in-progress', 'pending'];
    const staff = mockSalespeople.map(s => s.name);
    
    // Generate some history
    for (let i = 0; i < 50; i++) {
        const randomStaff = staff[Math.floor(Math.random() * staff.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomDate = subDays(new Date(), Math.floor(Math.random() * 30));
        
        syntheticTasks.push({
            id: `st-${i}`,
            title: `Task ${i}`,
            description: "Generated task",
            assignedTo: randomStaff,
            assignedBy: "Admin",
            priority: Math.random() > 0.5 ? "high" : "medium",
            status: randomStatus,
            dueDate: new Date(),
            type: "lead",
            createdAt: randomDate,
            rejectionReason: randomStatus === 'rejected' ? "Workload too high" : undefined
        });
    }

    const filteredTasks = syntheticTasks.filter(t => isInPeriod(t.createdAt));

    // Metrics
    const completedCount = filteredTasks.filter(t => t.status === 'completed').length;
    const rejectedCount = filteredTasks.filter(t => t.status === 'rejected').length;
    const pendingCount = filteredTasks.filter(t => t.status === 'pending').length;
    const inProgressCount = filteredTasks.filter(t => t.status === 'in-progress').length;

    // Leaderboards
    const completers = staff.map(name => ({
        name,
        value: filteredTasks.filter(t => t.assignedTo === name && t.status === 'completed').length
    })).sort((a, b) => b.value - a.value);

    const rejectors = staff.map(name => ({
        name,
        value: filteredTasks.filter(t => t.assignedTo === name && t.status === 'rejected').length
    })).sort((a, b) => b.value - a.value);

    // Charts
    const statusDistribution = [
        { name: 'Completed', value: completedCount, color: '#10b981' },
        { name: 'In Progress', value: inProgressCount, color: '#3b82f6' },
        { name: 'Pending', value: pendingCount, color: '#f59e0b' },
        { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
    ];

    // Rejections over time
    const rejectionsTrend = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i * 5); // Group by 5 days chunks approximately
        const label = format(date, 'dd MMM');
        const count = filteredTasks.filter(t => 
            t.status === 'rejected' && 
            differenceInDays(t.createdAt, date) < 5 && differenceInDays(t.createdAt, date) >= 0
        ).length;
        rejectionsTrend.push({ name: label, value: count });
    }

    return {
        completedCount,
        rejectedCount,
        pendingCount,
        completers,
        rejectors,
        statusDistribution,
        rejectionsTrend
    };
  }, [timeRange]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


  // --- Exports ---
  const handleExport = (format: 'csv' | 'excel') => {
    const extension = format === 'excel' ? 'xls' : 'csv';
    
    // Summary Data
    const summaryData = [{
      ReportPeriod: timeRange,
      TotalRevenue: periodRevenue,
      CarsSold: periodSoldLeads.length,
      NewLeads: periodNewLeads.length,
      TestDrives: periodTestDrives.length,
      AvgConversionDays: avgConversionDays,
      CurrentStockCount: stockCount,
      CurrentStockValue: stockValue
    }];
    downloadCSV(summaryData, `analytics_summary_${timeRange}`, extension);

    // Staff Performance Data
    const staffData = staffPerformance.map(s => ({
      StaffMember: s.name,
      Revenue: s.revenue,
      CarsSold: s.soldCount,
      ActiveLeads: s.activeLeads,
      TestDrives: s.testDrives
    }));
    downloadCSV(staffData, `staff_performance_${timeRange}`, extension);
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">Performance metrics, sales trends, and inventory analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="all_time">Overall Period</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Revenue" 
          value={formatCurrency(periodRevenue)} 
          subtext="in selected period"
          trend="up" 
          icon={DollarSign}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <KPICard 
          title="Cars Sold" 
          value={periodSoldLeads.length.toString()} 
          subtext="deals closed"
          trend="up" 
          icon={Car}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <KPICard 
          title="New Leads" 
          value={periodNewLeads.length.toString()} 
          subtext={`${periodTestDrives.length} test drives`}
          trend="down" 
          icon={Users}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <KPICard 
          title="Avg. Conversion" 
          value={`${avgConversionDays} Days`} 
          subtext="lead to sale"
          trend="up" 
          icon={Clock}
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `R${value / 1000}k`} 
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your customers are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Staff Leaderboard */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Staff Performance
                </CardTitle>
                <CardDescription>Sales activity and results by team member</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead className="text-center">Sold</TableHead>
                      <TableHead className="text-center">Active Leads</TableHead>
                      <TableHead className="text-center">Test Drives</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffPerformance.map((staff) => (
                      <TableRow key={staff.name}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                            {staff.soldCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{staff.activeLeads}</TableCell>
                        <TableCell className="text-center">{staff.testDrives}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(staff.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Current Stock Snapshot */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Live Inventory
                </CardTitle>
                <CardDescription>Current stock on floor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                  <p className="text-4xl font-bold text-foreground">{stockCount}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stockValue)}</p>
                  <p className="text-xs text-muted-foreground">Estimated retail value excluding trade-ins and discounts</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Available</span>
                    <span className="font-bold">{currentStock.filter(v => v.status === 'available').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reserved</span>
                    <span className="font-bold">{mockVehicles.filter(v => v.status === 'reserved').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
           {/* Active Assignments */}
           <Card>
            <CardHeader>
              <CardTitle>Active Lead Assignments</CardTitle>
              <CardDescription>Who is working on what right now</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffPerformance.map(staff => (
                  <div key={staff.name} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold">{staff.name}</h3>
                      <Badge variant="outline">{staff.activeLeads} Active</Badge>
                    </div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {staff.activeLeadDetails.length > 0 ? (
                        staff.activeLeadDetails.map(lead => (
                          <div key={lead.id} className="text-sm p-2 bg-secondary/30 rounded flex justify-between items-center">
                            <span className="truncate max-w-[120px]" title={lead.customerName}>{lead.customerName}</span>
                            <span className="text-xs text-muted-foreground capitalize">{lead.status}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No active leads</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Age & Turn Rate</CardTitle>
              <CardDescription>Analysis of inventory age and movement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Stock #</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Days in Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStock.map(vehicle => {
                    const daysInStock = differenceInDays(new Date(), vehicle.createdAt);
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</TableCell>
                        <TableCell className="font-mono text-xs">{vehicle.stockNumber}</TableCell>
                        <TableCell>{formatCurrency(vehicle.price)}</TableCell>
                        <TableCell>
                          <Badge variant={daysInStock > 60 ? "destructive" : daysInStock > 30 ? "secondary" : "outline"}>
                            {daysInStock} Days
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{vehicle.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <KPICard 
              title="Tasks Completed" 
              value={taskAnalytics.completedCount.toString()} 
              subtext="successfully finished"
              trend="up" 
              icon={Activity}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <KPICard 
              title="Tasks Rejected" 
              value={taskAnalytics.rejectedCount.toString()} 
              subtext="marked as rejected"
              trend="down" 
              icon={Activity}
              color="text-red-600"
              bg="bg-red-50"
            />
            <KPICard 
              title="Pending Tasks" 
              value={taskAnalytics.pendingCount.toString()} 
              subtext="awaiting action"
              trend="neutral" 
              icon={Clock}
              color="text-amber-600"
              bg="bg-amber-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Breakdown of all tasks by current status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskAnalytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskAnalytics.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rejection Trends</CardTitle>
                <CardDescription>Number of rejected tasks over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskAnalytics.rejectionsTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejections" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card>
              <CardHeader>
                <CardTitle>Top Completers</CardTitle>
                <CardDescription>Staff with most completed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead className="text-right">Completed Tasks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskAnalytics.completers.map((staff) => (
                      <TableRow key={staff.name}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {staff.value}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Rejectors</CardTitle>
                <CardDescription>Staff with most rejected tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead className="text-right">Rejected Tasks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskAnalytics.rejectors.map((staff) => (
                      <TableRow key={staff.name}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {staff.value}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type KPITrend = "up" | "down" | "neutral";

interface KPICardProps {
  title: string;
  value: string;
  subtext: ReactNode;
  trend?: KPITrend;
  icon: LucideIcon;
  color: string;
  bg: string;
}

function KPICard({ title, value, subtext, icon: Icon, color, bg }: KPICardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${bg} ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          {subtext}
        </div>
      </CardContent>
    </Card>
  );
}

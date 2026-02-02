import { useState } from "react";
import { 
  FileClock, 
  Search, 
  Filter, 
  Download, 
  ShieldAlert,
  User,
  Settings,
  CreditCard,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSystemLogs } from "@/data/mockSupaAdmin";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const AuditLogsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const filteredLogs = mockSystemLogs.filter(log => {
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = actionFilter === "All" || log.action.includes(actionFilter);
    
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    // Generate CSV content
    const headers = ["Timestamp", "Admin User", "Action", "Target", "Details", "IP Address"];
    const rows = filteredLogs.map(log => [
      format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      log.adminName,
      log.action,
      log.target,
      `"${log.details.replace(/"/g, '""')}"`, // Escape quotes
      log.ipAddress
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredLogs.length} logs to CSV.`,
    });
  };

  const getActionIcon = (action: string) => {
    if (action.includes("Client")) return <User className="w-4 h-4 text-blue-500" />;
    if (action.includes("Plan") || action.includes("Tier")) return <CreditCard className="w-4 h-4 text-green-500" />;
    if (action.includes("Feature")) return <Zap className="w-4 h-4 text-amber-500" />;
    if (action.includes("Security") || action.includes("Suspended")) return <ShieldAlert className="w-4 h-4 text-red-500" />;
    return <Settings className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Track all administrative actions and system changes.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>System Activity</CardTitle>
              <CardDescription>
                Viewing {filteredLogs.length} records
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Actions</SelectItem>
                  <SelectItem value="Client">Client Mgmt</SelectItem>
                  <SelectItem value="Plan">Billing & Plans</SelectItem>
                  <SelectItem value="Feature">Features</SelectItem>
                  <SelectItem value="Ticket">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {format(log.timestamp, 'MMM d, HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {log.adminName.charAt(0)}
                      </div>
                      <span className="font-medium">{log.adminName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit items-center gap-1 font-normal">
                      {getActionIcon(log.action)}
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {log.target}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;

import { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Smartphone, 
  Monitor, 
  Globe,
  Clock,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockLogs } from "@/data/mockLogs";
import { downloadCSV } from "@/utils/exportUtils";
import { format } from "date-fns";

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Format date helper
  const formatDate = (date: Date) => format(date, 'HH:mm:ss');
  const formatFullDate = (date: Date) => format(date, 'dd MMM yyyy');

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      const matchesSearch = 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery) ||
        log.userId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAction = filterAction === "all" || log.action === filterAction;
      const matchesStatus = filterStatus === "all" || log.status === filterStatus;

      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [searchQuery, filterAction, filterStatus]);

  const handleExport = () => {
    const dataToExport = filteredLogs.map(log => ({
      Event_Time: format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      Login_Time: log.loginTimestamp ? format(log.loginTimestamp, 'HH:mm:ss') : (log.action === 'LOGIN' ? format(log.timestamp, 'HH:mm:ss') : '-'),
      Logout_Time: log.action === 'LOGOUT' ? format(log.timestamp, 'HH:mm:ss') : '-',
      User: log.userName,
      Role: log.userRole,
      Action: log.action,
      Status: log.status,
      IP_Address: log.ipAddress,
      Location: log.location,
      Device: log.deviceInfo,
      Details: log.details || '',
      Session_Duration: log.sessionDuration || ''
    }));
    
    downloadCSV(dataToExport, 'system_logs', 'csv');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'LOGOUT': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'FAILED_LOGIN': return 'bg-red-100 text-red-700 border-red-200';
      case 'PASSWORD_CHANGE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PROFILE_UPDATE': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'error': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default: return <ShieldAlert className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor user access, security events, and system activities.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <CardTitle className="text-lg font-medium">Activity Log</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search user, IP, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="secondary">Search</Button>
              </div>
              <div className="flex gap-2">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="LOGOUT">Logout</SelectItem>
                    <SelectItem value="FAILED_LOGIN">Failed Login</SelectItem>
                    <SelectItem value="PASSWORD_CHANGE">Password Change</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <ShieldCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Failed/Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>User & Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Logout Time</TableHead>
                  <TableHead>Location & IP</TableHead>
                  <TableHead>Device Info</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="group">
                      <TableCell>{getStatusIcon(log.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center gap-1">
                            <User className="w-3 h-3 text-muted-foreground" />
                            {log.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">{log.userRole}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getActionColor(log.action)}`}>
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          {log.action === 'LOGIN' || log.action === 'FAILED_LOGIN' ? (
                            <>
                              <span className="font-medium">{formatDate(log.timestamp)}</span>
                              <span className="text-xs text-muted-foreground">{formatFullDate(log.timestamp)}</span>
                            </>
                          ) : log.loginTimestamp ? (
                            <>
                              <span className="font-medium">{formatDate(log.loginTimestamp)}</span>
                              <span className="text-xs text-muted-foreground">{formatFullDate(log.loginTimestamp)}</span>
                            </>
                          ) : (
                             <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col text-sm">
                            {log.action === 'LOGOUT' ? (
                                <>
                                  <span className="font-medium">{formatDate(log.timestamp)}</span>
                                  <span className="text-xs text-muted-foreground">{formatFullDate(log.timestamp)}</span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-muted-foreground" />
                            {log.location}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">{log.ipAddress}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           {log.deviceInfo.toLowerCase().includes('mobile') || log.deviceInfo.toLowerCase().includes('iphone') ? (
                             <Smartphone className="w-4 h-4" />
                           ) : (
                             <Monitor className="w-4 h-4" />
                           )}
                           <span className="truncate max-w-[150px]" title={log.deviceInfo}>{log.deviceInfo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex flex-col items-end gap-1">
                            {log.details && (
                                <span className="text-xs text-muted-foreground italic max-w-[200px] truncate" title={log.details}>
                                    {log.details}
                                </span>
                            )}
                            {log.sessionDuration && (
                                <Badge variant="secondary" className="text-[10px] h-5">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {log.sessionDuration}
                                </Badge>
                            )}
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No logs found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

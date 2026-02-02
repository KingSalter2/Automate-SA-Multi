
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  CarFront,
  Settings,
  AlertCircle,
  ShieldAlert,
  UserPlus
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  mockClients, 
  Client, 
  ClientUser,
  PlanTier,
  mockClientUsers,
  mockClientLogs,
  mockImportHistory,
  singleClient,
  mockTiers,
  mockFeatures
} from "@/data/mockSupaAdmin";
import { toast } from "sonner";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from "@/components/ui/switch";
import { 
  LogIn, 
  RotateCcw, 
  Download,
  XCircle,
  History
} from 'lucide-react';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Client Form State
  const [newClient, setNewClient] = useState<Partial<Client> & { 
    address?: string; 
    vatNumber?: string;
    billingCycle?: 'monthly' | 'yearly';
  }>({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    tier: "Basic",
    status: "Onboarding",
    billingCycle: 'monthly'
  });

  // Import Stats
  const [importStats, setImportStats] = useState({ vehicles: 0, users: 0, leads: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [selectedClientForImport, setSelectedClientForImport] = useState<Client | null>(null);
  const [selectedLogToUndo, setSelectedLogToUndo] = useState<string | null>(null);
  
  // Client Users State
  const [clientUsers, setClientUsers] = useState<ClientUser[]>(mockClientUsers);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ClientUser | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Sales' });

  const handleLoginAsUser = (user: typeof mockClientUsers[0]) => {
    toast.success(`Logging in as ${user.name} (${user.role})...`);
    // Simulate redirect to dashboard
    setTimeout(() => {
        navigate('/portal');
    }, 1500);
  };

  const handleUndoAction = () => {
    toast.success("The selected action has been undone successfully.");
    setSelectedLogToUndo(null);
  };

  const handleSuspendClient = (client: Client) => {
    const newStatus = client.status === 'Suspended' ? 'Active' : 'Suspended';
    setClients(clients.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
    
    if (newStatus === 'Suspended') {
        toast.error(`Suspended account for ${client.name}`);
    } else {
        toast.success(`Re-activated account for ${client.name}`);
    }
  };

  const handleDownloadImport = (fileName: string) => {
    toast.success(`Downloading ${fileName}...`);
  };

  // User Management Handlers
  const handleOpenUserModal = (user?: ClientUser) => {
    if (user) {
        setEditingUser(user);
        setUserForm({ name: user.name, email: user.email, role: user.role });
    } else {
        setEditingUser(null);
        setUserForm({ name: '', email: '', role: 'Sales' });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
        toast.error("Please fill in all fields");
        return;
    }

    if (editingUser) {
        setClientUsers(clientUsers.map(u => u.id === editingUser.id ? { ...u, ...userForm, role: userForm.role as ClientUser['role'] } : u));
        toast.success("User updated successfully");
    } else {
        const newUser: ClientUser = {
            id: `u${Date.now()}`,
            clientId: expandedClientId || 'c1',
            name: userForm.name,
            email: userForm.email,
            role: userForm.role as ClientUser['role'],
            status: 'Active',
            lastActive: new Date()
        };
        setClientUsers([...clientUsers, newUser]);
        toast.success("User added successfully");
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setClientUsers(clientUsers.filter(u => u.id !== userId));
    toast.success("User deleted successfully");
  };

  const handleSuspendUser = (user: ClientUser) => {
    const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    setClientUsers(clientUsers.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    toast.success(newStatus === 'Active' ? "User re-activated" : "User suspended");
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (type: 'vehicles' | 'users' | 'leads') => {
    // Simulate file upload processing
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Mock results
          if (type === 'vehicles') setImportStats(s => ({ ...s, vehicles: s.vehicles + 45 }));
          if (type === 'users') setImportStats(s => ({ ...s, users: s.users + 8 }));
          if (type === 'leads') setImportStats(s => ({ ...s, leads: s.leads + 124 }));
          
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} imported successfully`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSaveImport = () => {
    if (selectedClientForImport) {
        // Update the client with new stats (mock update)
        setClients(clients.map(c => 
            c.id === selectedClientForImport.id 
            ? { 
                ...c, 
                carsCount: c.carsCount + importStats.vehicles,
                usersCount: c.usersCount + importStats.users
              } 
            : c
        ));
        toast.success(`Data added to ${selectedClientForImport.name}`);
        setSelectedClientForImport(null);
        setImportStats({ vehicles: 0, users: 0, leads: 0 });
    }
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const client: Client = {
      id: `c${clients.length + 1}`,
      name: newClient.name!,
      ownerName: newClient.ownerName || "",
      email: newClient.email!,
      phone: newClient.phone || "",
      tier: newClient.tier as PlanTier,
      status: newClient.status as 'Active' | 'Suspended' | 'Onboarding',
      joinedDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      activeFeatures: [], // Should be populated based on tier
      usersCount: importStats.users || 1, // At least 1 admin
      maxUsers: newClient.tier === 'Basic' ? 3 : newClient.tier === 'Professional' ? 10 : 999,
      carsCount: importStats.vehicles || 0
    };

    setClients([...clients, client]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Client onboarded successfully");
  };

  const resetForm = () => {
    setNewClient({
      name: "",
      ownerName: "",
      email: "",
      phone: "",
      tier: "Basic",
      status: "Onboarding",
      billingCycle: 'monthly'
    });
    setStep(1);
    setImportStats({ vehicles: 0, users: 0, leads: 0 });
    setUploadProgress(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Suspended': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Onboarding': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Enterprise': return 'text-purple-500 font-bold';
      case 'Professional': return 'text-blue-500 font-medium';
      default: return 'text-muted-foreground';
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {[
        { step: 1, label: "Profile", icon: Building2 },
        { step: 2, label: "Plan", icon: CheckCircle2 },
        { step: 3, label: "Data Import", icon: Upload },
        { step: 4, label: "Review", icon: CheckCircle2 }
      ].map((s, idx) => (
        <div key={s.step} className="flex flex-col items-center relative z-10">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 
              ${step >= s.step 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'bg-card border-muted text-muted-foreground'}`}
          >
            <s.icon className="w-5 h-5" />
          </div>
          <span className={`text-xs mt-2 font-medium ${step >= s.step ? 'text-foreground' : 'text-muted-foreground'}`}>
            {s.label}
          </span>
          {idx < 3 && (
            <div className={`absolute top-5 left-10 w-[calc(100%+4rem)] h-[2px] -z-10 
              ${step > s.step ? 'bg-primary' : 'bg-muted'}`} 
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderExpandedRow = (client: Client) => (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      <TableCell colSpan={6} className="p-0">
        <div className="p-6 border-t border-b border-border animate-in fade-in slide-in-from-top-2 duration-200">
            <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="imports">Import History</TabsTrigger>
                <TabsTrigger value="users">Users & Access</TabsTrigger>
                <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                </TabsList>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleSuspendClient(client)}
                >
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Suspend Account
                </Button>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                    <CarFront className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{client.carsCount}</div>
                    <p className="text-xs text-muted-foreground">
                        +2 from last month
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{client.usersCount}</div>
                    <p className="text-xs text-muted-foreground">
                        of {client.maxUsers} max users
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold text-green-500">98%</div>
                    <p className="text-xs text-muted-foreground">
                        System usage is optimal
                    </p>
                    </CardContent>
                </Card>
                </div>
            </TabsContent>

            {/* Import History Tab */}
            <TabsContent value="imports">
                <Card>
                <CardHeader>
                    <CardTitle>Data Import History</CardTitle>
                    <CardDescription>View a summary of all data imports performed for this client.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockImportHistory.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell>{format(record.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell>{record.type}</TableCell>
                            <TableCell className="font-mono text-xs">{record.fileName}</TableCell>
                            <TableCell>{record.count}</TableCell>
                            <TableCell>
                            <Badge variant="outline" className={
                                record.status === 'Success' ? 'text-green-500 border-green-500/20' : 
                                record.status === 'Failed' ? 'text-red-500 border-red-500/20' : 
                                'text-yellow-500 border-yellow-500/20'
                            }>
                                {record.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadImport(record.fileName)}
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage users and impersonate sessions for support.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenUserModal()}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientUsers.filter(u => u.clientId === client.id).map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                            </TableCell>
                            <TableCell>
                            <Badge variant="secondary">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={user.status === 'Active' ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'}>
                                    {user.status || 'Active'}
                                </Badge>
                            </TableCell>
                            <TableCell>{format(user.lastActive, 'MMM d, HH:mm')}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleLoginAsUser(user)}>
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Login As
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenUserModal(user)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                                            {user.status === 'Suspended' ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                                    Activate User
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldAlert className="w-4 h-4 mr-2 text-amber-600" />
                                                    Suspend User
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </TabsContent>

            {/* Activity Logs Tab */}
            <TabsContent value="logs">
                <Card>
                <CardHeader>
                    <CardTitle>Client Audit Logs</CardTitle>
                    <CardDescription>
                    Detailed record of all actions performed within this client's environment.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Manage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockClientLogs.filter(l => l.clientId === client.id).map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="whitespace-nowrap">
                            {format(log.timestamp, 'MMM d, HH:mm')}
                            </TableCell>
                            <TableCell>{log.userName}</TableCell>
                            <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{log.details}</TableCell>
                            <TableCell className="text-right">
                            {log.canUndo && (
                                <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setSelectedLogToUndo(log.id)}
                                >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Undo
                                </Button>
                            )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Client Management</h1>
          <p className="text-muted-foreground">Onboard and manage dealership clients.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Onboard New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Onboard New Client</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Follow the steps to set up a new dealership environment.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {renderStepIndicator()}

              {/* STEP 1: PROFILE */}
              {step === 1 && (
                <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Dealership Name *</Label>
                      <Input 
                        id="name" 
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        placeholder="e.g. Apex Motors"
                        className="bg-background"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="owner">Owner Full Name</Label>
                      <Input 
                        id="owner" 
                        value={newClient.ownerName}
                        onChange={(e) => setNewClient({...newClient, ownerName: e.target.value})}
                        placeholder="e.g. John Smith"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Admin Email *</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                        placeholder="admin@apexmotors.co.za"
                        className="bg-background"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={newClient.phone}
                        onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                        placeholder="+27..."
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Physical Address</Label>
                    <Input 
                      id="address" 
                      value={newClient.address || ''}
                      onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                      placeholder="123 Main Road, Sandton..."
                      className="bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PLAN */}
              {step === 2 && (
                <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-3 gap-4">
                    {['Basic', 'Professional', 'Enterprise'].map((tier) => (
                      <div 
                        key={tier}
                        onClick={() => setNewClient({...newClient, tier: tier as PlanTier})}
                        className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-all
                          ${newClient.tier === tier ? 'border-primary bg-primary/5' : 'border-border'}`}
                      >
                        <span className={`font-bold ${newClient.tier === tier ? 'text-primary' : 'text-foreground'}`}>{tier}</span>
                        <span className="text-xs text-muted-foreground text-center">
                          {tier === 'Basic' && 'Up to 20 cars'}
                          {tier === 'Professional' && 'Up to 100 cars'}
                          {tier === 'Enterprise' && 'Unlimited cars'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2">
                    <Label>Billing Cycle</Label>
                    <Select 
                      value={newClient.billingCycle} 
                      onValueChange={(val: 'monthly' | 'yearly') => setNewClient({...newClient, billingCycle: val})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Initial Status</Label>
                    <Select 
                      value={newClient.status} 
                      onValueChange={(val) => setNewClient({...newClient, status: val as 'Active' | 'Suspended' | 'Onboarding'})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Onboarding">Onboarding (Setup Mode)</SelectItem>
                        <SelectItem value="Active">Active (Live)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* STEP 3: IMPORT */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-500">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Data Migration
                    </h4>
                    <p className="mt-1 opacity-90">
                      Upload existing data to pre-populate the client's dashboard. 
                      Supported formats: CSV, Excel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vehicle Upload */}
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-4 hover:bg-muted/30 transition-colors">
                      <CarFront className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <h5 className="font-medium">Vehicle Inventory</h5>
                        <p className="text-xs text-muted-foreground">Make, Model, VIN, Price...</p>
                      </div>
                      {importStats.vehicles > 0 ? (
                        <div className="flex items-center gap-2 text-green-500 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          {importStats.vehicles} Vehicles Ready
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleFileUpload('vehicles')}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Importing...' : 'Upload CSV'}
                        </Button>
                      )}
                    </div>

                    {/* Users Upload */}
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-4 hover:bg-muted/30 transition-colors">
                      <Users className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <h5 className="font-medium">Staff Members</h5>
                        <p className="text-xs text-muted-foreground">Name, Email, Role...</p>
                      </div>
                      {importStats.users > 0 ? (
                        <div className="flex items-center gap-2 text-green-500 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          {importStats.users} Users Ready
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleFileUpload('users')}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Importing...' : 'Upload CSV'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processing file...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      {newClient.name}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Owner</span>
                        <span>{newClient.ownerName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Email</span>
                        <span>{newClient.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Tier</span>
                        <span className={getTierColor(newClient.tier || '')}>{newClient.tier}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Billing</span>
                        <span className="capitalize">{newClient.billingCycle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Import Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-background p-3 rounded border">
                        <div className="text-2xl font-bold">{importStats.vehicles}</div>
                        <div className="text-xs text-muted-foreground">Vehicles</div>
                      </div>
                      <div className="bg-background p-3 rounded border">
                        <div className="text-2xl font-bold">{importStats.users}</div>
                        <div className="text-xs text-muted-foreground">Staff Users</div>
                      </div>
                      <div className="bg-background p-3 rounded border">
                        <div className="text-2xl font-bold">{importStats.leads}</div>
                        <div className="text-xs text-muted-foreground">Leads (Mock)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {step < 4 ? (
                <Button onClick={() => setStep(s => Math.min(4, s + 1))}>
                  {step === 3 && importStats.vehicles === 0 && importStats.users === 0 ? "Skip Migration" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleAddClient} className="bg-primary hover:bg-primary/90">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm & Create
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Data Dialog */}
        <Dialog open={!!selectedClientForImport} onOpenChange={(open) => {
          if (!open) {
            setSelectedClientForImport(null);
            setImportStats({ vehicles: 0, users: 0, leads: 0 });
          }
        }}>
          <DialogContent className="bg-card border-border text-foreground sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Import Data for {selectedClientForImport?.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add vehicles, users, or leads to this client's environment.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-500">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Data Update
                </h4>
                <p className="mt-1 opacity-90">
                  New data will be added to the existing records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle Upload */}
                <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-4 hover:bg-muted/30 transition-colors">
                  <CarFront className="w-8 h-8 text-muted-foreground" />
                  <div className="text-center">
                    <h5 className="font-medium">Vehicle Inventory</h5>
                    <p className="text-xs text-muted-foreground">Make, Model, VIN, Price...</p>
                  </div>
                  {importStats.vehicles > 0 ? (
                    <div className="flex items-center gap-2 text-green-500 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {importStats.vehicles} Vehicles Added
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFileUpload('vehicles')}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Importing...' : 'Upload CSV'}
                    </Button>
                  )}
                </div>

                {/* Users Upload */}
                <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-4 hover:bg-muted/30 transition-colors">
                  <Users className="w-8 h-8 text-muted-foreground" />
                  <div className="text-center">
                    <h5 className="font-medium">Staff Members</h5>
                    <p className="text-xs text-muted-foreground">Name, Email, Role...</p>
                  </div>
                  {importStats.users > 0 ? (
                    <div className="flex items-center gap-2 text-green-500 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {importStats.users} Users Added
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFileUpload('users')}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Importing...' : 'Upload CSV'}
                    </Button>
                  )}
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedClientForImport(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveImport}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border w-full sm:w-96">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search clients..." 
          className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground h-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-muted-foreground">Client</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Tier</TableHead>
              <TableHead className="text-muted-foreground">Usage</TableHead>
              <TableHead className="text-muted-foreground">Joined</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <>
              <TableRow 
                key={client.id} 
                className={`border-border hover:bg-muted/30 cursor-pointer ${expandedClientId === client.id ? 'bg-muted/50' : ''}`}
                onClick={() => setExpandedClientId(expandedClientId === client.id ? null : client.id)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span 
                      className="font-medium text-foreground hover:underline"
                    >
                      {client.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{client.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(client.status)}`}>
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={getTierColor(client.tier)}>{client.tier}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span>{client.usersCount}/{client.maxUsers === 999 ? '∞' : client.maxUsers} Users</span>
                    <span>{client.carsCount} Cars</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(client.joinedDate, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setExpandedClientId(client.id); }}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedClientForImport(client); }}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Mock edit */ }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); handleSuspendClient(client); }} 
                        className={client.status === 'Suspended' ? "text-green-600 focus:text-green-600 focus:bg-green-50" : "text-red-600 focus:text-red-600 focus:bg-red-50"}
                      >
                        {client.status === 'Suspended' ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate Account
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Suspend Account
                            </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {expandedClientId === client.id && renderExpandedRow(client)}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Undo Confirmation Dialog */}
      <Dialog open={!!selectedLogToUndo} onOpenChange={() => setSelectedLogToUndo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Undo Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to revert this action? This will attempt to restore the previous state.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLogToUndo(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleUndoAction}>Confirm Undo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit User Dialog */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user details and permissions.' : 'Create a new user account for this client.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={userForm.name}
                onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                placeholder="user@company.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={userForm.role} 
                onValueChange={(val) => setUserForm({...userForm, role: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>{editingUser ? 'Save Changes' : 'Create User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;

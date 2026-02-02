import { useState } from "react";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Building, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Ban, 
  CheckCircle,
  Mail,
  Smartphone,
  Save,
  Lock,
  Edit,
  Eye,
  Key,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { mockUsers, User as UserType, UserRole } from "@/data/mockUsers";
import { format } from "date-fns";

const AVAILABLE_PAGES = [
  "Overview", 
  "Analytics", 
  "Communication", 
  "Assignments", 
  "Leads & CRM", 
  "Inventory", 
  "Sales Records", 
  "Calendar", 
  "System Logs", 
  "Settings"
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  
  // Dialog States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Form States
  const [newUser, setNewUser] = useState<Partial<UserType>>({
    role: "Sales Executive",
    status: "Active",
    permissions: [],
    mobileAccess: false
  });

  // Staff Management Handlers
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const user: UserType = {
      id: `u${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      status: "Active",
      lastActive: new Date(),
      phoneNumber: newUser.phoneNumber,
      avatar: newUser.avatar,
      permissions: newUser.permissions || [],
      mobileAccess: newUser.mobileAccess || false
    };

    setUsers([...users, user]);
    setIsAddUserOpen(false);
    setNewUser({ role: "Sales Executive", status: "Active", permissions: [], mobileAccess: false });
    toast.success("Staff member added successfully");
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setIsEditUserOpen(false);
    setSelectedUser(null);
    toast.success("Staff details updated successfully");
  };

  const openEditUser = (user: UserType) => {
    setSelectedUser({...user});
    setIsEditUserOpen(true);
  };

  const handleStatusChange = (userId: string, newStatus: 'Active' | 'Suspended') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast.success(`User ${newStatus === 'Active' ? 'activated' : 'suspended'} successfully`);
  };

  const confirmDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleteAlertOpen(false);
    setSelectedUser(null);
    toast.success("User deleted successfully");
  };

  const handleResetPassword = (email: string) => {
    toast.success(`Password reset email sent to ${email}`);
  };

  const togglePermission = (page: string, isEditing: boolean) => {
    if (isEditing && selectedUser) {
      const currentPermissions = selectedUser.permissions || [];
      const newPermissions = currentPermissions.includes(page)
        ? currentPermissions.filter(p => p !== page)
        : [...currentPermissions, page];
      setSelectedUser({ ...selectedUser, permissions: newPermissions });
    } else {
      const currentPermissions = newUser.permissions || [];
      const newPermissions = currentPermissions.includes(page)
        ? currentPermissions.filter(p => p !== page)
        : [...currentPermissions, page];
      setNewUser({ ...newUser, permissions: newPermissions });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, staff, and system preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Staff Management
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Team Members</h2>
              <p className="text-sm text-muted-foreground">
                Manage access and roles for your staff members.
              </p>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Create a new account for your employee. They will receive an email to set their password.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g. John Doe" 
                        value={newUser.name || ''}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@ebmotors.co.za" 
                        value={newUser.email || ''}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+27..." 
                        value={newUser.phoneNumber || ''}
                        onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                          <SelectItem value="F&I Manager">F&I Manager</SelectItem>
                          <SelectItem value="Receptionist">Receptionist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md bg-muted/20">
                    <Switch 
                      id="mobile-access" 
                      checked={newUser.mobileAccess} 
                      onCheckedChange={(checked) => setNewUser({...newUser, mobileAccess: checked})} 
                    />
                    <Label htmlFor="mobile-access" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Smartphone className="w-4 h-4" />
                      Enable Mobile App Access
                    </Label>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Page Access Permissions</Label>
                    <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                      {AVAILABLE_PAGES.map((page) => (
                        <div key={page} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`new-${page}`} 
                            checked={(newUser.permissions || []).includes(page)}
                            onCheckedChange={() => togglePermission(page, false)}
                          />
                          <Label htmlFor={`new-${page}`} className="text-sm font-normal cursor-pointer">
                            {page}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddUser}>Create Account</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Mobile</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openEditUser(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline">{user.role}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-center">
                        {user.mobileAccess && (
                          <div className="flex justify-center">
                            <div className="bg-primary/10 p-1.5 rounded-full" title="Mobile Access Enabled">
                              <Smartphone className="w-4 h-4 text-primary" />
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(user.lastActive, 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'Active' ? (
                                <DropdownMenuItem 
                                  className="text-amber-600"
                                  onClick={() => handleStatusChange(user.id, 'Suspended')}
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-emerald-600"
                                  onClick={() => handleStatusChange(user.id, 'Active')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => confirmDeleteUser(user)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs remain unchanged */}
        {/* Company Profile Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Manage your dealership's public information and branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dealership Name</Label>
                  <Input defaultValue="EB Motors" />
                </div>
                <div className="space-y-2">
                  <Label>Registration / VAT Number</Label>
                  <Input defaultValue="4920183345" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input defaultValue="info@ebmotors.co.za" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+27 11 123 4567" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Physical Address</Label>
                  <Input defaultValue="123 Main Road, Sandton, Johannesburg, 2196" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 grid-cols-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>AutoTrader</CardTitle>
                    <CardDescription>
                      Sync your inventory automatically with AutoTrader.co.za
                    </CardDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Dealer ID</Label>
                  <Input placeholder="Enter your AutoTrader Dealer ID" defaultValue="AT-998877" />
                </div>
                <div className="grid gap-2">
                  <Label>XML Feed URL</Label>
                  <div className="flex gap-2">
                    <Input readOnly value="https://api.automatesa.co.za/feeds/autotrader/ebmotors.xml" className="bg-muted font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => toast.success("Feed URL copied to clipboard")}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provide this URL to your AutoTrader account manager.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>Cars.co.za</CardTitle>
                    <CardDescription>
                      Push stock to Cars.co.za via FTP.
                    </CardDescription>
                  </div>
                  <Switch />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Dealer ID</Label>
                  <Input placeholder="Enter your Cars.co.za Dealer ID" />
                </div>
                <div className="grid gap-2">
                  <Label>FTP Password</Label>
                  <Input type="password" placeholder="••••••••••••" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>Facebook Marketplace</CardTitle>
                    <CardDescription>
                      List vehicles on Facebook Marketplace via Catalog API.
                    </CardDescription>
                  </div>
                  <Switch />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Catalog ID</Label>
                  <Input placeholder="Facebook Catalog ID" />
                </div>
                <div className="grid gap-2">
                  <Label>Access Token</Label>
                  <Input type="password" placeholder="Meta Access Token" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Integration settings saved")}>
              <Save className="w-4 h-4 mr-2" />
              Save Integration Settings
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure when you and your staff receive email alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Lead Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when new leads are captured.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Assignments</Label>
                  <p className="text-sm text-muted-foreground">Notify staff when tasks are assigned to them.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily summary of sales and activities.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about system maintenance and new features.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Manage password policies and access controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all admin and manager accounts.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password Expiry</Label>
                  <p className="text-sm text-muted-foreground">Require password changes every 90 days.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2 pt-4">
                <Label>Session Timeout</Label>
                <Select defaultValue="60">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="240">4 Hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Automatically log out inactive users.</p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>
                <Lock className="w-4 h-4 mr-2" />
                Update Policies
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Details</DialogTitle>
            <DialogDescription>
              Update account information and permissions for this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input 
                    id="edit-email" 
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input 
                    id="edit-phone" 
                    value={selectedUser.phoneNumber || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, phoneNumber: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value) => setSelectedUser({...selectedUser, role: value as UserRole})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                      <SelectItem value="F&I Manager">F&I Manager</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 border p-4 rounded-md bg-muted/20">
                <Switch 
                  id="edit-mobile-access" 
                  checked={selectedUser.mobileAccess || false} 
                  onCheckedChange={(checked) => setSelectedUser({...selectedUser, mobileAccess: checked})} 
                />
                <Label htmlFor="edit-mobile-access" className="flex items-center gap-2 cursor-pointer font-medium">
                  <Smartphone className="w-4 h-4" />
                  Enable Mobile App Access
                </Label>
              </div>
              
              <div className="space-y-3">
                <Label>Page Access Permissions</Label>
                <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                  {AVAILABLE_PAGES.map((page) => (
                    <div key={page} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit-${page}`} 
                        checked={(selectedUser.permissions || []).includes(page)}
                        onCheckedChange={() => togglePermission(page, true)}
                      />
                      <Label htmlFor={`edit-${page}`} className="text-sm font-normal cursor-pointer">
                        {page}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete 
              <span className="font-semibold text-foreground"> {selectedUser?.name}'s </span> 
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteUser}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

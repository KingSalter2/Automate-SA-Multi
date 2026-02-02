import { useState } from "react";
import { 
  Shield, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAdminUsers, AdminUser } from "@/data/mockSupaAdmin";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const TeamPage = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdminUsers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Support");
  
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<string>("Support");

  const handleInvite = () => {
    // Mock invite logic
    const newAdmin: AdminUser = {
      id: `a${Date.now()}`,
      name: inviteName || 'Pending Invite',
      email: inviteEmail,
      role: inviteRole as AdminUser['role'],
      status: 'Inactive',
      lastLogin: new Date()
    };
    
    setAdmins([...admins, newAdmin]);
    setIsInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    
    toast({
      title: "Invitation Sent",
      description: `An invite has been sent to ${inviteEmail}`,
    });
  };

  const handleRemoveAccess = (id: string) => {
    setAdmins(admins.filter(a => a.id !== id));
    toast({
      title: "Access Removed",
      description: "The user has been removed from the team.",
      variant: "destructive",
    });
  };

  const handleToggleStatus = (admin: AdminUser) => {
    const newStatus = admin.status === 'Active' ? 'Inactive' : 'Active';
    setAdmins(admins.map(a => a.id === admin.id ? { ...a, status: newStatus } : a));
    
    toast({
      title: newStatus === 'Active' ? "User Activated" : "User Suspended",
      description: `${admin.name} has been ${newStatus === 'Active' ? 'activated' : 'suspended'}.`,
      variant: newStatus === 'Active' ? "default" : "destructive",
    });
  };

  const handleResetPassword = (email: string) => {
    toast({
      title: "Password Reset",
      description: `Password reset instructions sent to ${email}`,
    });
  };

  const handleEditRole = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setNewRole(admin.role);
    setIsEditRoleOpen(true);
  };

  const saveRoleChange = () => {
    if (selectedAdmin) {
      setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, role: newRole as AdminUser['role'] } : a));
      setIsEditRoleOpen(false);
      setSelectedAdmin(null);
      toast({
        title: "Role Updated",
        description: `Role for ${selectedAdmin.name} updated to ${newRole}`,
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin': return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20">Super Admin</Badge>;
      case 'Developer': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Developer</Badge>;
      case 'Manager': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Manager</Badge>;
      default: return <Badge variant="secondary">Support</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Team</h1>
          <p className="text-muted-foreground">Manage access and roles for your internal team.</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin) => (
          <Card key={admin.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={admin.avatar} />
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {admin.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">{admin.name}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Mail className="w-3 h-3" />
                    {admin.email}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditRole(admin)}>Edit Role</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                    {admin.status === 'Active' ? (
                      <div className="flex items-center text-amber-600">
                        <XCircle className="mr-2 h-4 w-4" />
                        <span>Suspend User</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <span>Activate User</span>
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleResetPassword(admin.email)}>Reset Password</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveAccess(admin.id)}>Remove Access</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  {getRoleBadge(admin.role)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge 
                    variant="outline" 
                    className={admin.status === 'Active' ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500'}
                  >
                    {admin.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {admin.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last Active
                  </span>
                  <span>{format(admin.lastLogin, 'MMM d, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new admin user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                placeholder="colleague@automate.sa" 
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support">Support Agent</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the access level for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support">Support Agent</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>Cancel</Button>
            <Button onClick={saveRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamPage;

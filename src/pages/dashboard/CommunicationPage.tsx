
import { useState } from "react";
import { mockVehicles } from "@/data/mockVehicles";
import { Lead } from "@/types/vehicle";
import { Task, TaskStatus } from "@/types/task";
import { mockTasks } from "@/data/mockTasks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Phone, Mail, Car, MessageSquare, Clock, AlertCircle, Calendar, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PhoneLogType = "inbound" | "outbound";

type PhoneLog = {
  id: number;
  callerName: string;
  phoneNumber: string;
  type: PhoneLogType;
  notes: string;
  assignedTo: string;
  timestamp: string;
  actionRequired: boolean;
};

type NewPhoneLog = Omit<PhoneLog, "id" | "timestamp">;

// Enhanced mock data specifically for the mockup
const demoLeads: Lead[] = [
  {
    id: "demo-1",
    customerName: "Thabo Molefe",
    email: "thabo.m@example.com",
    phone: "082 555 0123",
    source: "website",
    status: "new",
    vehicleId: "1", // BMW
    vehicleIds: ["1"],
    assignedTo: "Rameez Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    notes: "Urgent inquiry about finance options. Wants to trade in 2018 Polo."
  },
  {
    id: "demo-2",
    customerName: "Sarah Jenkins",
    email: "sarah.j@gmail.com",
    phone: "071 234 5678",
    source: "autotrader",
    status: "test-drive",
    vehicleId: "3", // VW Golf
    vehicleIds: ["3"],
    assignedTo: "Rameez Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    notes: "Test drive scheduled for tomorrow at 10:00 AM. confirmed via WhatsApp."
  },
  {
    id: "demo-3",
    customerName: "Michael Ross",
    email: "mike.ross@corp.co.za",
    phone: "063 987 6543",
    source: "walk-in",
    status: "negotiation",
    vehicleId: "5", // Ford Ranger
    vehicleIds: ["5"],
    assignedTo: "Rameez Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    notes: "Waiting for bank approval. Pre-approved for R400k."
  },
  {
    id: "demo-4",
    customerName: "Priya Naidoo",
    email: "priya.n@example.com",
    phone: "083 456 7890",
    source: "facebook",
    status: "contacted",
    vehicleId: "2", // Mercedes
    vehicleIds: ["2"],
    assignedTo: "Rameez Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    notes: "Asked about service history and warranty extension."
  }
];

export default function CommunicationPage() {
  const { toast } = useToast();
  
  // Use demo data for the mockup
  const [assignedLeads, setAssignedLeads] = useState<Lead[]>(demoLeads);
  const [acceptedLeads, setAcceptedLeads] = useState<string[]>(["demo-2"]); // Pre-accept one for demo
  
  // Tasks State
  const [myTasks, setMyTasks] = useState<Task[]>(mockTasks.filter(t => t.assignedTo === "Mike Sales"));
  const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [notingTaskId, setNotingTaskId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  // Phone Log State
  const [phoneLogs, setPhoneLogs] = useState<PhoneLog[]>([
    {
      id: 1,
      callerName: "John Doe",
      phoneNumber: "082 123 4567",
      type: "inbound",
      notes: "Inquired about financing for the BMW 320d.",
      assignedTo: "Mike Sales",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      actionRequired: true,
    },
    {
      id: 2,
      callerName: "Jane Smith",
      phoneNumber: "071 987 6543",
      type: "outbound",
      notes: "Follow up on test drive availability.",
      assignedTo: "Sarah Receptionist",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      actionRequired: false,
    }
  ]);
  const [isPhoneLogDialogOpen, setIsPhoneLogDialogOpen] = useState(false);
  const [newPhoneLog, setNewPhoneLog] = useState<NewPhoneLog>({
    callerName: "",
    phoneNumber: "",
    type: "inbound",
    notes: "",
    assignedTo: "Mike Sales",
    actionRequired: false,
  });

  // Lead State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [rejectingLeadId, setRejectingLeadId] = useState<string | null>(null);
  const [leadRejectionReason, setLeadRejectionReason] = useState("");

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === 'rejected') {
      setRejectingTaskId(taskId);
      return;
    }

    setMyTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    toast({
      title: "Status Updated",
      description: `Task marked as ${newStatus.replace('-', ' ')}.`,
    });
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "You must provide a valid reason for rejecting a task.",
        variant: "destructive"
      });
      return;
    }

    setMyTasks(prev => prev.map(t => 
      t.id === rejectingTaskId ? { ...t, status: 'rejected', rejectionReason: rejectionReason } : t
    ));

    setRejectingTaskId(null);
    setRejectionReason("");
    
    toast({
      title: "Task Rejected",
      description: "The task has been rejected and the reason recorded.",
    });
  };

  const submitNote = () => {
    if (!newNote.trim()) return;

    setMyTasks(prev => prev.map(t => 
      t.id === notingTaskId ? { ...t, notes: (t.notes ? t.notes + "\n\n" : "") + `[${new Date().toLocaleDateString()}] ${newNote}` } : t
    ));

    setNotingTaskId(null);
    setNewNote("");

    toast({
      title: "Note Added",
      description: "Your note has been attached to the task.",
    });
  };

  const handleLeadStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    if (newStatus === 'rejected') {
      setRejectingLeadId(leadId);
      return;
    }

    setAssignedLeads(prev => prev.map(l => 
      l.id === leadId ? { ...l, status: newStatus } : l
    ));

    toast({
      title: "Status Updated",
      description: `Lead status updated to ${newStatus.replace('-', ' ')}.`,
    });
  };

  const submitLeadRejection = () => {
    if (!leadRejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "You must provide a valid reason for rejecting a lead.",
        variant: "destructive"
      });
      return;
    }

    setAssignedLeads(prev => prev.map(l => 
      l.id === rejectingLeadId ? { ...l, status: 'rejected', rejectionReason: leadRejectionReason } : l
    ));

    setRejectingLeadId(null);
    setLeadRejectionReason("");
    
    toast({
      title: "Lead Rejected",
      description: "The lead has been rejected and the reason recorded.",
    });
  };


  const getVehicleDetails = (vehicleId?: string, vehicleIds?: string[]) => {
    const id = vehicleIds?.[0] || vehicleId;
    if (!id) return null;
    return mockVehicles.find(v => v.id === id);
  };

  const handleAccept = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcceptedLeads([...acceptedLeads, leadId]);
    toast({
      title: "Assignment Accepted",
      description: "You have accepted this lead. It has been moved to your active tasks.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return "bg-primary/10 text-primary border-primary/20";
      case 'contacted': return "bg-muted text-muted-foreground border-border";
      case 'test-drive': return "bg-accent/10 text-accent border-accent/20";
      case 'negotiation': return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case 'sold': return "bg-success/10 text-success border-success/20";
      case 'rejected': return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityIcon = (lead: Lead) => {
    const hoursSinceCreation = (new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
    if (lead.status === 'new' && hoursSinceCreation < 4) {
      return <Badge variant="outline" className="flex gap-1 items-center text-xs px-2 py-0.5 border-accent/50 text-accent"><AlertCircle className="w-3 h-3" /> New Lead</Badge>;
    }
    if (lead.status === 'test-drive') {
      return <Badge variant="secondary" className="flex gap-1 items-center text-xs px-2 py-0.5"><Calendar className="w-3 h-3" /> Scheduled</Badge>;
    }
    return null;
  };

  const handleAddPhoneLog = () => {
    const log = {
      id: Date.now(),
      ...newPhoneLog,
      timestamp: new Date().toISOString(),
    };
    setPhoneLogs([log, ...phoneLogs]);
    setIsPhoneLogDialogOpen(false);
    setNewPhoneLog({
      callerName: "",
      phoneNumber: "",
      type: "inbound",
      notes: "",
      assignedTo: "Mike Sales",
      actionRequired: false,
    });
    toast({
      title: "Call Logged",
      description: "The phone call has been recorded successfully.",
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Communication & Tasks</h2>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Manage your assigned leads and pending tasks.</p>
          <div className="flex gap-2">
             <Badge variant="outline" className="px-3 py-1">Total: {assignedLeads.length}</Badge>
             <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">Active: {acceptedLeads.length}</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="flex-1">
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="phone-logs">Phone Logs</TabsTrigger>
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="new">New Leads</TabsTrigger>
          <TabsTrigger value="active">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="phone-logs" className="mt-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold">Recent Calls</h3>
             <Button onClick={() => setIsPhoneLogDialogOpen(true)}>
               <Plus className="w-4 h-4 mr-2" /> Log Call
             </Button>
          </div>
          
          <div className="rounded-md border">
             <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b bg-muted/50">
                <div>Caller</div>
                <div>Number</div>
                <div>Type</div>
                <div className="col-span-2">Notes</div>
                <div>Assigned To</div>
             </div>
             <div className="divide-y">
               {phoneLogs.map((log) => (
                 <div key={log.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/20">
                    <div className="font-medium">{log.callerName}</div>
                    <div className="text-sm text-muted-foreground">{log.phoneNumber}</div>
                    <div>
                      <Badge variant={log.type === 'inbound' ? 'default' : 'secondary'}>
                        {log.type}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">{log.notes}</div>
                    <div className="text-sm">{log.assignedTo}</div>
                 </div>
               ))}
             </div>
          </div>
          
          <Dialog open={isPhoneLogDialogOpen} onOpenChange={setIsPhoneLogDialogOpen}>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Log New Call</DialogTitle>
                 <DialogDescription>Record details of an incoming or outgoing call.</DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Caller Name</Label>
                     <Input 
                       value={newPhoneLog.callerName}
                       onChange={(e) => setNewPhoneLog({...newPhoneLog, callerName: e.target.value})}
                       placeholder="e.g. John Smith"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Phone Number</Label>
                     <Input 
                       value={newPhoneLog.phoneNumber}
                       onChange={(e) => setNewPhoneLog({...newPhoneLog, phoneNumber: e.target.value})}
                       placeholder="e.g. 082 123 4567"
                     />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        value={newPhoneLog.type}
                        onValueChange={(val) => setNewPhoneLog({...newPhoneLog, type: val as PhoneLogType})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inbound">Inbound (Incoming)</SelectItem>
                          <SelectItem value="outbound">Outbound (Outgoing)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Assign To</Label>
                      <Select 
                        value={newPhoneLog.assignedTo}
                        onValueChange={(val) => setNewPhoneLog({...newPhoneLog, assignedTo: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mike Sales">Mike Sales</SelectItem>
                          <SelectItem value="Sarah Receptionist">Sarah Receptionist</SelectItem>
                          <SelectItem value="Rameez Admin">Rameez Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 <div className="space-y-2">
                   <Label>Notes</Label>
                   <Textarea 
                     value={newPhoneLog.notes}
                     onChange={(e) => setNewPhoneLog({...newPhoneLog, notes: e.target.value})}
                     placeholder="Call details..."
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setIsPhoneLogDialogOpen(false)}>Cancel</Button>
                 <Button onClick={handleAddPhoneLog}>Save Log</Button>
               </DialogFooter>
             </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {myTasks.map((task) => (
              <Card key={task.id} className={`flex flex-col border-l-4 ${
                task.priority === 'high' ? 'border-l-red-500' : 
                task.priority === 'medium' ? 'border-l-orange-500' : 'border-l-blue-500'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant="outline" className={
                      task.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
                      task.status === 'in-progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      task.status === 'rejected' ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-muted text-muted-foreground"
                    }>
                      {task.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>Assigned by {task.assignedBy}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pb-4">
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  
                  {task.notes && (
                    <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
                      <div className="font-semibold flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Notes:
                      </div>
                      <div className="whitespace-pre-wrap text-muted-foreground">{task.notes}</div>
                    </div>
                  )}

                  {task.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 p-3 rounded-md text-xs text-red-800">
                      <span className="font-bold">Rejection Reason:</span> {task.rejectionReason}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 flex flex-col gap-3">
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Select 
                      value={task.status} 
                      onValueChange={(val: TaskStatus) => handleStatusChange(task.id, val)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setNotingTaskId(task.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Note
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Rejection Dialog */}
          <Dialog open={!!rejectingTaskId} onOpenChange={(open) => !open && setRejectingTaskId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Task</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this task.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Warning: Tasks should only be rejected for valid reasons (e.g., duplicate task, wrong assignee). Frequent rejections may be reviewed.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Rejection</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Enter detailed reason..." 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectingTaskId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={submitRejection}>Reject Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Note Dialog */}
          <Dialog open={!!notingTaskId} onOpenChange={(open) => !open && setNotingTaskId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>
                  Add a progress update or note to this task.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <Label htmlFor="note">Note Content</Label>
                <Textarea 
                  id="note" 
                  placeholder="Type your note here..." 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNotingTaskId(null)}>Cancel</Button>
                <Button onClick={submitNote}>Add Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {assignedLeads.map((lead) => {
              const vehicle = getVehicleDetails(lead.vehicleId, lead.vehicleIds);
              const isAccepted = acceptedLeads.includes(lead.id);

              return (
                <Card 
                  key={lead.id} 
                  className={`flex flex-col transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !isAccepted ? 'border-l-4 border-l-accent' : 
                    lead.status === 'rejected' ? 'border-l-4 border-l-destructive' :
                    'border-l-4 border-l-transparent'
                  }`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                          {lead.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {getPriorityIcon(lead)}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{lead.customerName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="capitalize">{lead.source} inquiry</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4 pb-4">
                    {/* Contact Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${lead.phone}`;
                        }}>
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${lead.email}`;
                        }}>
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                    </div>

                    {/* Vehicle Card */}
                    {vehicle && (
                      <div className="p-3 bg-muted/40 rounded-lg border border-border/50 group hover:bg-muted/60 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                             {/* Placeholder for car image */}
                             <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm leading-none">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.variant}</p>
                            <p className="text-xs font-medium text-primary">
                              {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(vehicle.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes Section */}
                    {lead.notes && (
                      <div className="bg-muted/30 border border-border/50 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">Latest Note</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {lead.notes}
                        </p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {lead.rejectionReason && (
                      <div className="bg-destructive/5 border border-destructive/20 rounded-md p-3">
                         <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-3 h-3 text-destructive" />
                            <span className="text-xs font-bold text-destructive">Rejection Reason</span>
                         </div>
                         <p className="text-xs text-destructive/80 italic">{lead.rejectionReason}</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0" onClick={(e) => e.stopPropagation()}>
                    {isAccepted ? (
                      <div className="w-full flex gap-2">
                         <Select 
                           value={lead.status} 
                           onValueChange={(val) => handleLeadStatusChange(lead.id, val as Lead["status"])}
                         >
                           <SelectTrigger className="h-9 text-xs flex-1">
                             <SelectValue placeholder="Status" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="new">New</SelectItem>
                             <SelectItem value="contacted">Contacted</SelectItem>
                             <SelectItem value="test-drive">Test Drive</SelectItem>
                             <SelectItem value="negotiation">Negotiation</SelectItem>
                             <SelectItem value="finance">Finance</SelectItem>
                             <SelectItem value="sold">Sold</SelectItem>
                             <SelectItem value="lost">Lost</SelectItem>
                             <SelectItem value="rejected">Rejected</SelectItem>
                           </SelectContent>
                         </Select>
                         <Button className="gap-2" variant="secondary" onClick={(e) => {
                             e.stopPropagation();
                             setSelectedLead(lead);
                         }}>
                            Details
                         </Button>
                      </div>
                    ) : (
                      <Button className="w-full gap-2" variant="default" onClick={(e) => handleAccept(lead.id, e)}>
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Assignment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Lead Rejection Dialog */}
          <Dialog open={!!rejectingLeadId} onOpenChange={(open) => !open && setRejectingLeadId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Lead</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this lead.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Warning: Leads should only be rejected for valid reasons (e.g., duplicate, invalid contact). Frequent rejections may be reviewed.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead-reason">Reason for Rejection</Label>
                <Textarea 
                  id="lead-reason" 
                  placeholder="Enter detailed reason..." 
                  value={leadRejectionReason}
                  onChange={(e) => setLeadRejectionReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectingLeadId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={submitLeadRejection}>Reject Lead</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Lead Details Modal */}
          <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center pr-8">
                  <span>{selectedLead?.customerName}</span>
                  {selectedLead && (
                    <Badge variant="outline" className={getStatusColor(selectedLead.status)}>
                       {selectedLead.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                   Lead ID: {selectedLead?.id} | Created: {selectedLead && new Date(selectedLead.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              {selectedLead && (
                <div className="space-y-6 py-4">
                  {/* Customer Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Phone:</span> {selectedLead.phone}</p>
                        <p><span className="text-muted-foreground">Email:</span> {selectedLead.email}</p>
                        <p><span className="text-muted-foreground">Source:</span> <span className="capitalize">{selectedLead.source}</span></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><Car className="w-4 h-4" /> Interest</h4>
                      <div className="space-y-1 text-sm">
                        {(() => {
                          const vehicle = getVehicleDetails(selectedLead.vehicleId, selectedLead.vehicleIds);
                          return vehicle ? (
                            <>
                              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                              <p className="text-muted-foreground">{vehicle.variant}</p>
                              <p className="text-primary font-bold">
                                {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(vehicle.price)}
                              </p>
                            </>
                          ) : <p className="text-muted-foreground">No vehicle details available</p>;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                     <h4 className="font-semibold mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Notes</h4>
                     <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                        {selectedLead.notes || "No notes available."}
                     </div>
                  </div>
                  
                  {/* Rejection Details if applicable */}
                  {selectedLead.rejectionReason && (
                    <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-md">
                       <h4 className="font-semibold text-destructive mb-1 flex items-center gap-2">
                         <AlertCircle className="w-4 h-4" /> Rejection Reason
                       </h4>
                       <p className="text-sm text-destructive/80">{selectedLead.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                 <Button onClick={() => setSelectedLead(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {assignedLeads.filter(l => l.status === 'new').map((lead) => {
              const vehicle = getVehicleDetails(lead.vehicleId, lead.vehicleIds);
              const isAccepted = acceptedLeads.includes(lead.id);
              return (
                <Card 
                  key={lead.id} 
                  className={`flex flex-col transition-all duration-200 hover:shadow-md ${
                    !isAccepted ? 'border-l-4 border-l-accent' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                          {lead.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {getPriorityIcon(lead)}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{lead.customerName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="capitalize">{lead.source} inquiry</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${lead.phone}`;
                        }}>
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${lead.email}`;
                        }}>
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                    </div>

                    {vehicle && (
                      <div className="p-3 bg-muted/40 rounded-lg border border-border/50 group cursor-pointer hover:bg-muted/60 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                             <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm leading-none">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.variant}</p>
                            <p className="text-xs font-medium text-primary">
                              {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(vehicle.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {lead.notes && (
                      <div className="bg-muted/30 border border-border/50 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">Latest Note</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {lead.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    {isAccepted ? (
                      <div className="w-full flex gap-2">
                         <Button className="flex-1 gap-2" variant="default">
                            Message
                         </Button>
                         <Button variant="secondary" className="gap-2">
                            Details
                         </Button>
                      </div>
                    ) : (
                      <Button className="w-full gap-2" variant="default" onClick={(e) => handleAccept(lead.id, e)}>
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Assignment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {assignedLeads.filter(l => l.status === 'new').length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted" />
              <p>No new leads to review.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {assignedLeads.filter(l => acceptedLeads.includes(l.id)).map((lead) => {
              const vehicle = getVehicleDetails(lead.vehicleId, lead.vehicleIds);
              const isAccepted = true;
              return (
                 <Card 
                  key={lead.id} 
                  className="flex flex-col transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                          {lead.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {getPriorityIcon(lead)}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{lead.customerName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="capitalize">{lead.source} inquiry</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${lead.phone}`;
                        }}>
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-8 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${lead.email}`;
                        }}>
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                    </div>

                    {vehicle && (
                      <div className="p-3 bg-muted/40 rounded-lg border border-border/50 group cursor-pointer hover:bg-muted/60 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                             <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm leading-none">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.variant}</p>
                            <p className="text-xs font-medium text-primary">
                              {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(vehicle.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {lead.notes && (
                      <div className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Latest Note</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {lead.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                      <div className="w-full flex gap-2">
                         <Button className="flex-1 gap-2" variant="default">
                            Message
                         </Button>
                         <Button variant="secondary" className="gap-2">
                            Details
                         </Button>
                      </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {assignedLeads.filter(l => acceptedLeads.includes(l.id)).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted" />
              <p>No active tasks. Accept a new lead to get started.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

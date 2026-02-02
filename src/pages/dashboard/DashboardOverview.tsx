import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Car, Banknote, CalendarCheck, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { mockLeads } from "@/data/mockLeads";
import { mockVehicles } from "@/data/mockVehicles";
import { CreateLeadModal } from "@/components/dashboard/CreateLeadModal";
import { TestDriveBookingModal } from "@/components/dashboard/TestDriveBookingModal";
import { LeadDetailsSheet } from "@/components/dashboard/LeadDetailsSheet";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PendingRequestStatus = "pending" | "confirmed" | "declined";

interface PendingTestDriveRequest {
  id: number;
  customerName: string;
  vehicleName: string;
  vehicleIds: string[];
  requestedDate: string;
  requestedTime: string;
  status: PendingRequestStatus;
  email: string;
  phone: string;
  source: "website";
  notes: string;
}

// Mock data for pending test drive requests (from website)
const mockPendingRequests: PendingTestDriveRequest[] = [
  {
    id: 1,
    customerName: "Thabo Mbeki",
    vehicleName: "2023 Volkswagen Golf GTI",
    vehicleIds: ["3"],
    requestedDate: "2026-03-25",
    requestedTime: "14:00",
    status: "pending",
    email: "thabo.mbeki@example.com",
    phone: "083 555 1234",
    source: "website",
    notes: "Request for Test Drive on 2026-03-25 at 14:00"
  }
];

const pendingRequestToLead = (request: PendingTestDriveRequest): Lead => {
  const createdAt = new Date(`${request.requestedDate}T${request.requestedTime}:00`);
  const safeCreatedAt = Number.isNaN(createdAt.getTime()) ? new Date() : createdAt;

  return {
    id: `pending-${request.id}`,
    vehicleIds: request.vehicleIds,
    customerName: request.customerName,
    email: request.email,
    phone: request.phone,
    source: "website",
    status: "test-drive",
    notes: request.notes,
    createdAt: safeCreatedAt,
  };
};

const DashboardOverview = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingTestDriveRequest[]>(mockPendingRequests);
  const [requestToConfirm, setRequestToConfirm] = useState<PendingTestDriveRequest | null>(null);
  const [viewDetailsRequest, setViewDetailsRequest] = useState<PendingTestDriveRequest | null>(null);
  const { toast } = useToast();

  // Calculate stats
  const totalLeads = mockLeads.length;
  const newLeads = mockLeads.filter(l => l.status === 'new').length;
  const activeListings = mockVehicles.filter(v => v.status === 'available').length;
  const pendingTestDrives = mockLeads.filter(l => l.status === 'test-drive').length;

  const handleCreateLead = (newLead: Lead) => {
    // In a real app, this would update the backend
    // For now, we push to the mock array so it might show up if we re-navigate
    mockLeads.unshift(newLead);
    
    toast({
      title: "Lead Created",
      description: `${newLead.customerName} has been added successfully.`,
    });
    setIsCreateModalOpen(false);
  };

  const handleTestDriveConfirm = () => {
    if (requestToConfirm) {
        // Remove from pending list
        setPendingRequests(pendingRequests.filter(req => req.id !== requestToConfirm.id));
        setRequestToConfirm(null);
    }

    toast({
      title: "Test Drive Booked",
      description: "Booking confirmed and calendar updated.",
    });
    setIsTestDriveModalOpen(false);
  };

  const handleApproveRequest = (request: PendingTestDriveRequest) => {
    setRequestToConfirm(request);
    // Ideally we would pre-fill the modal with this request's details
    // For now we just open the modal to "confirm" it manually
    setIsTestDriveModalOpen(true);
  };

  const handleDeclineRequest = (id: number) => {
      setPendingRequests(pendingRequests.filter(req => req.id !== id));
      toast({
          title: "Request Declined",
          description: "The test drive request has been removed.",
          variant: "destructive"
      });
  };

  const stats = [
    {
      title: "Total Active Leads",
      value: totalLeads.toString(),
      description: `+${newLeads} new this week`,
      icon: Users,
    },
    {
      title: "Vehicles in Stock",
      value: activeListings.toString(),
      description: "Available for sale",
      icon: Car,
    },
    {
      title: "Pending Test Drives",
      value: pendingTestDrives.toString(),
      description: "Scheduled for this week",
      icon: CalendarCheck,
    },
    {
      title: "Sales this Month",
      value: "1",
      description: "+100% from last month",
      icon: Banknote,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back to EB Motors Admin Portal.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
             {/* Pending Requests Section */}
             {pendingRequests.length > 0 && (
                <Card className="border-l-4 border-l-primary shadow-sm bg-card">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Pending Test Drive Requests
                                </CardTitle>
                                <CardDescription>Action required: {pendingRequests.length} request(s) waiting</CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-secondary/50">
                                {pendingRequests.length} Pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm">{req.customerName}</h4>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal capitalize">
                                            {req.source}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{req.vehicleName}</p>
                                    <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-primary/80">
                                        <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {req.requestedDate}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.requestedTime}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setViewDetailsRequest(req)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>View Details</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    
                                    <div className="h-8 w-px bg-border mx-1"></div>

                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeclineRequest(req.id)}>
                                        <XCircle className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" className="h-8 gap-1" onClick={() => handleApproveRequest(req)}>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
             )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {mockLeads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {lead.customerName.charAt(0)}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{lead.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium capitalize">
                        {lead.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
              <h4 className="font-semibold">Add New Vehicle</h4>
              <p className="text-sm text-muted-foreground">List a new car on the website</p>
            </div>
            <div 
              className="p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <h4 className="font-semibold">Create Lead</h4>
              <p className="text-sm text-muted-foreground">Manually add a walk-in customer</p>
            </div>
            <div 
              className="p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => setIsTestDriveModalOpen(true)}
            >
              <h4 className="font-semibold">Schedule Test Drive</h4>
              <p className="text-sm text-muted-foreground">Book a slot for a client</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateLeadModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateLead} 
      />

      <TestDriveBookingModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        onConfirm={handleTestDriveConfirm}
      />

      <LeadDetailsSheet
        lead={viewDetailsRequest ? pendingRequestToLead(viewDetailsRequest) : null}
        isOpen={!!viewDetailsRequest}
        onClose={() => setViewDetailsRequest(null)}
        onUpdate={() => {}} // Read-only for this view
      />
    </div>
  );
};

export default DashboardOverview;

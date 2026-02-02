import { useState } from "react";
import { mockLeads, mockSalespeople } from "@/data/mockLeads";
import { mockVehicles } from "@/data/mockVehicles";
import { Lead, Vehicle } from "@/types/vehicle";
import { CreateLeadModal } from "@/components/dashboard/CreateLeadModal";
import { LeadDetailsSheet } from "@/components/dashboard/LeadDetailsSheet";
import { TestDriveBookingModal } from "@/components/dashboard/TestDriveBookingModal";
import { SaleConfirmationModal } from "@/components/dashboard/SaleConfirmationModal";
import { generateInvoice } from "@/utils/pdfGenerator";
import { sendWelcomeMessage } from "@/services/whatsapp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare,
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LeadsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [pendingLeadForTestDrive, setPendingLeadForTestDrive] = useState<Lead | null>(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [pendingLeadForSale, setPendingLeadForSale] = useState<Lead | null>(null);
  const { toast } = useToast();

  type LeadStatus = Lead["status"];

  const statuses: Array<{ id: LeadStatus; label: string; color: string }> = [
    { id: "new", label: "New Leads", color: "bg-blue-500/10 text-blue-500" },
    { id: "contacted", label: "Contacted", color: "bg-yellow-500/10 text-yellow-500" },
    { id: "test-drive", label: "Test Drive", color: "bg-purple-500/10 text-purple-500" },
    { id: "finance", label: "Finance", color: "bg-orange-500/10 text-orange-500" },
    { id: "sold", label: "Sold", color: "bg-green-500/10 text-green-500" },
  ];

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => 
      lead.status === status && 
      (lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       lead.phone.includes(searchTerm))
    );
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    if (newStatus === 'test-drive') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        setPendingLeadForTestDrive({ ...lead, status: 'test-drive' });
        setIsTestDriveModalOpen(true);
      }
      return;
    }

    if (newStatus === 'sold') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        setPendingLeadForSale({ ...lead });
        setIsSaleModalOpen(true);
      }
      return;
    }

    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    
    toast({
      title: "Status Updated",
      description: `Lead moved to ${newStatus.replace('-', ' ')}`,
    });
  };

  const handleTestDriveConfirm = () => {
    if (pendingLeadForTestDrive) {
      const updatedLead = {
        ...pendingLeadForTestDrive,
        status: 'test-drive' as const,
        notes: (pendingLeadForTestDrive.notes || '') + '\n[System]: Test Drive Booked'
      };

      setLeads(leads.map(lead => 
        lead.id === pendingLeadForTestDrive.id ? updatedLead : lead
      ));
      
      // Also update selectedLead if it's the same one (e.g. if Sheet is open)
      if (selectedLead && selectedLead.id === pendingLeadForTestDrive.id) {
        setSelectedLead(updatedLead);
      }

      toast({
        title: "Test Drive Booked",
        description: "Booking confirmed and calendar updated.",
      });
      
      setIsTestDriveModalOpen(false);
      setPendingLeadForTestDrive(null);
    }
  };

  const handleSaleConfirm = (saleDetails: NonNullable<Lead["saleDetails"]>) => {
    if (pendingLeadForSale) {
        const updatedLead: Lead = {
            ...pendingLeadForSale,
            status: 'sold',
            saleDetails: saleDetails,
            notes: (pendingLeadForSale.notes || '') + (saleDetails.discountReason ? `\n[System - Discount Reason]: ${saleDetails.discountReason}` : '')
        };

        setLeads(leads.map(lead => 
            lead.id === pendingLeadForSale.id ? updatedLead : lead
        ));

        // Also update selectedLead if it's the same one (e.g. if Sheet is open)
        if (selectedLead && selectedLead.id === pendingLeadForSale.id) {
            setSelectedLead(updatedLead);
        }

        // Automatically generate Invoice
        const vehicleIds = updatedLead.vehicleIds || (updatedLead.vehicleId ? [updatedLead.vehicleId] : []);
        const vehicles = vehicleIds
          .map((id) => mockVehicles.find((v) => v.id === id))
          .filter((v): v is Vehicle => Boolean(v));
        
        if (vehicles.length > 0) {
            generateInvoice(updatedLead, vehicles);
        }

        toast({
            title: "Vehicle Sold!",
            description: `Sale confirmed and Invoice generated for ${updatedLead.customerName}.`,
        });

        setIsSaleModalOpen(false);
        setPendingLeadForSale(null);
    }
  };

  const handleCreateLead = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
    toast({
      title: "Lead Created",
      description: `${newLead.customerName} has been added successfully.`,
    });
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    // Check if status changed
    const oldLead = leads.find(l => l.id === updatedLead.id);
    if (oldLead && oldLead.status !== updatedLead.status) {
        if (updatedLead.status === 'test-drive') {
            setPendingLeadForTestDrive(updatedLead);
            setIsTestDriveModalOpen(true);
            return;
        }

        if (updatedLead.status === 'sold') {
            setPendingLeadForSale(updatedLead);
            setIsSaleModalOpen(true);
            return;
        }

        toast({
            title: "Status Updated",
            description: `Lead moved to ${updatedLead.status.replace('-', ' ')}`,
        });
    }

    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    setSelectedLead(updatedLead);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
          <p className="text-muted-foreground">Track and manage customer inquiries.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leads..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <CreateLeadModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateLead} 
      />

      <LeadDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
        onUpdate={handleUpdateLead}
      />

      <TestDriveBookingModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        onConfirm={handleTestDriveConfirm}
        lead={pendingLeadForTestDrive}
      />

      <SaleConfirmationModal 
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onConfirm={handleSaleConfirm}
        lead={pendingLeadForSale}
      />

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1200px] h-full">
          {statuses.map((status) => (
            <div key={status.id} className="flex-1 min-w-[280px] flex flex-col bg-secondary/20 rounded-xl p-4">
              <div className={`flex items-center justify-between mb-4 p-2 rounded-lg ${status.color}`}>
                <span className="font-bold">{status.label}</span>
                <Badge variant="secondary" className="bg-background/50">
                  {getLeadsByStatus(status.id).length}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {getLeadsByStatus(status.id).map((lead) => (
                  <Card 
                    key={lead.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{lead.customerName}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                              {lead.source === 'website' && <span className="mr-1">🌐</span>}
                              {lead.source === 'whatsapp' && <span className="mr-1">💬</span>}
                              {lead.source === 'phone' && <span className="mr-1">📞</span>}
                              {lead.source === 'walk-in' && <span className="mr-1">🚶</span>}
                              {lead.source === 'cars.co.za' && <span className="mr-1">🚗</span>}
                              {lead.source === 'autotrader' && <span className="mr-1">🚙</span>}
                              {lead.source === 'facebook' && <span className="mr-1">👥</span>}
                              {lead.source}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statuses
                                .filter(s => s.id !== lead.status) // Filter out current status
                                .map(status => (
                                    <DropdownMenuItem 
                                        key={status.id}
                                        onClick={() => handleStatusChange(lead.id, status.id)}
                                    >
                                        Move to {status.label}
                                    </DropdownMenuItem>
                                ))
                            }
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1">
                        {(lead.vehicleIds || (lead.vehicleId ? [lead.vehicleId] : [])).map(vid => {
                          const vehicle = mockVehicles.find(v => v.id === vid);
                          if (!vehicle) return null;
                          return (
                            <div key={vid} className="bg-secondary/50 p-2 rounded text-xs font-medium">
                              Interested in: {vehicle.year} {vehicle.make} {vehicle.model} - R{vehicle.price.toLocaleString()}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <Phone className="w-3 h-3 mr-1" /> Call
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" /> Chat
                        </Button>
                      </div>
                      
                      {lead.assignedTo && (
                        <div className="text-xs text-muted-foreground pt-1 border-t border-border/50 mt-2">
                          Assigned to: {lead.assignedTo}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;

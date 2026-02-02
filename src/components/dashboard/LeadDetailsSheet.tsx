import { useState, useEffect } from "react";
import { Lead, Vehicle } from "@/types/vehicle";
import { mockVehicles } from "@/data/mockVehicles";
import { mockSalespeople } from "@/data/mockLeads";
import { VehicleMultiSelect } from "@/components/dashboard/VehicleMultiSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User, Phone, Mail, Car, MessageSquare, History, Receipt, FileText, Send, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaleSummaryModal } from "@/components/dashboard/SaleSummaryModal";
import { generateOTP, generateInvoice } from "@/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";

interface LeadDetailsSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

export function LeadDetailsSheet({ lead, isOpen, onClose, onUpdate }: LeadDetailsSheetProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [newNote, setNewNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaleSummaryOpen, setIsSaleSummaryOpen] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
      setNewNote("");
      setIsEditing(false);
    }
  }, [lead, isOpen]);

  if (!lead) return null;

  const handleSave = () => {
    if (formData) {
      onUpdate(formData as Lead);
      setIsEditing(false);
    }
  };

  const handleStatusChange = (status: Lead["status"]) => {
    // If there's a note being typed, add it automatically
    let updatedNotes = formData.notes || "";
    if (newNote.trim()) {
        const timestamp = new Date().toLocaleString();
        updatedNotes = `${timestamp}: ${newNote}\n\n${updatedNotes}`;
    }

    const updatedLead = { 
        ...formData, 
        status,
        notes: updatedNotes
    } as Lead;

    setFormData(updatedLead);
    onUpdate(updatedLead);
    setNewNote("");
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const timestamp = new Date().toLocaleString();
    const noteEntry = `${timestamp}: ${newNote}`;
    const updatedNotes = formData.notes 
      ? `${noteEntry}\n\n${formData.notes}`
      : noteEntry;
    
    const updatedLead = { ...formData, notes: updatedNotes } as Lead;
    setFormData(updatedLead);
    onUpdate(updatedLead);
    setNewNote("");
  };

  const handleGenerateDocument = (type: 'otp' | 'invoice') => {
    // Get the selected vehicles for this lead
    const currentVehicleIds = formData.vehicleIds || (formData.vehicleId ? [formData.vehicleId] : []);
    const vehicles = currentVehicleIds
      .map((id) => mockVehicles.find((v) => v.id === id))
      .filter((v): v is Vehicle => Boolean(v));

    if (vehicles.length === 0) {
      alert("Please assign a vehicle to this lead first.");
      return;
    }

    // Use the latest formData state which might have unsaved edits (like customer name)
    const currentLead = { ...lead, ...formData } as Lead;

    if (type === 'otp') {
      generateOTP(currentLead, vehicles);
    } else {
      generateInvoice(currentLead, vehicles);
    }
  };

  const handleRequestDocuments = (method: 'copy' | 'whatsapp') => {
    // In a real app, this would send an SMS/Email
    // For now, we'll copy the link to clipboard
    const link = `${window.location.origin}/documents/${lead.id}`;
    
    if (method === 'copy') {
      navigator.clipboard.writeText(link);
      toast({
        title: "Document Request Link Generated",
        description: "Link copied to clipboard. In production, this would be SMSed to the client.",
      });
    } else if (method === 'whatsapp') {
      const vehicleInfo = selectedVehicles.length > 0 
        ? `${selectedVehicles[0].year} ${selectedVehicles[0].make} ${selectedVehicles[0].model}`
        : 'your vehicle interest';
      
      const agentName = formData.assignedTo || "the Sales Team";
      const companyName = "EB Motors";
      
      const message = `Good day ${lead.customerName || 'Valued Client'},

This is ${agentName} from ${companyName} regarding ${vehicleInfo}. 🚗

Could you please upload your FICA documents (ID, License, Proof of Res) using our secure portal link below? This is required to proceed with your vehicle purchase/finance application.

${link}

Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      // Clean phone number: remove spaces, ensure 27 prefix if starts with 0
      let phone = lead.phone.replace(/\s+/g, '').replace(/-/g, '');
      if (phone.startsWith('0')) {
        phone = '27' + phone.substring(1);
      }
      
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
      
      toast({
        title: "WhatsApp Opened",
        description: "WhatsApp web/app opened with pre-filled message.",
      });
    }
  };

  const selectedVehicleIds = formData.vehicleIds || (formData.vehicleId ? [formData.vehicleId] : []);
  const selectedVehicles = selectedVehicleIds.map(id => mockVehicles.find(v => v.id === id)).filter(Boolean);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">{formData.customerName}</SheetTitle>
            <Badge variant={
                formData.status === 'new' ? 'default' : 
                formData.status === 'sold' ? 'secondary' : 'outline'
            }>
                {formData.status?.toUpperCase()}
            </Badge>
          </div>
          <SheetDescription>
            Created on {lead.createdAt ? format(new Date(lead.createdAt), "PPP") : "Unknown date"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
            {/* Quick Actions / Status Move */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                   <Button 
                        variant="outline" 
                        className="w-full border-primary/20 hover:bg-primary/5 text-primary"
                        onClick={() => handleGenerateDocument('otp')}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Generate OTP
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full border-primary/20 hover:bg-primary/5 text-primary"
                        onClick={() => handleGenerateDocument('invoice')}
                    >
                        <Receipt className="w-4 h-4 mr-2" />
                        Sales Invoice
                    </Button>
                </div>
                
                {/* Show Sale Summary button if sale details exist, regardless of current status/formData sync */}
                {lead.saleDetails && (
                    <Button 
                        variant="default" 
                        className="w-full bg-green-600 hover:bg-green-700 mb-2"
                        onClick={() => setIsSaleSummaryOpen(true)}
                    >
                        <Receipt className="w-4 h-4 mr-2" />
                        View Sale Summary
                    </Button>
                )}
                <Label className="text-sm font-medium">Move Lead Status</Label>
                <div className="flex gap-2 flex-wrap">
                     {['new', 'contacted', 'test-drive', 'finance', 'sold', 'lost']
                        .filter(status => status !== formData.status) // Hide current status
                        .map((status) => (
                        <Button 
                            key={status}
                            variant="outline"
                            size="sm"
                            className="capitalize"
                            onClick={() => handleStatusChange(status as Lead['status'])}
                        >
                            {status.replace('-', ' ')}
                        </Button>
                     ))}
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" /> Contact Details
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>
                </div>
                
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Source</Label>
                            {isEditing ? (
                                <Select 
                                    value={formData.source} 
                                    onValueChange={(value) => setFormData({ ...formData, source: value as Lead["source"] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="walk-in">Walk-in</SelectItem>
                                        <SelectItem value="phone">Phone</SelectItem>
                                        <SelectItem value="website">Website</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="cars.co.za">Cars.co.za</SelectItem>
                                        <SelectItem value="autotrader">AutoTrader</SelectItem>
                                        <SelectItem value="facebook">Facebook</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex items-center gap-2 text-sm capitalize">
                                    <Badge variant="outline">
                                        {formData.source}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Assignee</Label>
                            {isEditing ? (
                                <Select 
                                    value={formData.assignedTo || "unassigned"} 
                                    onValueChange={(value) => setFormData({...formData, assignedTo: value === "unassigned" ? undefined : value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select salesperson" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Unassigned</SelectItem>
                                        {mockSalespeople.map((person) => (
                                            <SelectItem key={person.id} value={person.name}>
                                                {person.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="text-sm">
                                    {formData.assignedTo || "Unassigned"}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            {isEditing ? (
                                <Input 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <a href={`mailto:${formData.email}`} className="hover:underline text-blue-600">
                                        {formData.email}
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            {isEditing ? (
                                <Input 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <a href={`tel:${formData.phone}`} className="hover:underline text-blue-600">
                                        {formData.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Deal Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Car className="w-4 h-4" /> Deal Information
                </h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>Interested In</Label>
                        {isEditing ? (
                             <VehicleMultiSelect 
                               selectedIds={selectedVehicleIds}
                               onChange={(ids) => setFormData({...formData, vehicleIds: ids})}
                             />
                        ) : (
                            <div className="text-sm font-medium space-y-1">
                                {selectedVehicles.length > 0 ? (
                                    selectedVehicles.map(v => (
                                        <div key={v!.id} className="p-2 bg-secondary/50 rounded-md">
                                            {v!.year} {v!.make} {v!.model} - R{v!.price.toLocaleString()}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground">General Inquiry</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Assigned To</Label>
                        {isEditing ? (
                             <Select 
                                value={formData.assignedTo || "unassigned"} 
                                onValueChange={(value) => setFormData({...formData, assignedTo: value === "unassigned" ? undefined : value})}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder="Select salesperson" />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="unassigned">Unassigned</SelectItem>
                                 {mockSalespeople.map((p) => (
                                   <SelectItem key={p.id} value={p.name}>
                                     {p.name}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                        ) : (
                            <div className="text-sm">
                                {formData.assignedTo || "Unassigned"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isEditing && (
                <Button className="w-full" onClick={handleSave}>Save Changes</Button>
            )}

            <Separator />

            {/* Documents Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Documents
                    </h3>
                    {lead.documents && lead.documents.length > 0 && (
                        <Badge variant="secondary">{lead.documents.length} Files</Badge>
                    )}
                </div>
                
                {lead.documents && lead.documents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {lead.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                       <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{doc.type.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(doc.url, '_blank')}>
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 border border-dashed rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">No documents uploaded yet.</p>
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm" onClick={() => handleRequestDocuments('copy')}>
                                <Send className="w-3 h-3 mr-2" />
                                Copy Link
                            </Button>
                            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleRequestDocuments('whatsapp')}>
                                <MessageSquare className="w-3 h-3 mr-2" />
                                WhatsApp
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            {/* Notes & History */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History className="w-4 h-4" /> Notes & History
                </h3>
                
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Add Note</Label>
                        <Textarea 
                            placeholder="Type a note here..." 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />
                        <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                            Post Note
                        </Button>
                    </div>

                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-slate-50">
                        {formData.notes ? (
                            <div className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                                {formData.notes}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic">No notes yet.</div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
        
        <SheetFooter className="mt-8">
            <Button variant="outline" onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>

      <SaleSummaryModal 
        isOpen={isSaleSummaryOpen}
        onClose={() => setIsSaleSummaryOpen(false)}
        lead={lead}
      />
    </Sheet>
  );
}

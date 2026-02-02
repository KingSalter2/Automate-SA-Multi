import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead } from "@/types/vehicle";
import { mockVehicles } from "@/data/mockVehicles";
import { mockSalespeople } from "@/data/mockLeads";
import { VehicleMultiSelect } from "@/components/dashboard/VehicleMultiSelect";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (lead: Lead) => void;
}

export function CreateLeadModal({ isOpen, onClose, onCreate }: CreateLeadModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    source: Lead["source"];
    vehicleIds: string[];
    assignedTo: string;
    notes: string;
  }>({
    name: "",
    email: "",
    phone: "",
    source: "walk-in",
    vehicleIds: [],
    assignedTo: "unassigned",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: formData.source,
      status: 'new',
      vehicleIds: formData.vehicleIds,
      assignedTo: formData.assignedTo === "unassigned" ? undefined : formData.assignedTo,
      notes: formData.notes,
      createdAt: new Date(),
    };

    onCreate(newLead);
    onClose();
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "walk-in",
      vehicleIds: [],
      assignedTo: "unassigned",
      notes: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input 
              id="name" 
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                type="tel"
                required
                placeholder="082 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Lead Source</Label>
            <Select 
              value={formData.source} 
              onValueChange={(value) => setFormData({...formData, source: value as Lead['source']})}
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
          </div>

          <div className="space-y-2">
            <Label>Vehicle(s) of Interest</Label>
            <VehicleMultiSelect 
              selectedIds={formData.vehicleIds}
              onChange={(ids) => setFormData({...formData, vehicleIds: ids})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <Select 
              value={formData.assignedTo} 
              onValueChange={(value) => setFormData({...formData, assignedTo: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select salesperson (optional)" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Any additional details..."
              className="min-h-[100px]"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

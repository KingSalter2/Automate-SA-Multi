
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { Lead } from "@/types/vehicle";
import { mockVehicles } from "@/data/mockVehicles";
import { mockLeads, mockSalespeople } from "@/data/mockLeads";
import { addAppointment } from "@/data/mockCalendar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface TestDriveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lead?: Lead | null;
}

export function TestDriveBookingModal({
  isOpen,
  onClose,
  onConfirm,
  lead,
}: TestDriveBookingModalProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [assignee, setAssignee] = useState<string>();
  const [selectedLeadId, setSelectedLeadId] = useState<string>();

  // Use either the passed lead or the selected lead
  const effectiveLead = lead || (selectedLeadId ? mockLeads.find(l => l.id === selectedLeadId) : null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Get vehicle details
  // Handle both vehicleId and vehicleIds
  const vehicleId = effectiveLead?.vehicleIds?.[0] || effectiveLead?.vehicleId;
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  const vehicleName = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : "Unknown Vehicle";

  const handleBook = () => {
    if (!date || !time || !assignee || !effectiveLead) return;

    // Create the appointment
    addAppointment({
      title: `Test Drive - ${vehicleName}`,
      customer: effectiveLead.customerName,
      time: time,
      date: date,
      type: "test-drive",
      location: "Showroom",
      assignedTo: assignee === "me" ? "Me" : mockSalespeople.find(s => s.id === assignee)?.name
    });

    onConfirm();
    resetForm();
  };

  const resetForm = () => {
    setDate(undefined);
    setTime(undefined);
    setAssignee(undefined);
    setSelectedLeadId(undefined);
  };

  // Generate time slots (09:00 to 17:00)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Test Drive</DialogTitle>
          <DialogDescription>
            {effectiveLead 
              ? `Schedule a test drive for ${effectiveLead.customerName} interested in ${vehicleName}.`
              : "Select a lead to schedule a test drive."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!lead && (
            <div className="grid gap-2">
              <Label>Select Lead</Label>
              <Select onValueChange={setSelectedLeadId} value={selectedLeadId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a lead..." />
                </SelectTrigger>
                <SelectContent>
                  {mockLeads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Time</Label>
            <Select onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Assign To</Label>
            <Select onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select salesperson" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me">Me (Current User)</SelectItem>
                {mockSalespeople.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBook} disabled={!date || !time || !assignee || !effectiveLead}>
            Book Test Drive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, User, Calendar as CalendarIcon, Clock, CheckCircle2, Car } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PublicTestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
}

export function PublicTestDriveModal({ isOpen, onClose, vehicleName }: PublicTestDriveModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    date: Date | undefined;
    time: string;
  }>({
    name: "",
    email: "",
    phone: "",
    date: undefined,
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) {
        toast({
            title: "Date Required",
            description: "Please select a preferred date for your test drive.",
            variant: "destructive"
        });
        return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Test Drive Requested",
        description: "We have received your request and will confirm your booking shortly.",
      });
      
      // Reset after 2 seconds and close
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
            name: "",
            email: "",
            phone: "",
            date: undefined,
            time: "",
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-card border-border overflow-hidden">
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Request Sent!</h2>
            <p className="text-muted-foreground">
              Thank you for your interest. We will confirm your test drive for <span className="text-foreground font-medium">{vehicleName}</span> shortly.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 bg-secondary/10 border-b border-border">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Book a Test Drive
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Fill in your details below to request a test drive for the <span className="text-foreground font-medium">{vehicleName}</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="pl-9 bg-secondary/20 border-border/50 focus:border-primary"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="pl-9 bg-secondary/20 border-border/50 focus:border-primary"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="082 123 4567" 
                      className="pl-9 bg-secondary/20 border-border/50 focus:border-primary"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium">Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-secondary/20 border-border/50 focus:border-primary hover:bg-secondary/30",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        {formData.date ? (
                          format(formData.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({...formData, date})}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">Preferred Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="time" 
                      type="time" 
                      className="pl-9 bg-secondary/20 border-border/50 focus:border-primary"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? "Sending Request..." : "Request Test Drive"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

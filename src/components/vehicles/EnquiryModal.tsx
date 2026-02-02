
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, User, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
}

export function EnquiryModal({ isOpen, onClose, vehicleName }: EnquiryModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I am interested in the ${vehicleName}. Please contact me with more information.`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Enquiry Sent",
        description: "We have received your enquiry and will contact you shortly.",
      });
      
      // Reset after 2 seconds and close
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
            name: "",
            email: "",
            phone: "",
            message: `I am interested in the ${vehicleName}. Please contact me with more information.`,
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
            <h2 className="text-2xl font-bold text-foreground">Enquiry Sent!</h2>
            <p className="text-muted-foreground">
              Thank you for your interest. One of our agents will be in touch with you shortly.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 bg-secondary/10 border-b border-border">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Enquire about this Vehicle
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Fill in your details below and we'll get back to you regarding the <span className="text-foreground font-medium">{vehicleName}</span>.
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
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
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
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
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

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="I am interested in..." 
                  className="min-h-[100px] bg-secondary/20 border-border/50 focus:border-primary resize-none"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-bold gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Enquiry <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Vehicle } from "@/types/vehicle";
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2, 
  Palette, 
  CheckCircle2, 
  Car,
  Users,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Phone,
  MessageCircle,
  Share2,
  Facebook,
  Twitter
} from "lucide-react";
import { useState } from "react";

interface VehiclePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Partial<Vehicle> | null;
}

export function VehiclePreviewDialog({
  open,
  onOpenChange,
  vehicle,
}: VehiclePreviewDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!vehicle) {
    // Keep dialog mounted but closed/empty if vehicle is null
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="hidden">
         </DialogContent>
      </Dialog>
    );
  }

  const displayImages = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [];

  const nextImage = () => {
    if (displayImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }
  };

  const prevImage = () => {
    if (displayImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return "R 0";
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Calculate estimated monthly payment (simple logic: 12% interest, 72 months, no deposit)
  const calculateMonthly = (price?: number) => {
    if (!price) return "R 0";
    const interestRate = 0.12;
    const months = 72;
    const monthlyInterest = interestRate / 12;
    const payment = (price * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(payment);
  };

  const shareUrl = window.location.href; // Placeholder

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            Vehicle Preview
            {vehicle.status === 'draft' && <Badge variant="secondary">Draft Mode</Badge>}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Images & Main Details (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Image Gallery */}
                <div className="relative aspect-[16/9] bg-secondary rounded-2xl overflow-hidden group">
                  {displayImages.length > 0 ? (
                    <img 
                      src={displayImages[currentImageIndex]} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <Car className="w-16 h-16 opacity-20" />
                      <span className="ml-2 opacity-50">No Images Available</span>
                    </div>
                  )}
                  
                  {/* Navigation Arrows (only if multiple images) */}
                  {displayImages.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                      {vehicle.condition || 'Used'}
                    </Badge>
                    {vehicle.status === 'sold' && <Badge variant="destructive">Sold</Badge>}
                    {vehicle.status === 'reserved' && <Badge className="bg-yellow-500">Reserved</Badge>}
                  </div>
                </div>

                {/* Thumbnails (Added for Preview Dialog specifically for better UX) */}
                {displayImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {displayImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                          currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Title & Key Specs */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">{vehicle.variant}</p>
                  
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Calendar, label: "Year", value: vehicle.year },
                      { icon: Gauge, label: "Mileage", value: `${(vehicle.mileage || 0).toLocaleString()} km` },
                      { icon: Settings2, label: "Transmission", value: vehicle.transmission },
                      { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
                      { icon: Car, label: "Body Type", value: vehicle.bodyType },
                      { icon: Users, label: "Seats", value: vehicle.seats ?? 5 },
                      { icon: CheckCircle2, label: "Condition", value: vehicle.condition },
                      { icon: Palette, label: "Color", value: vehicle.color },
                      { icon: Settings2, label: "Drive", value: vehicle.drive || "4x2" } 
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
                        <item.icon className="w-6 h-6 text-primary mb-2" />
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-display">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {vehicle.description || "No description provided."}
                  </p>
                </div>

                {/* Features List */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-display">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/10 border border-border/50">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Pricing & Actions (1/3 width) */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  
                  {/* Pricing Card */}
                  <div className="p-6 rounded-2xl border border-border bg-card shadow-lg">
                    <div className="space-y-1 mb-6">
                      <p className="text-sm text-muted-foreground">Retail Price</p>
                      <div className="text-4xl font-bold font-display text-primary">
                        {formatPrice(vehicle.price)}
                      </div>
                      {vehicle.originalPrice && vehicle.price && vehicle.originalPrice > vehicle.price && (
                        <p className="text-sm text-muted-foreground line-through">
                          was {formatPrice(vehicle.originalPrice)}
                        </p>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/30 mb-6 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Est. Monthly</span>
                        <span className="font-bold text-lg">{calculateMonthly(vehicle.price)} p/m</span>
                      </div>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-primary w-full justify-end text-xs"
                      >
                        Recalculate <Calculator className="w-3 h-3 ml-1" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full h-12 text-lg font-bold gap-2">
                        <Phone className="w-5 h-5" /> Enquire Now
                      </Button>
                      <Button variant="outline" className="w-full h-12 text-lg gap-2">
                        <MessageCircle className="w-5 h-5" /> Whatsapp Us
                      </Button>
                    </div>
                  </div>

                  {/* Share Card */}
                  <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Share2 className="w-4 h-4" /> Share this Vehicle
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="w-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors">
                        <Facebook className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" className="w-full hover:bg-black hover:text-white hover:border-black transition-colors">
                        <Twitter className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" className="w-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Test Drive Card */}
                  <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Car className="w-4 h-4" /> Test Drive
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Want to experience this vehicle? Book a test drive today.
                    </p>
                    <Button className="w-full gap-2">
                      <Calendar className="w-4 h-4" /> Request Test Drive
                    </Button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t flex justify-end gap-2 bg-background z-10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

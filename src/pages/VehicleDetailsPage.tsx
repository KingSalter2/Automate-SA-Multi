import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVehicles } from "@/data/mockVehicles";
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2, 
  Palette, 
  CheckCircle2, 
  Share2, 
  Calculator,
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  MessageCircle,
  Car,
  Users
} from "lucide-react";
import { useState } from "react";
import NotFound from "./NotFound";
import { FinanceCalculatorModal } from "@/components/finance/FinanceCalculatorModal";
import { EnquiryModal } from "@/components/vehicles/EnquiryModal";
import { PublicTestDriveModal } from "@/components/vehicles/PublicTestDriveModal";

// Import vehicle images same as VehicleCard for consistency
// Ideally these should be in a centralized helper or context
import bmw3Series from '@/assets/vehicles/bmw-3-series.jpg';
import mercedesCClass from '@/assets/vehicles/mercedes-c-class.jpg';
import vwGolfGti from '@/assets/vehicles/vw-golf-gti.jpg';
import toyotaHilux from '@/assets/vehicles/toyota-hilux.jpg';
import fordRanger from '@/assets/vehicles/ford-ranger.jpg';
import audiA4 from '@/assets/vehicles/audi-a4.jpg';
import porscheCayenne from '@/assets/vehicles/porsche-cayenne.jpg';
import landRoverDefender from '@/assets/vehicles/land-rover-defender.jpg';

const vehicleImages: Record<string, string> = {
  '1': bmw3Series,
  '2': mercedesCClass,
  '3': vwGolfGti,
  '4': toyotaHilux,
  '5': fordRanger,
  '6': audiA4,
  '7': porscheCayenne,
  '8': landRoverDefender,
};

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const vehicle = mockVehicles.find((v) => v.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);

  if (!vehicle) {
    return <NotFound />;
  }

  // Fallback to single image if multiple images aren't in mock data
  // In a real app, vehicle.images would be an array of URLs
  const displayImages = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [vehicleImages[vehicle.id] || vehicleImages['1']];

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate estimated monthly payment (simple logic: 12% interest, 72 months, no deposit)
  const calculateMonthly = (price: number) => {
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link to="/vehicles" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Vehicles
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Images & Main Details (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Image Gallery */}
              <div className="relative aspect-[16/9] bg-secondary rounded-2xl overflow-hidden group">
                <img 
                  src={displayImages[currentImageIndex] as string} 
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                
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
                    {vehicle.condition}
                  </Badge>
                  {vehicle.status === 'sold' && <Badge variant="sold">Sold</Badge>}
                  {vehicle.status === 'reserved' && <Badge variant="reserved">Reserved</Badge>}
                </div>
              </div>

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
                    { icon: Settings2, label: "Drive", value: vehicle.drive ?? "4x2" } 
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
                <p className="text-muted-foreground leading-relaxed">
                  Experience the perfect blend of performance and luxury with this {vehicle.year} {vehicle.make} {vehicle.model}. 
                  Finished in a stunning {vehicle.color}, this vehicle has been meticulously maintained and comes with a full service history.
                  Ideally suited for both city driving and long-distance cruising.
                  <br /><br />
                  This {vehicle.variant} model features the robust {vehicle.engineSize} engine, delivering exceptional power while maintaining efficiency.
                  Don't miss out on this incredible opportunity to own a premium vehicle at a competitive price.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold font-display">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/10 border border-border/50">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Pricing & Actions (1/3 width) - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Pricing Card */}
                <div className="p-6 rounded-2xl border border-border bg-card shadow-lg">
                  <div className="space-y-1 mb-6">
                    <p className="text-sm text-muted-foreground">Retail Price</p>
                    <div className="text-4xl font-bold font-display text-primary">
                      {formatPrice(vehicle.price)}
                    </div>
                    {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
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
                      onClick={() => setIsFinanceModalOpen(true)}
                    >
                      Recalculate <Calculator className="w-3 h-3 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full h-12 text-lg font-bold gap-2"
                      onClick={() => setIsEnquiryModalOpen(true)}
                    >
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
                    <Button variant="outline" className="w-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}>
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="w-full hover:bg-black hover:text-white hover:border-black transition-colors" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=Check out this ${vehicle.make} ${vehicle.model}`, '_blank')}>
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="w-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors" onClick={() => window.open(`https://wa.me/?text=Check out this ${vehicle.make} ${vehicle.model}: ${shareUrl}`, '_blank')}>
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
                  <Button className="w-full gap-2" onClick={() => setIsTestDriveModalOpen(true)}>
                    <Calendar className="w-4 h-4" /> Request Test Drive
                  </Button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <FinanceCalculatorModal 
        isOpen={isFinanceModalOpen} 
        onClose={() => setIsFinanceModalOpen(false)} 
        vehiclePrice={vehicle.price} 
      />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      <PublicTestDriveModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      <Footer />
    </div>
  );
};

export default VehicleDetailsPage;

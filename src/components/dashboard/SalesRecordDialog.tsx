import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle, Lead, LeadDocument } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { 
  Car, 
  User, 
  FileText, 
  History, 
  Calendar,
  CreditCard,
  MapPin,
  Tag,
  ShieldCheck,
  Wrench,
  Info,
  Image as ImageIcon,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Archive,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle as CardTitleUI } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SalesRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  lead: Lead;
}

export function SalesRecordDialog({ isOpen, onClose, vehicle, lead }: SalesRecordDialogProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 bg-secondary/10">
        <DialogHeader className="p-6 pb-4 bg-background border-b shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                  {vehicle.stockNumber}
                </Badge>
                <Badge className="bg-green-600 hover:bg-green-700">Sold</Badge>
              </div>
              <DialogTitle className="text-3xl font-display font-bold text-primary">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground text-lg">{vehicle.variant}</p>
                {vehicle.images && vehicle.images.length > 0 && (
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setIsGalleryOpen(true)}>
                    <ImageIcon className="w-3 h-3" />
                    View Photos
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setIsDocumentsOpen(true)}>
                  <FileText className="w-3 h-3" />
                  Documents
                </Button>
              </div>
            </div>
            <div className="text-right bg-card px-4 py-2 rounded-lg border shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sale Price</p>
              <p className="text-2xl font-bold text-primary">
                {lead.saleDetails?.salePrice ? formatCurrency(lead.saleDetails.salePrice) : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                Sold on {lead.saleDetails?.soldDate ? format(lead.saleDetails.soldDate, 'PPP') : 'N/A'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Vehicle & Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vehicle Specs */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                    <Car className="w-5 h-5" /> Vehicle Specifications
                  </CardTitleUI>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    <DetailItem label="Year" value={vehicle.year} icon={Calendar} />
                    <DetailItem label="VIN" value={vehicle.vin} icon={Info} />
                    <DetailItem label="Engine" value={vehicle.engineSize} icon={Wrench} />
                    <DetailItem label="Transmission" value={vehicle.transmission} />
                    <DetailItem label="Fuel Type" value={vehicle.fuelType} />
                    <DetailItem label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
                    <DetailItem label="Color" value={vehicle.color} />
                    <DetailItem label="Body Type" value={vehicle.bodyType} />
                    <DetailItem label="Condition" value={vehicle.condition} />
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                    <Tag className="w-5 h-5" /> Features & Options
                  </CardTitleUI>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-normal bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* History Timeline */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                    <History className="w-5 h-5" /> Transaction History
                  </CardTitleUI>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-primary/20 ml-3 space-y-8 py-2">
                    {lead.history?.map((event, index) => (
                      <div key={index} className="pl-6 relative group">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-4 border-primary/20 group-hover:border-primary transition-colors" />
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div>
                            <p className="font-bold text-foreground">{event.action}</p>
                            <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge variant="outline" className="font-mono text-xs">
                              {format(event.date, 'MMM d, HH:mm')}
                            </Badge>
                            <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mt-2">
                              <User className="w-3 h-3" />
                              <span className="font-medium">{event.performedBy}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Buyer, Financials, Admin */}
            <div className="space-y-6">
              {/* Buyer Info */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                    <User className="w-5 h-5" /> Customer Details
                  </CardTitleUI>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {lead.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{lead.customerName}</p>
                      <p className="text-xs text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <DetailItem label="Email" value={lead.email} fullWidth />
                    <DetailItem label="Phone" value={lead.phone} fullWidth />
                    <DetailItem label="Address" value={lead.address} fullWidth icon={MapPin} />
                  </div>
                </CardContent>
              </Card>

              {/* Financials */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                    <CreditCard className="w-5 h-5" /> Financial Details
                  </CardTitleUI>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Sale Price" value={lead.saleDetails?.salePrice ? formatCurrency(lead.saleDetails.salePrice) : 'N/A'} />
                    <DetailItem label="Payment Type" value={lead.saleDetails?.paymentType} className="capitalize" />
                    
                    {lead.saleDetails?.paymentType === 'financed' && (
                      <>
                        <DetailItem label="Bank" value={lead.saleDetails?.bankName} />
                        <DetailItem label="Term" value={lead.saleDetails?.financeTerm ? `${lead.saleDetails.financeTerm} Months` : '-'} />
                      </>
                    )}
                    
                    {lead.saleDetails?.depositAmount && (
                      <DetailItem label="Deposit" value={formatCurrency(lead.saleDetails.depositAmount)} />
                    )}
                    
                    {lead.saleDetails?.balloonPayment && (
                      <DetailItem label="Balloon" value={formatCurrency(lead.saleDetails.balloonPayment)} />
                    )}

                    <DetailItem label="Discount" value={lead.saleDetails?.discountAmount ? formatCurrency(lead.saleDetails.discountAmount) : '-'} />
                    <DetailItem label="Sold Date" value={lead.saleDetails?.soldDate ? format(lead.saleDetails.soldDate, 'PPP') : 'N/A'} />
                  </div>
                </CardContent>
              </Card>

              {/* Trade-In Details */}
              {lead.saleDetails?.tradeIn && (
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                      <Car className="w-5 h-5" /> Trade-In Details
                    </CardTitleUI>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Car className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-bold text-foreground">
                            {lead.saleDetails.tradeIn.year} {lead.saleDetails.tradeIn.make} {lead.saleDetails.tradeIn.model}
                          </p>
                          {lead.saleDetails.tradeIn.vin && (
                            <p className="text-xs text-muted-foreground">VIN: {lead.saleDetails.tradeIn.vin}</p>
                          )}
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Allowance" value={formatCurrency(lead.saleDetails.tradeIn.allowance)} />
                      {lead.saleDetails.tradeIn.settlement && (
                        <DetailItem label="Settlement" value={formatCurrency(lead.saleDetails.tradeIn.settlement)} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Admin Details */}
              <Card className="border-none shadow-sm bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitleUI className="text-lg flex items-center gap-2 text-primary">
                    <ShieldCheck className="w-5 h-5" /> Admin Only
                  </CardTitleUI>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailItem label="NaTIS Number" value={vehicle.natisNumber} fullWidth />
                  <DetailItem label="Key Number" value={vehicle.keyNumber} fullWidth />
                  <DetailItem label="Previous Owner" value={vehicle.previousOwner} fullWidth />
                  <DetailItem label="Supplier" value={vehicle.supplier} fullWidth />
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
                     <DetailItem label="Cost Price" value={vehicle.costPrice ? formatCurrency(vehicle.costPrice) : '-'} />
                     <DetailItem label="Recon Cost" value={vehicle.reconditioningCost ? formatCurrency(vehicle.reconditioningCost) : '-'} />
                  </div>
                  <DetailItem label="Branch" value={vehicle.branch} fullWidth />
                  <DetailItem label="Purchase Date" value={vehicle.purchaseDate ? format(vehicle.purchaseDate, 'PP') : '-'} fullWidth />
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-screen-lg h-[80vh] p-0 bg-black/95 border-none flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            {/* Navigation Buttons */}
            {vehicle.images && vehicle.images.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === 0 ? (vehicle.images?.length || 1) - 1 : prev - 1);
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === (vehicle.images?.length || 1) - 1 ? 0 : prev + 1);
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
            
            <img 
              src={vehicle.images?.[currentImageIndex] || '/placeholder.svg'} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="max-h-full max-w-full object-contain rounded-md"
            />
            
            {vehicle.images && vehicle.images.length > 1 && (
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full p-2">
                 {vehicle.images.map((img, i) => (
                   <div 
                     key={i} 
                     className={`w-16 h-12 rounded border-2 cursor-pointer overflow-hidden transition-all ${i === currentImageIndex ? 'border-primary scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                     onClick={() => setCurrentImageIndex(i)}
                   >
                     <img src={img} className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Documents
              </DialogTitle>
              {lead.documents && lead.documents.length > 0 && (
                <Button onClick={() => {
                  alert("Downloading all documents as ZIP...");
                }}>
                  <Archive className="w-4 h-4 mr-2" />
                  Download All (ZIP)
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Client Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                  <User className="w-5 h-5" /> Client Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lead.documents?.filter(d => ['id', 'license', 'proof_of_res', 'payslip', 'bank_statement'].includes(d.type)).map((doc, i) => (
                    <DocumentCard key={i} doc={doc} />
                  ))}
                  {(!lead.documents || !lead.documents.some(d => ['id', 'license', 'proof_of_res', 'payslip', 'bank_statement'].includes(d.type))) && (
                    <p className="text-muted-foreground text-sm col-span-full italic">No client documents found.</p>
                  )}
                </div>
              </div>

              {/* Bank Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                  <CreditCard className="w-5 h-5" /> Bank Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lead.documents?.filter(d => ['finance_application'].includes(d.type)).map((doc, i) => (
                    <DocumentCard key={i} doc={doc} />
                  ))}
                  {(!lead.documents || !lead.documents.some(d => ['finance_application'].includes(d.type))) && (
                    <p className="text-muted-foreground text-sm col-span-full italic">No bank documents found.</p>
                  )}
                </div>
              </div>

              {/* Sales Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                  <FileText className="w-5 h-5" /> Sales & Delivery Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lead.documents?.filter(d => ['contract', 'otp', 'sales_invoice', 'other'].includes(d.type)).map((doc, i) => (
                    <DocumentCard key={i} doc={doc} />
                  ))}
                  {(!lead.documents || !lead.documents.some(d => ['contract', 'otp', 'sales_invoice', 'other'].includes(d.type))) && (
                    <p className="text-muted-foreground text-sm col-span-full italic">No sales documents found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </Dialog>
  );
}

function DocumentCard({ doc }: { doc: LeadDocument }) {
  return (
    <div className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
      <div className="flex items-start gap-3 overflow-hidden">
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
           <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate text-sm" title={doc.name}>{doc.name}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{doc.type.replace(/_/g, ' ')}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{format(doc.uploadedAt, 'MMM d, yyyy')}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => window.open(doc.url, '_blank')}>
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value?: string | number | null;
  icon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
}

function DetailItem({ label, value, icon: Icon, fullWidth = false, className = "" }: DetailItemProps) {
  const displayValue = value === null || value === undefined || value === "" ? "N/A" : value;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </p>
      <p className="font-medium text-sm text-foreground break-words">{displayValue}</p>
    </div>
  );
}

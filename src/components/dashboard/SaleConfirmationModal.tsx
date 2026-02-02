import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead, Vehicle } from "@/types/vehicle";
import { mockVehicles } from "@/data/mockVehicles";
import { DollarSign, Calculator, FileText } from "lucide-react";

interface SaleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saleDetails: NonNullable<Lead["saleDetails"]>) => void;
  lead: Lead | null;
}

export function SaleConfirmationModal({ isOpen, onClose, onConfirm, lead }: SaleConfirmationModalProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<'cash' | 'financed'>('financed');
  const [notes, setNotes] = useState("");
  
  useEffect(() => {
    if (lead && isOpen) {
        // Find the vehicle
        const vehicleId = lead.vehicleIds?.[0] || lead.vehicleId;
        const foundVehicle = mockVehicles.find(v => v.id === vehicleId);
        
        if (foundVehicle) {
            setVehicle(foundVehicle);
            setOriginalPrice(foundVehicle.price);
            setSalePrice(foundVehicle.price);
            setDiscountAmount(0);
            setDiscountPercentage(0);
        } else {
            // Fallback if no vehicle found
            setOriginalPrice(0);
            setSalePrice(0);
        }
        setNotes("");
        setPaymentType('financed');
    }
  }, [lead, isOpen]);

  const handleSalePriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    setSalePrice(price);
    
    // Calculate discount
    if (originalPrice > 0) {
        const discount = originalPrice - price;
        setDiscountAmount(Math.max(0, discount));
        setDiscountPercentage(Math.max(0, (discount / originalPrice) * 100));
    }
  };

  const handleDiscountAmountChange = (value: string) => {
    const discount = parseFloat(value) || 0;
    setDiscountAmount(discount);
    
    // Calculate sale price
    const price = Math.max(0, originalPrice - discount);
    setSalePrice(price);
    
    if (originalPrice > 0) {
        setDiscountPercentage(Math.max(0, (discount / originalPrice) * 100));
    }
  };

  const handleConfirm = () => {
    const saleDetails = {
        salePrice,
        paymentType,
        discountAmount,
        discountPercentage: parseFloat(discountPercentage.toFixed(2)),
        discountReason: notes,
        soldDate: new Date()
    };
    onConfirm(saleDetails);
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Confirm Sale
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-muted/50 p-4 rounded-lg">
             <h3 className="font-semibold text-sm mb-2">Vehicle Details</h3>
             {vehicle ? (
                 <div className="text-sm">
                     <div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                     <div className="text-muted-foreground mt-1">Listed Price: R {originalPrice.toLocaleString()}</div>
                 </div>
             ) : (
                 <div className="text-sm text-muted-foreground">No vehicle details available</div>
             )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup 
                    defaultValue="financed" 
                    value={paymentType}
                    onValueChange={(val) => setPaymentType(val as 'cash' | 'financed')}
                    className="flex gap-4"
                >
                    <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="financed" id="financed" />
                        <Label htmlFor="financed" className="cursor-pointer">Financed</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Sale Price (R)</Label>
                    <Input 
                        type="number" 
                        value={salePrice} 
                        onChange={(e) => handleSalePriceChange(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Discount Amount (R)</Label>
                    <Input 
                        type="number" 
                        value={discountAmount} 
                        onChange={(e) => handleDiscountAmountChange(e.target.value)}
                    />
                </div>
            </div>

            {discountAmount > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    <Calculator className="w-4 h-4" />
                    <span>Discount: {discountPercentage.toFixed(2)}% off original price</span>
                </div>
            )}

            {discountAmount > 0 && (
                <div className="space-y-2">
                    <Label>Reason for Discount</Label>
                    <Textarea 
                        placeholder="Why was this discount applied?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="resize-none"
                    />
                </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white">
            Confirm Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

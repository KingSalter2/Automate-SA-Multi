import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Lead } from "@/types/vehicle";

interface SaleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

export function SaleSummaryModal({ isOpen, onClose, lead }: SaleSummaryModalProps) {
  if (!lead.saleDetails) return null;

  const { saleDetails } = lead;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Sale Summary</DialogTitle>
            <DialogDescription>
                Details for sale to {lead.customerName}
            </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Sale Date</span>
                    <span className="font-medium">{format(new Date(saleDetails.soldDate), "PPP")}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Payment Type</span>
                    <span className="font-medium capitalize">{saleDetails.paymentType}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Sale Price</span>
                    <span className="font-medium text-base">R {saleDetails.salePrice.toLocaleString()}</span>
                </div>
                
                {(saleDetails.discountAmount > 0) && (
                    <>
                         <div>
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">Discount</span>
                            <span className="font-medium text-red-600">- R {saleDetails.discountAmount.toLocaleString()}</span>
                        </div>
                         <div>
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">Discount %</span>
                            <span className="font-medium text-red-600">{saleDetails.discountPercentage.toFixed(2)}%</span>
                        </div>
                    </>
                )}
            </div>

            {saleDetails.discountReason && (
                <div className="space-y-1.5">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider block">Discount Reason</span>
                    <div className="p-3 bg-muted/50 border rounded-md text-sm italic">
                        "{saleDetails.discountReason}"
                    </div>
                </div>
            )}
        </div>

        <DialogFooter>
            <Button onClick={onClose} className="w-full sm:w-auto">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

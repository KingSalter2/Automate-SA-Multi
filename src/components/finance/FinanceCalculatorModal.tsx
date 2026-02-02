import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calculator, Calendar, DollarSign, Percent, Info } from 'lucide-react';

interface FinanceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehiclePrice: number;
}

export function FinanceCalculatorModal({
  isOpen,
  onClose,
  vehiclePrice,
}: FinanceCalculatorModalProps) {
  // State for inputs
  const [price, setPrice] = useState(vehiclePrice);
  const [deposit, setDeposit] = useState(vehiclePrice * 0.1); // Default 10% deposit
  const [tradeIn, setTradeIn] = useState(0);
  const [interestRate, setInterestRate] = useState(12.25);
  const [residualPercent, setResidualPercent] = useState(0);
  const [months, setMonths] = useState(72);

  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalLoan, setTotalLoan] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);

  useEffect(() => {
    // Reset defaults when modal opens or vehicle price changes
    if (isOpen) {
      setPrice(vehiclePrice);
      setDeposit(vehiclePrice * 0.1);
      // Other values keep their user-set state or defaults
    }
  }, [isOpen, vehiclePrice]);

  useEffect(() => {
    calculateFinance();
  }, [price, deposit, tradeIn, interestRate, residualPercent, months]);

  const calculateFinance = () => {
    const principal = price - deposit - tradeIn;
    const residualValue = price * (residualPercent / 100);
    const monthlyRate = interestRate / 100 / 12;
    
    let pmt = 0;

    if (monthlyRate === 0) {
      pmt = (principal - residualValue) / months;
    } else {
      // Standard PMT formula with Balloon Payment (Residual)
      // PMT = (P - FV/(1+r)^n) * (r / (1 - (1+r)^-n))
      const numerator = principal - (residualValue / Math.pow(1 + monthlyRate, months));
      const denominator = (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
      pmt = numerator / denominator;
    }

    const totalPaidToBank = (pmt * months) + residualValue;
    const totalInt = totalPaidToBank - principal;

    setMonthlyPayment(pmt);
    setTotalLoan(principal);
    setTotalInterest(totalInt);
    setTotalRepayment(totalPaidToBank);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(val).replace('ZAR', 'R');
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
        maximumFractionDigits: 0,
        useGrouping: true
    }).format(val).replace(/,/g, ' '); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-none shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full lg:h-[650px]">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 p-6 lg:p-8 space-y-8 bg-card overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-display font-bold text-foreground">
                Finance Calculator
              </DialogTitle>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Vehicle Purchase Price
                </Label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R</span>
                  <Input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="pl-8 h-12 bg-secondary/20 border-border/50 focus:border-primary transition-colors text-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Deposit Amount
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R</span>
                    <Input 
                      type="number" 
                      value={deposit} 
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="pl-8 h-12 bg-secondary/20 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Trade In Value
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R</span>
                    <Input 
                      type="number" 
                      value={tradeIn} 
                      onChange={(e) => setTradeIn(Number(e.target.value))}
                      className="pl-8 h-12 bg-secondary/20 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Percent className="w-4 h-4" /> Interest Rate
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
                    <Input 
                      type="number" 
                      value={interestRate} 
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="pl-8 h-12 bg-secondary/20 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Percent className="w-4 h-4" /> Residual (Balloon)
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
                    <Input 
                      type="number" 
                      value={residualPercent} 
                      onChange={(e) => setResidualPercent(Number(e.target.value))}
                      className="pl-8 h-12 bg-secondary/20 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Repayment Period (Months)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[12, 24, 36, 48, 60, 72].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={cn(
                        "flex-1 min-w-[60px] h-12 rounded-lg text-sm font-bold transition-all duration-200 border",
                        months === m 
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                          : "bg-secondary/20 text-foreground border-border hover:border-primary/50 hover:bg-secondary/40"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 bg-zinc-950 text-white p-6 lg:p-8 flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_40%)]" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Estimated Monthly Payment</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
                    {formatCurrency(monthlyPayment).replace('R', '')}
                  </span>
                  <span className="text-xl text-primary font-bold">R</span>
                  <span className="text-zinc-500 text-lg ml-2">/pm</span>
                </div>
              </div>

              <div className="grid gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Loan Amount</p>
                  <p className="text-xl font-bold text-white">R {formatNumber(totalLoan)}</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-white">R {formatNumber(totalInterest)}</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Repayment</p>
                  <p className="text-xl font-bold text-white">R {formatNumber(totalRepayment)}</p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    <span className="text-red-400 font-bold block mb-1">Disclaimer</span>
                    Calculations are estimates only. Does not include license, registration, or admin fees. Subject to bank approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, Percent, Calendar } from 'lucide-react';

interface FinanceCalculatorProps {
  vehiclePrice?: number;
  compact?: boolean;
}

export function FinanceCalculator({ vehiclePrice, compact = false }: FinanceCalculatorProps) {
  const [price, setPrice] = useState(vehiclePrice || 500000);
  const [deposit, setDeposit] = useState(50000);
  const [term, setTerm] = useState(72);
  const [interestRate, setInterestRate] = useState(11.75);
  const [balloon, setBalloon] = useState(0);

  const calculations = useMemo(() => {
    const principal = price - deposit;
    const balloonAmount = (balloon / 100) * price;
    const financeAmount = principal - balloonAmount;
    const monthlyRate = interestRate / 100 / 12;
    
    // Monthly payment calculation with balloon
    const monthlyPayment = financeAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, term)) / 
      (Math.pow(1 + monthlyRate, term) - 1);
    
    const totalPayment = (monthlyPayment * term) + balloonAmount;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      financeAmount: Math.round(financeAmount),
      balloonAmount: Math.round(balloonAmount),
    };
  }, [price, deposit, term, interestRate, balloon]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (compact) {
    return (
      <Card variant="glass" className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Monthly</p>
              <p className="text-2xl font-bold font-display text-foreground">
                {formatCurrency(calculations.monthlyPayment)}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {term} months @ {interestRate}% interest
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Calculate Finance
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="feature" className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">Finance Calculator</h3>
            <p className="text-sm text-muted-foreground font-normal">Calculate your monthly payments</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Vehicle Price
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Deposit</label>
            <Input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Term (months)
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary transition-all"
            >
              {[36, 48, 60, 72, 84].map((t) => (
                <option key={t} value={t}>{t} months</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Interest Rate (%)
            </label>
            <Input
              type="number"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="h-12"
            />
          </div>
        </div>

        {/* Balloon Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Balloon Payment</label>
            <span className="text-sm font-bold text-primary">{balloon}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="35"
            step="5"
            value={balloon}
            onChange={(e) => setBalloon(Number(e.target.value))}
            className="w-full h-2 rounded-full bg-secondary appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>35%</span>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 rounded-xl bg-gradient-dark border border-border/50 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
            <p className="text-4xl font-bold font-display text-gradient-primary mt-1">
              {formatCurrency(calculations.monthlyPayment)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">per month</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Finance Amount</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(calculations.financeAmount)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(calculations.totalInterest)}
              </p>
            </div>
            {balloon > 0 && (
              <>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Balloon Amount</p>
                  <p className="text-lg font-bold text-accent">
                    {formatCurrency(calculations.balloonAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total Payable</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(calculations.totalPayment)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          *This is an estimate. Actual rates may vary based on credit profile and bank conditions.
        </p>

        <Button variant="hero" size="lg" className="w-full">
          Apply for Finance
        </Button>
      </CardContent>
    </Card>
  );
}

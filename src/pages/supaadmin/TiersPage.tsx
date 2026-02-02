
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Edit2, 
  Plus, 
  Users, 
  Car, 
  Zap, 
  ShieldCheck,
  Crown,
  CreditCard,
  Settings
} from "lucide-react";
import { mockTiers, mockFeatures } from "@/data/mockSupaAdmin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Tier {
  name: string;
  price: number;
  features: string[];
  maxUsers: number;
  maxCars: number;
}

const TiersPage = () => {
  const [tiers, setTiers] = useState<Tier[]>(mockTiers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    maxUsers: "",
    maxCars: "",
    features: [] as string[]
  });

  const getFeatureName = (id: string) => {
    return mockFeatures.find(f => f.id === id)?.name || id;
  };

  const handleOpenDialog = (tier: Tier | null = null) => {
    if (tier) {
      setEditingTier(tier);
      setFormData({
        name: tier.name,
        price: tier.price.toString(),
        maxUsers: tier.maxUsers.toString(),
        maxCars: tier.maxCars.toString(),
        features: tier.features
      });
    } else {
      setEditingTier(null);
      setFormData({
        name: "",
        price: "",
        maxUsers: "",
        maxCars: "",
        features: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.maxUsers || !formData.maxCars) {
      toast.error("Please fill in all fields");
      return;
    }

    const newTier = {
      name: formData.name,
      price: parseInt(formData.price),
      maxUsers: parseInt(formData.maxUsers),
      maxCars: parseInt(formData.maxCars),
      features: formData.features
    };

    if (editingTier) {
      setTiers(tiers.map(t => t.name === editingTier.name ? newTier : t));
      toast.success("Tier updated successfully");
    } else {
      setTiers([...tiers, newTier]);
      toast.success("New tier created successfully");
    }
    setIsDialogOpen(false);
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Tier Management</h1>
          <p className="text-muted-foreground mt-1">Configure pricing tiers and feature limits for your platform.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Add New Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {tiers.map((tier, index) => {
          const isPopular = tier.name === "Professional";
          
          return (
            <div 
              key={tier.name} 
              className={cn(
                "relative flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500",
                { "delay-100": index === 1, "delay-200": index === 2 }
              )}
            >
              {isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary px-4 py-1 text-sm shadow-md">
                    <Crown className="w-3 h-3 mr-1.5 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={cn(
                "flex flex-col h-full border-border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300",
                isPopular ? "border-primary/50 shadow-lg shadow-primary/5 border-2" : "hover:border-primary/20"
              )}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className={cn(
                      "p-2 rounded-lg w-10 h-10 flex items-center justify-center",
                      isPopular ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    )}>
                      {tier.name === "Enterprise" ? <ShieldCheck className="w-5 h-5" /> : 
                       tier.name === "Professional" ? <Zap className="w-5 h-5" /> : 
                       <Car className="w-5 h-5" />}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">R {tier.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <CardDescription className="mt-2">
                    Perfect for {tier.name === "Basic" ? "small dealerships" : 
                                tier.name === "Professional" ? "growing businesses" : 
                                "large scale operations"}.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-6">
                  {/* Limits Section */}
                  <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Plan Limits
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-medium">{tier.maxUsers === 999 ? 'Unlimited' : tier.maxUsers} Users</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="font-medium">{tier.maxCars} Cars</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features Section */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Included Features
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((featureId) => (
                        <li key={featureId} className="flex items-start gap-3 text-sm">
                          <div className="mt-0.5 rounded-full bg-primary/10 p-0.5 shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground leading-tight">{getFeatureName(featureId)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-6 pb-6">
                  <Button 
                    variant={isPopular ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      isPopular ? "bg-primary hover:bg-primary/90" : "hover:bg-accent"
                    )}
                    onClick={() => handleOpenDialog(tier)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Configuration
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card text-foreground border-border shadow-2xl">
          <DialogHeader className="p-6 pb-4 bg-secondary/10 border-b border-border/50">
            <DialogTitle className="flex items-center gap-2 text-xl">
              {editingTier ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {editingTier ? "Edit Tier Configuration" : "Create New Tier"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configure the pricing, limits, and included features for this subscription tier.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-8">
            {/* Section 1: Basic Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>Basic Information</span>
              </div>
              <div className="grid grid-cols-2 gap-6 p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-sm font-medium">Tier Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Starter"
                    className="bg-background h-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="price" className="text-sm font-medium">Monthly Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">R</span>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="999"
                      className="bg-background pl-8 h-10 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Limits */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                <Settings className="w-4 h-4" />
                <span>Usage Limits</span>
              </div>
              <div className="grid grid-cols-2 gap-6 p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="space-y-2.5">
                  <Label htmlFor="maxUsers" className="text-sm font-medium">Max Users</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                    placeholder="e.g. 5"
                    className="bg-background h-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground font-medium">Enter 999 for unlimited users</p>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="maxCars" className="text-sm font-medium">Max Cars</Label>
                  <Input
                    id="maxCars"
                    type="number"
                    value={formData.maxCars}
                    onChange={(e) => setFormData({ ...formData, maxCars: e.target.value })}
                    placeholder="e.g. 50"
                    className="bg-background h-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground font-medium">Inventory vehicle limit</p>
                </div>
              </div>
            </section>

            {/* Section 3: Features */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Feature Set</span>
                </div>
                <Badge variant="secondary" className="font-normal">
                  {formData.features.length} selected
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockFeatures.map((feature) => {
                  const isSelected = formData.features.includes(feature.id);
                  return (
                    <div 
                      key={feature.id} 
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "cursor-pointer flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 select-none",
                        isSelected 
                          ? "bg-primary/5 border-primary/50 shadow-sm ring-1 ring-primary/20" 
                          : "bg-background border-border/50 hover:bg-secondary/50 hover:border-border"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-200",
                        isSelected 
                          ? "bg-primary border-primary text-primary-foreground scale-100" 
                          : "border-muted-foreground/30 bg-background/50"
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn("text-sm font-medium transition-colors", isSelected ? "text-foreground" : "text-muted-foreground")}>
                            {feature.name}
                          </span>
                          {feature.isPremium && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-500/30 text-amber-600 bg-amber-500/5">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <DialogFooter className="p-6 border-t border-border/50 bg-secondary/5">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-background hover:text-foreground">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="min-w-[140px] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              {editingTier ? "Update Tier" : "Create Tier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TiersPage;

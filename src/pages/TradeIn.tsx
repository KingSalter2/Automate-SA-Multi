import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Car, 
  Calculator, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  User
} from "lucide-react";

const TradeIn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/50 text-primary bg-primary/10">
              Value Your Trade-In
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold">
              Get the Best Value for <span className="text-primary">Your Vehicle</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              At EB Motors, we offer a seamless trade-in process with competitive evaluations and instant offers.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: "Trade-in Estimator",
                desc: "Get an instant estimated value for your vehicle based on current market data."
              },
              {
                icon: Car,
                title: "Vehicle Evaluation",
                desc: "Professional physical inspection to give you the most accurate and competitive offer."
              },
              {
                icon: Building2,
                title: "Bank Integration",
                desc: "Optional seamless integration with major banks including Wesbank, MFC, and Absa."
              }
            ].map((feature, i) => (
              <Card key={i} className="text-center p-6 border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Form Section */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border shadow-lg">
              <CardHeader className="text-center pb-8 border-b border-border/50">
                <CardTitle className="text-2xl font-display font-bold">Request a Valuation</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Fill in your vehicle details below and we'll contact you with an offer.
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Vehicle Details */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    Vehicle Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input placeholder="e.g. 2019" />
                    </div>
                    <div className="space-y-2">
                      <Label>Make</Label>
                      <Input placeholder="e.g. BMW" />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input placeholder="e.g. 3 Series" />
                    </div>
                    <div className="space-y-2">
                      <Label>Mileage (km)</Label>
                      <Input placeholder="e.g. 45000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition / Additional Notes</Label>
                    <Textarea placeholder="Describe the condition, service history, and any extras..." className="h-24" />
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="font-bold text-lg flex items-center gap-2 mt-4">
                    <User className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input type="tel" placeholder="082 123 4567" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full text-lg h-12">
                    Submit Request <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bank Integration Logos */}
        <section className="container mx-auto px-4 mt-20 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
            Integrated with Trusted Financial Institutions
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wesbank_logo.svg/200px-Wesbank_logo.svg.png" alt="Wesbank" className="h-8 md:h-10 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Absa_Group_logo.svg/200px-Absa_Group_logo.svg.png" alt="Absa" className="h-8 md:h-10 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Nedbank_logo.svg/200px-Nedbank_logo.svg.png" alt="Nedbank" className="h-8 md:h-10 object-contain" />
            {/* MFC Placeholder or Text if logo not available easily */}
            <div className="h-8 md:h-10 flex items-center font-bold text-xl text-foreground/80">MFC</div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TradeIn;

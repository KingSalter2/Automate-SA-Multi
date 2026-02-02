import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Award, 
  Users, 
  ThumbsUp, 
  Wallet, 
  MapPin, 
  Calendar,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-car.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="EB Motors Showroom"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <Badge variant="outline" className="px-4 py-2 text-sm border-primary/50 text-primary bg-primary/10 backdrop-blur-md">
            Established 2002
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
            About <span className="text-primary">EB Motors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in premium automotive excellence for over two decades.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Our Journey & <span className="text-primary">Commitment</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                EB Motors was established in 2002 and we are situated in the heart of the NW Province and Sandton. 
                We specialise in the sale of Used and New Cars. Not only are we one of the most trusted dealerships 
                in the area, but we have also been privileged enough to have been able to enjoy a 20 year relationship 
                with some of our existing customers.
              </p>
              <p>
                Apart from our great deals, competitive prices and reliable stock, we also strive to ensure that our 
                customers enjoy the experience of purchasing their vehicles.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-bold text-foreground">Locations</p>
                  <p className="text-sm text-muted-foreground">NW Province & Sandton</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-bold text-foreground">Experience</p>
                  <p className="text-sm text-muted-foreground">20+ Years</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
            <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-display font-bold">Why Choose Us?</h3>
                <ul className="space-y-4">
                  {[
                    "Most trusted dealership in the area",
                    "Specialists in New & Used Cars",
                    "Competitive prices & reliable stock",
                    "Customer-focused buying experience"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Award className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">The EB Motors Difference</h2>
            <p className="text-muted-foreground">
              At EB Motors, we understand that purchasing a vehicle might be one of the biggest purchases 
              that you as a customer will make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Expert Staff",
                description: "Our staff are the most competent in their field and understand the market to find you the perfect vehicle."
              },
              {
                icon: Wallet,
                title: "Suits Your Wallet",
                description: "We are dedicated to finding a vehicle that not only suits your needs but also fits your budget perfectly."
              },
              {
                icon: ThumbsUp,
                title: "Peace of Mind",
                description: "We understand purchasing a vehicle can be daunting, which is why we guide you through every step."
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors group">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-card to-card/50 border border-border rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Ready to find your dream car?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive vehicle selection of premium vehicles or visit one of our branches today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/vehicles">
                  View Vehicles <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/finance">
                  Finance Calculator
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;

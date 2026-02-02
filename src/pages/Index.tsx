import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { FinanceCalculator } from '@/components/finance/FinanceCalculator';
import { mockVehicles } from '@/data/mockVehicles';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Clock, 
  Award,
  Car,
  Wallet,
  FileCheck,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const featuredVehicles = mockVehicles.slice(0, 4);
  const specialVehicles = mockVehicles.filter(v => v.originalPrice && v.originalPrice > v.price);

  const handleSearch = () => {
    navigate(`/vehicles?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury car in showroom"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/50 text-primary bg-primary/10">
              Established in 2002
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight animate-slide-up">
              Find Your Perfect
              <span className="block text-primary">Dream Vehicle</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover premium pre-owned and new vehicles. 
              Trusted by thousands of happy customers across South Africa.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-glass border border-border/50 backdrop-blur-xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by make, model..."
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button variant="hero" size="xl" className="gap-2" onClick={handleSearch}>
                  Search Vehicles
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {[
                { value: '500+', label: 'Vehicles in Stock' },
                { value: '20+', label: 'Years Experience' },
                { value: '10k+', label: 'Happy Customers' },
                { value: '2', label: 'Prime Locations' },
              ].map((stat, i) => (
                <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                  <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-8 h-12 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">Browse by Body Type</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'SUV', icon: Car },
              { name: 'Sedan', icon: Car },
              { name: 'Hatchback', icon: Car },
              { name: 'Bakkie', icon: Car },
              { name: 'Coupe', icon: Car },
              { name: 'Convertible', icon: Car },
              { name: 'Bus', icon: Car },
              { name: 'Cabriolet', icon: Car },
              { name: 'Crossover', icon: Car },
              { name: 'Double Cab', icon: Car },
              { name: 'Drop', icon: Car },
              { name: 'Extended Cab', icon: Car },
              { name: 'MVP', icon: Car },
              { name: 'Single Cab', icon: Car },
              { name: 'Station Wagon', icon: Car },
            ].map((type, i) => (
              <Link 
                key={i} 
                to={`/vehicles?type=${encodeURIComponent(type.name)}`}
                className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-2.5 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <type.icon className="h-4 w-4" />
                </span>
                <span className="whitespace-nowrap text-sm font-semibold text-foreground">{type.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <Badge variant="outline" className="mb-3">Featured</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Latest Arrivals</h2>
              <p className="text-muted-foreground mt-2">Fresh stock added to our showroom</p>
            </div>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/vehicles">
                View All Vehicles
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary">Why EB Motors</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              The EB Motors Difference
            </h2>
            <p className="text-muted-foreground mt-4">
              We're committed to making your car buying experience exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Quality Assured', desc: '150-point inspection on every vehicle', color: 'primary' },
              { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive pricing with price match guarantee', color: 'accent' },
              { icon: Clock, title: 'Fast Approval', desc: 'Finance decisions in under 30 minutes', color: 'success' },
              { icon: Award, title: 'Warranty Included', desc: 'Comprehensive warranty on all vehicles', color: 'primary' },
            ].map((feature, i) => (
              <Card key={i} variant="feature" className="p-6 text-center group hover:shadow-glow transition-shadow duration-500">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {specialVehicles.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-3 text-accent border-accent">Hot Deals</Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Special Offers</h2>
                <p className="text-muted-foreground mt-2">Limited time savings on selected vehicles</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Finance Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Flexible Finance</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Get Pre-Approved
                <span className="block text-gradient-primary">In Minutes</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We work with all major South African banks to get you the best finance rates. 
                Our finance specialists will find a solution that works for your budget.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: Car, text: 'New & Used Vehicle Finance' },
                  { icon: Wallet, text: 'Competitive Interest Rates' },
                  { icon: FileCheck, text: 'Quick Online Applications' },
                  { icon: MessageCircle, text: 'Dedicated Finance Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wesbank_logo.svg/200px-Wesbank_logo.svg.png" alt="Wesbank" className="h-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Absa_Group_logo.svg/200px-Absa_Group_logo.svg.png" alt="Absa" className="h-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Nedbank_logo.svg/200px-Nedbank_logo.svg.png" alt="Nedbank" className="h-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
              </div>
            </div>

            <FinanceCalculator />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-accent-foreground">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Ready to Find Your Next Vehicle?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Visit one of our branches or browse our online vehicles. 
              Our team is ready to help you drive away in your dream car.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="xl">
                <Link to="/vehicles">Browse Vehicles</Link>
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="bg-transparent text-accent-foreground border-accent-foreground/30 hover:bg-accent-foreground/10"
              >
                Book Test Drive
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

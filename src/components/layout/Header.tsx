import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Phone, Menu, X, Calculator, Heart, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/vehicles', label: 'Vehicles' },
    { href: '/finance', label: 'Finance' },
    { href: '/trade-in', label: 'Trade-In' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-display text-foreground">EB</span>
              <span className="text-xl font-bold font-display text-gradient-primary">Motors</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calculator className="w-4 h-4" />
              Finance Calculator
            </Button>
            <Button variant="hero" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              087 008 2062
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 animate-slide-up">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/50 space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Calculator className="w-4 h-4" />
                Finance Calculator
              </Button>
              <Button variant="hero" className="w-full gap-2">
                <Phone className="w-4 h-4" />
                011 123 4567
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

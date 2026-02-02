import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-foreground">EB</span>
                <span className="text-xl font-bold font-display text-gradient-primary">Motors</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner in premium automotive excellence. 
              Serving the NW Province and Sandton since 2002.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Vehicles', href: '/vehicles' },
                { label: 'About Us', href: '/about' },
                { label: 'Finance Calculator', href: '/finance' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Portal', href: '/portal' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Address</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">126 Rivonia Road</p>
                  <p className="text-xs text-muted-foreground">Sandton</p>
                  <p className="text-xs text-muted-foreground">Johannesburg</p>
                  <p className="text-xs text-muted-foreground">Gauteng</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call Us</p>
                  <p className="text-sm font-medium">087 008 2062</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Us</p>
                  <p className="text-sm font-medium">sales@ebmotors.co.za</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-gradient-card border border-border/50">
              <p className="text-sm font-medium text-foreground">Trading Hours</p>
              <p className="text-xs text-muted-foreground mt-1">Mon - Fri: 8:00 - 17:30</p>
              <p className="text-xs text-muted-foreground">Sat: 8:00 - 13:00</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 EB Motors. All rights reserved. | Registered Motor Dealer
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Built by <a href="https://www.rabbit365.co.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Rabbit 365</a>
            </p>
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'POPIA Compliance'].map((link) => (
              <Link key={link} to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

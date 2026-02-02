import { Vehicle } from '@/types/vehicle';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Fuel, Gauge, Calendar, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
}

export function VehicleCard({ vehicle, viewMode = 'grid' }: VehicleCardProps) {
  const buildPublicImageUrl = (value: string | undefined) => {
    if (!value) return "/placeholder.svg";
    const trimmed = value.trim();
    if (!trimmed) return "/placeholder.svg";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const base = (import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_R2_PUBLIC_BASE_URL;
    const baseUrl = typeof base === "string" ? base.trim() : "";
    if (!baseUrl) return trimmed;
    return `${baseUrl.replace(/\/+$/, "")}/${trimmed.replace(/^\/+/, "")}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-ZA').format(mileage) + ' km';
  };

  const getConditionBadge = () => {
    switch (vehicle.condition) {
      case 'New':
        return <Badge variant="new">New</Badge>;
      case 'Demo':
        return <Badge variant="demo">Demo</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (vehicle.status) {
      case 'reserved':
        return <Badge variant="reserved">Reserved</Badge>;
      case 'sold':
        return <Badge variant="sold">Sold</Badge>;
      default:
        return null;
    }
  };

  const vehicleImage = buildPublicImageUrl(vehicle.images[0]);

  if (viewMode === 'list') {
    return (
      <Card variant="vehicle" className="group overflow-hidden flex flex-col md:flex-row h-full md:h-64 transition-all duration-300 hover:border-primary/50">
        {/* Image Container */}
        <Link to={`/vehicle/${vehicle.id}`} className="relative w-full md:w-80 shrink-0 overflow-hidden bg-secondary">
          <img
            src={vehicleImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {getConditionBadge()}
            {getStatusBadge()}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between relative">
           {/* Actions (Floating) */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex justify-between items-start pr-20">
              <div>
                <h3 className="font-display font-bold text-xl text-foreground leading-tight mb-1">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.variant && (
                  <p className="text-sm text-muted-foreground">{vehicle.variant}</p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="w-4 h-4 text-primary" />
                <span>{formatMileage(vehicle.mileage)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings2 className="w-4 h-4 text-primary" />
                <span>{vehicle.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Fuel className="w-4 h-4 text-primary" />
                <span>{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{vehicle.year}</span>
              </div>
            </div>
            
            {/* Features (limited) */}
            <div className="flex flex-wrap gap-2 mt-4">
              {vehicle.features.slice(0, 4).map((feature) => (
                <span key={feature} className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mt-4 md:mt-0 pt-4 border-t border-border/50 md:border-none md:pt-0">
            <div>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(vehicle.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold font-display text-primary">
                  {formatPrice(vehicle.price)}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:inline-block">
                  or {Math.round(vehicle.price / 72).toLocaleString()}/pm
                </p>
              </div>
            </div>
            
            <Link to={`/vehicle/${vehicle.id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="vehicle" className="group overflow-hidden relative">
      {/* Image Container */}
      <Link to={`/vehicle/${vehicle.id}`} className="block relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={vehicleImage}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {getConditionBadge()}
          {getStatusBadge()}
          {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
            <Badge variant="destructive">Special</Badge>
          )}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 pt-12">
          <div className="flex items-end justify-between">
            <div>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(vehicle.originalPrice)}
                </p>
              )}
              <p className="text-2xl font-bold font-display text-foreground">
                {formatPrice(vehicle.price)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              or from R{Math.round(vehicle.price / 72).toLocaleString()}/pm
            </p>
          </div>
        </div>
      </Link>

      {/* Actions (Floating) */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
        <button className="w-9 h-9 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div>
          <h3 className="font-display font-bold text-lg text-foreground leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.variant && (
            <p className="text-sm text-muted-foreground">{vehicle.variant}</p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="w-4 h-4 text-primary" />
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings2 className="w-4 h-4 text-primary" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="w-4 h-4 text-primary" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{vehicle.year}</span>
          </div>
        </div>

        {/* Features */}
        {vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {vehicle.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
              >
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-md bg-secondary text-primary font-medium">
                +{vehicle.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2">
          <Link to={`/vehicle/${vehicle.id}`} className="block w-full">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

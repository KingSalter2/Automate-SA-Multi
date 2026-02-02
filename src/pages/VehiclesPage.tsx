import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { SearchFilterBar } from '@/components/vehicles/SearchFilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchFilters, Vehicle } from '@/types/vehicle';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const VehiclesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const toNumber = (v: unknown) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v);
    return 0;
  };

  const toOptionalNumber = (v: unknown) => {
    if (v == null) return undefined;
    const n = toNumber(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const toStringArray = (v: unknown) => {
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string");
  };

  const toDate = (v: unknown) => {
    if (!v) return new Date();
    const d = new Date(typeof v === "string" || typeof v === "number" ? v : String(v));
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };

  const fromApiVehicle = (raw: Record<string, unknown>): Vehicle => ({
    id: String(raw.id ?? ""),
    make: String(raw.make ?? ""),
    model: String(raw.model ?? ""),
    variant: raw.variant ? String(raw.variant) : undefined,
    year: toNumber(raw.year),
    price: toNumber(raw.price),
    originalPrice: toOptionalNumber(raw.originalPrice),
    mileage: toNumber(raw.mileage),
    fuelType: String(raw.fuelType ?? "Petrol") as Vehicle["fuelType"],
    transmission: String(raw.transmission ?? "Automatic") as Vehicle["transmission"],
    bodyType: String(raw.bodyType ?? "Sedan") as Vehicle["bodyType"],
    condition: String(raw.condition ?? "Used") as Vehicle["condition"],
    drive: raw.drive ? (String(raw.drive) as NonNullable<Vehicle["drive"]>) : undefined,
    seats: raw.seats == null ? undefined : toNumber(raw.seats),
    color: String(raw.color ?? ""),
    engineSize: raw.engineSize ? String(raw.engineSize) : undefined,
    images: toStringArray(raw.images),
    features: toStringArray(raw.features),
    isSpecialOffer: typeof raw.isSpecialOffer === "boolean" ? raw.isSpecialOffer : undefined,
    estMonthlyPayment: toOptionalNumber(raw.estMonthlyPayment),
    status: String(raw.status ?? "draft") as Vehicle["status"],
    vin: raw.vin ? String(raw.vin) : undefined,
    engineNumber: raw.engineNumber ? String(raw.engineNumber) : undefined,
    registrationNumber: raw.registrationNumber ? String(raw.registrationNumber) : undefined,
    stockNumber: String(raw.stockNumber ?? ""),
    costPrice: toOptionalNumber(raw.costPrice),
    reconditioningCost: toOptionalNumber(raw.reconditioningCost),
    natisNumber: raw.natisNumber ? String(raw.natisNumber) : undefined,
    previousOwner: raw.previousOwner ? String(raw.previousOwner) : undefined,
    keyNumber: raw.keyNumber ? String(raw.keyNumber) : undefined,
    supplier: raw.supplier ? String(raw.supplier) : undefined,
    purchaseDate: raw.purchaseDate ? toDate(raw.purchaseDate) : undefined,
    branch: String(raw.branch ?? ""),
    description: raw.description ? String(raw.description) : undefined,
    serviceHistory: typeof raw.serviceHistory === "boolean" ? raw.serviceHistory : undefined,
    warrantyMonths: raw.warrantyMonths == null ? undefined : toNumber(raw.warrantyMonths),
    createdAt: toDate(raw.createdAt),
  });

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles-public"],
    queryFn: async () => {
      const res = await fetch("/.netlify/functions/vehicles-public");
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to load vehicles");
      }
      const data = (await res.json()) as { vehicles: Array<Record<string, unknown>> };
      return data.vehicles.map(fromApiVehicle);
    },
  });

  const vehicles = vehiclesQuery.data ?? [];

  // Initialize filters from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    
    if (search || type) {
      setFilters(prev => ({
        ...prev,
        search: search || undefined,
        bodyType: type || undefined
      }));
    }
  }, [searchParams]);

  const makeOptions = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.make).filter((x) => x.trim().length > 0));
    return Array.from(set).sort();
  }, [vehicles]);

  const bodyTypeOptions = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.bodyType).filter((x) => typeof x === "string" && x.trim().length > 0));
    return Array.from(set).sort();
  }, [vehicles]);

  const fuelTypeOptions = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.fuelType).filter((x) => typeof x === "string" && x.trim().length > 0));
    return Array.from(set).sort();
  }, [vehicles]);

  const transmissionOptions = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.transmission).filter((x) => typeof x === "string" && x.trim().length > 0));
    return Array.from(set).sort();
  }, [vehicles]);

  const conditionOptions = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.condition).filter((x) => typeof x === "string" && x.trim().length > 0));
    return Array.from(set).sort();
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter(v => v.status === 'available');

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(v => 
        v.make.toLowerCase().includes(searchTerm) || 
        v.model.toLowerCase().includes(searchTerm) ||
        (v.variant && v.variant.toLowerCase().includes(searchTerm))
      );
    }
    if (filters.make) {
      result = result.filter(v => v.make === filters.make);
    }
    if (filters.bodyType) {
      result = result.filter(v => v.bodyType === filters.bodyType);
    }
    if (filters.fuelType) {
      result = result.filter(v => v.fuelType === filters.fuelType);
    }
    if (filters.transmission) {
      result = result.filter(v => v.transmission === filters.transmission);
    }
    if (filters.condition) {
      result = result.filter(v => v.condition === filters.condition);
    }
    if (filters.branch) {
      result = result.filter(v => v.branch === filters.branch);
    }
    if (filters.minPrice) {
      result = result.filter(v => v.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter(v => v.price <= filters.maxPrice!);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'mileage':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'year':
        result.sort((a, b) => b.year - a.year);
        break;
      default:
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return result;
  }, [vehicles, filters, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <Badge variant="outline" className="mb-3">Vehicles</Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Browse Our Vehicles
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore our selection of quality pre-owned and new vehicles
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8">
            <SearchFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              makes={makeOptions}
              bodyTypes={bodyTypeOptions}
              fuelTypes={fuelTypeOptions}
              transmissions={transmissionOptions}
              conditions={conditionOptions}
            />
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{vehiclesQuery.isLoading ? "…" : filteredVehicles.length}</span> vehicles
            </p>
            
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-4 rounded-lg border border-border bg-secondary/50 text-foreground text-sm focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Lowest Mileage</option>
                <option value="year">Year: Newest</option>
              </select>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {vehiclesQuery.isLoading ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Loading vehicles…</p>
            </div>
          ) : vehiclesQuery.isError ? (
            <div className="py-20 text-center">
              <h3 className="text-xl font-display font-bold mb-2">Could not load vehicles</h3>
              <p className="text-muted-foreground mb-6">
                {vehiclesQuery.error instanceof Error ? vehiclesQuery.error.message : "Please try again later."}
              </p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <SlidersHorizontal className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to see more results
              </p>
              <Button variant="outline" onClick={() => setFilters({})}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehiclesPage;

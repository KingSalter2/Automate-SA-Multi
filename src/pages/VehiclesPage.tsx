import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { SearchFilterBar } from '@/components/vehicles/SearchFilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockVehicles } from '@/data/mockVehicles';
import { SearchFilters } from '@/types/vehicle';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';

const VehiclesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

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

  const filteredVehicles = useMemo(() => {
    let result = mockVehicles.filter(v => v.status === 'available');

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
        // newest - by creation date
        break;
    }

    return result;
  }, [filters, sortBy]);

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
            <SearchFilterBar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> vehicles
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
          {filteredVehicles.length > 0 ? (
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

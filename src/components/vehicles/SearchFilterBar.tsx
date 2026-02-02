import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { SearchFilters } from '@/types/vehicle';

interface SearchFilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  makes?: string[];
  bodyTypes?: string[];
  fuelTypes?: string[];
  transmissions?: string[];
  conditions?: string[];
}

export function SearchFilterBar({
  filters,
  onFiltersChange,
  makes = [],
  bodyTypes = [],
  fuelTypes = [],
  transmissions = [],
  conditions = [],
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleSearch = () => {
    // Search is already updated via filters.search
  };

  const priceRanges = [
    { label: 'Under R300k', max: 300000 },
    { label: 'R300k - R500k', min: 300000, max: 500000 },
    { label: 'R500k - R800k', min: 500000, max: 800000 },
    { label: 'R800k - R1.2M', min: 800000, max: 1200000 },
    { label: 'Over R1.2M', min: 1200000 },
  ];

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, or keyword..."
            className="pl-12 h-14 text-base"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
          />
        </div>
        <div className="flex gap-3">
          <Button
            size="lg"
            className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={() => {}} // Search is live, but button provides visual feedback/action
          >
            Search
          </Button>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="lg"
            className="gap-2 h-14 px-6"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {makes.slice(0, 6).map((make) => {
          const isActive = filters.make === make;
          return (
            <button
              key={make}
              onClick={() => updateFilter('make', isActive ? undefined : make)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              {make}
            </button>
          );
        })}
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">Filter Vehicles</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Make */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Make</label>
              <select
                value={filters.make || ''}
                onChange={(e) => updateFilter('make', e.target.value || undefined)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">All Makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Body Type</label>
              <select
                value={filters.bodyType || ''}
                onChange={(e) => updateFilter('bodyType', e.target.value || undefined)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">All Types</option>
                {bodyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fuel Type</label>
              <select
                value={filters.fuelType || ''}
                onChange={(e) => updateFilter('fuelType', e.target.value || undefined)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">All Fuel Types</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Transmission</label>
              <select
                value={filters.transmission || ''}
                onChange={(e) => updateFilter('transmission', e.target.value || undefined)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">All</option>
                {transmissions.map((trans) => (
                  <option key={trans} value={trans}>{trans}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Condition</label>
              <select
                value={filters.condition || ''}
                onChange={(e) => updateFilter('condition', e.target.value || undefined)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">All Conditions</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Price Range</label>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => {
                const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => {
                      if (isActive) {
                        onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
                      } else {
                        onFiltersChange({ ...filters, minPrice: range.min, maxPrice: range.max });
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="hero" size="lg" onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

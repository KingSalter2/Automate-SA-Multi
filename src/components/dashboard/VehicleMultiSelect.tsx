import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { mockVehicles } from "@/data/mockVehicles";

interface VehicleMultiSelectProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

export function VehicleMultiSelect({
  selectedIds = [],
  onChange,
  className,
}: VehicleMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedVehicles = selectedIds.map((id) =>
    mockVehicles.find((v) => v.id === id)
  ).filter(Boolean);

  const handleSelect = (vehicleId: string) => {
    if (selectedIds.includes(vehicleId)) {
      onChange(selectedIds.filter((id) => id !== vehicleId));
    } else {
      onChange([...selectedIds, vehicleId]);
    }
  };

  const handleRemove = (e: React.MouseEvent, vehicleId: string) => {
    e.stopPropagation();
    onChange(selectedIds.filter((id) => id !== vehicleId));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[10px] py-2"
          >
            <span className="truncate text-muted-foreground font-normal">
              {selectedIds.length > 0
                ? `${selectedIds.length} vehicle(s) selected`
                : "Select vehicles..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search vehicles..." />
            <CommandList>
              <CommandEmpty>No vehicle found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {mockVehicles.map((vehicle) => (
                  <CommandItem
                    key={vehicle.id}
                    value={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.id}`}
                    onSelect={() => handleSelect(vehicle.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(vehicle.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {vehicle.variant} • R{vehicle.price.toLocaleString()}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedVehicles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedVehicles.map((vehicle) => (
            <Badge key={vehicle?.id} variant="secondary" className="flex items-center gap-1 p-2">
              <div className="flex flex-col text-left">
                <span className="font-semibold">
                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                </span>
                <span className="text-xs text-muted-foreground">
                  R{vehicle?.price.toLocaleString()}
                </span>
              </div>
              <button
                className="ml-2 rounded-full hover:bg-muted p-0.5"
                onClick={(e) => handleRemove(e, vehicle!.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

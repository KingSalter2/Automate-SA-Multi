
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types/vehicle";
import { MoreHorizontal, Pencil, Trash, Eye, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { differenceInDays } from "date-fns";

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onPreview: (vehicle: Vehicle) => void;
}

export function VehicleList({ vehicles, onEdit, onDelete, onPreview }: VehicleListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

  const getStockAgeColor = (date: Date) => {
    const days = differenceInDays(new Date(), new Date(date));
    if (days > 90) return "bg-red-900 text-white animate-pulse";
    if (days > 60) return "bg-red-500 text-white";
    if (days > 30) return "bg-orange-500 text-white";
    return "bg-green-500 text-white";
  };

  const getStatusBadge = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-600">Available</Badge>;
      case 'reserved':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Reserved</Badge>;
      case 'sold':
        return <Badge variant="destructive">Sold</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Vehicle Details</TableHead>
            <TableHead>Stock #</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No vehicles found.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow 
                key={vehicle.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  if (onPreview) onPreview(vehicle);
                }}
              >
                <TableCell>
                  <div 
                    className="w-16 h-12 rounded overflow-hidden bg-muted relative cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPreview) onPreview(vehicle);
                    }}
                    title="Click to view details"
                  >
                    {vehicle.images.length > 0 ? (
                      <img
                        src={buildPublicImageUrl(vehicle.images[0])}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Car className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-0 left-0 flex flex-col gap-1 p-1">
                      {vehicle.condition === 'New' && (
                          <Badge className="bg-blue-600 rounded-sm text-[10px] px-1 h-4">New</Badge>
                      )}
                      {vehicle.isSpecialOffer && (
                          <Badge className="bg-red-600 rounded-sm text-[10px] px-1 h-4">Offer</Badge>
                      )}
                      {vehicle.condition === 'Demo' && (
                          <Badge className="bg-orange-500 rounded-sm text-[10px] px-1 h-4">Demo</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {vehicle.variant} • {vehicle.mileage.toLocaleString()} km
                    </span>
                  </div>
                </TableCell>
                <TableCell>{vehicle.stockNumber}</TableCell>
                <TableCell>
                  <Badge className={getStockAgeColor(vehicle.createdAt)}>
                    {differenceInDays(new Date(), new Date(vehicle.createdAt))} Days
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{formatCurrency(vehicle.price)}</span>
                    {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                       <span className="text-xs text-muted-foreground line-through">
                         {formatCurrency(vehicle.originalPrice)}
                       </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      {vehicle.status !== 'draft' && (
                        <Link to={`/vehicle/${vehicle.id}`} target="_blank">
                          <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Public Page
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(vehicle.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Vehicle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

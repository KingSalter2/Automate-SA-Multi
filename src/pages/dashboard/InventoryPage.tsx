import { useState, useMemo, useRef } from "react";
import { Plus, Download, ScanLine, Camera, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleList } from "@/components/dashboard/inventory/VehicleList";
import { VehicleFormDialog } from "@/components/dashboard/inventory/VehicleFormDialog";
import { VehiclePreviewDialog } from "@/components/dashboard/inventory/VehiclePreviewDialog";
import { Vehicle } from "@/types/vehicle";
import { useToast } from "@/components/ui/use-toast";
import { scanLicenseDisc, scanFromCamera } from "@/services/ocr";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadCSV } from "@/utils/exportUtils";
import { differenceInDays } from "date-fns";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const { getIdToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewVehicle, setPreviewVehicle] = useState<Partial<Vehicle> | null>(null);
  
  // Filter state
  const [activeTab, setActiveTab] = useState("all");
  const [filterMake, setFilterMake] = useState("all");
  const [filterModel, setFilterModel] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  const { toast } = useToast();

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

  const fromApiVehicle = (raw: Record<string, unknown>): Vehicle => {
    const purchaseDate = raw.purchaseDate ? toDate(raw.purchaseDate) : undefined;
    return {
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
      purchaseDate,
      branch: String(raw.branch ?? ""),
      description: raw.description ? String(raw.description) : undefined,
      serviceHistory: typeof raw.serviceHistory === "boolean" ? raw.serviceHistory : undefined,
      warrantyMonths: raw.warrantyMonths == null ? undefined : toNumber(raw.warrantyMonths),
      createdAt: toDate(raw.createdAt),
    };
  };

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles-admin"],
    queryFn: async () => {
      const token = await getIdToken();
      if (!token) throw new Error("Not signed in");

      const res = await fetch("/.netlify/functions/vehicles-admin", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to load vehicles");
      }
      const data = (await res.json()) as { vehicles: Array<Record<string, unknown>> };
      return data.vehicles.map(fromApiVehicle);
    },
  });

  const upsertVehicleMutation = useMutation({
    mutationFn: async (payload: Partial<Vehicle>) => {
      const token = await getIdToken();
      if (!token) throw new Error("Not signed in");

      const res = await fetch("/.netlify/functions/vehicles-admin", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save vehicle");
      }
      const data = (await res.json()) as { vehicle: Record<string, unknown> };
      return fromApiVehicle(data.vehicle);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vehicles-admin"] });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getIdToken();
      if (!token) throw new Error("Not signed in");

      const res = await fetch(`/.netlify/functions/vehicles-admin?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) {
        const msg = await res.text();
        throw new Error(msg || "Failed to delete vehicle");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vehicles-admin"] });
    },
  });

  const vehicles = vehiclesQuery.data ?? [];

  const uniqueMakes = useMemo(() => {
    const makes = new Set(vehicles.map((v) => v.make).filter((m) => m.trim().length > 0));
    return Array.from(makes).sort();
  }, [vehicles]);

  const uniqueModels = useMemo(() => {
    const relevantVehicles = filterMake === "all" ? vehicles : vehicles.filter(v => v.make === filterMake);
    const models = new Set(relevantVehicles.map(v => v.model));
    return Array.from(models).sort();
  }, [vehicles, filterMake]);

  const uniqueYears = useMemo(() => {
    const years = new Set(vehicles.map(v => v.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        vehicle.make.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.stockNumber.toLowerCase().includes(searchLower) ||
        vehicle.vin?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Tab filter
      if (activeTab === "available" && vehicle.status !== "available") return false;
      if (activeTab === "draft" && vehicle.status !== "draft") return false;
      if (activeTab === "sold" && vehicle.status !== "sold") return false;
      
      // Make filter
      if (filterMake !== "all" && vehicle.make !== filterMake) return false;

      // Model filter
      if (filterModel !== "all" && vehicle.model !== filterModel) return false;

      // Year filter
      if (filterYear !== "all" && vehicle.year.toString() !== filterYear) return false;

      // Age filter
      if (filterAge !== "all") {
        const days = differenceInDays(new Date(), new Date(vehicle.createdAt));
        if (filterAge === "0-30" && days > 30) return false;
        if (filterAge === "31-60" && (days <= 30 || days > 60)) return false;
        if (filterAge === "61-90" && (days <= 60 || days > 90)) return false;
        if (filterAge === "90+" && days <= 90) return false;
      }

      return true;
    });
  }, [vehicles, searchQuery, activeTab, filterMake, filterModel, filterYear, filterAge]);

  const handleExport = (exportFormat: 'csv' | 'excel') => {
    const extension = exportFormat === 'excel' ? 'xls' : 'csv';
    const dataToExport = filteredVehicles.map(v => ({
      StockNumber: v.stockNumber,
      Make: v.make,
      Model: v.model,
      Year: v.year,
      Price: v.price,
      Status: v.status,
      DaysInStock: differenceInDays(new Date(), new Date(v.createdAt)),
      Color: v.color,
      Mileage: v.mileage
    }));
    
    downloadCSV(dataToExport, 'inventory_report', extension);
  };

  const handleAddVehicle = async (data: Partial<Vehicle>) => {
    try {
      const saved = await upsertVehicleMutation.mutateAsync(data);
      toast({
        title: saved.status === "draft" ? "Draft Saved" : "Vehicle Added",
        description: `${saved.year} ${saved.make} ${saved.model} has been ${saved.status === "draft" ? "saved as draft" : "added to inventory"}.`,
      });
    } catch (e: unknown) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Could not save vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVehicle = async (data: Partial<Vehicle>) => {
    if (!editingVehicle) return;
    try {
      await upsertVehicleMutation.mutateAsync({ ...editingVehicle, ...data });
      setEditingVehicle(null);
      toast({
        title: "Vehicle Updated",
        description: "Vehicle details have been successfully updated.",
      });
    } catch (e: unknown) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Could not update vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
      deleteVehicleMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Vehicle Deleted",
            description: "The vehicle has been removed from inventory.",
            variant: "destructive",
          });
        },
        onError: (e: unknown) => {
          toast({
            title: "Delete failed",
            description: e instanceof Error ? e.message : "Could not delete vehicle.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handlePreview = (data: Partial<Vehicle>) => {
    setPreviewVehicle(data);
    setIsPreviewOpen(true);
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  // Scanning Handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const result = await scanLicenseDisc(file);
      if (result.success && result.data) {
        setEditingVehicle(result.data as Vehicle);
        setIsScanOpen(false);
        setIsFormOpen(true);
        toast({
          title: "Scan Successful",
          description: "Vehicle details have been extracted from the license disc.",
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Could not extract data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during scanning.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCameraStart = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setIsCameraActive(false);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleCameraStop = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCameraCapture = async () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");
    
    handleCameraStop();
    setIsScanning(true);
    
    try {
      const result = await scanFromCamera(imageData);
      if (result.success && result.data) {
        setEditingVehicle(result.data as Vehicle);
        setIsScanOpen(false);
        setIsFormOpen(true);
        toast({
          title: "Scan Successful",
          description: "Vehicle details have been extracted.",
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Could not extract data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {vehiclesQuery.isLoading && (
        <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Loading vehicles...</div>
      )}
      {vehiclesQuery.isError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {vehiclesQuery.error instanceof Error ? vehiclesQuery.error.message : "Failed to load vehicles."}
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your vehicle stock, pricing, and details.
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
          <Button variant="secondary" onClick={() => setIsScanOpen(true)}>
            <ScanLine className="w-4 h-4 mr-2" />
            Scan Disc
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
             <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-[400px]">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Input
            placeholder="Search by make, model, or stock number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Select value={filterMake} onValueChange={(value) => {
            setFilterMake(value);
            setFilterModel("all");
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {uniqueMakes.map((make) => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {uniqueModels.map(model => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterAge} onValueChange={setFilterAge}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="0-30">0-30 days</SelectItem>
              <SelectItem value="31-60">31-60 days</SelectItem>
              <SelectItem value="61-90">61-90 days</SelectItem>
              <SelectItem value="90+">90+ days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <VehicleList
        vehicles={filteredVehicles}
        onEdit={openEditModal}
        onDelete={handleDeleteVehicle}
        onPreview={handlePreview}
      />

      <VehicleFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingVehicle(null);
        }}
        vehicle={editingVehicle}
        onSubmit={(data) => {
          if (editingVehicle?.id) {
            handleUpdateVehicle(data);
          } else {
            handleAddVehicle(data);
          }
        }}
        onPreview={handlePreview}
      />

      <VehiclePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        vehicle={previewVehicle}
      />

      <Dialog open={isScanOpen} onOpenChange={(open) => {
        setIsScanOpen(open);
        if (!open) handleCameraStop();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-primary" />
              Scan License Disc
            </DialogTitle>
            <DialogDescription>
              {isCameraActive 
                ? "Position the license disc within the frame." 
                : "Scan a vehicle license disc to auto-fill details."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Scanning license disc...</p>
              </div>
            ) : isCameraActive ? (
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => videoRef.current?.play()}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 border-2 border-white/50 rounded-lg"></div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <Button variant="secondary" onClick={handleCameraStop}>
                    Cancel
                  </Button>
                  <Button onClick={handleCameraCapture}>
                    Capture
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors text-center h-40"
                  onClick={handleCameraStart}
                >
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Use Camera</span>
                  <span className="text-xs text-muted-foreground">Take a photo</span>
                </div>
                
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors text-center h-40"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload Image</span>
                  <span className="text-xs text-muted-foreground">Select file</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          {!isCameraActive && !isScanning && (
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs flex items-start gap-2">
              <ScanLine className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                <strong>Pro Tip:</strong> Ensure the license disc is well-lit and fully visible. This feature will automatically extract VIN, Make, Model, and Year.
              </p>
            </div>
          )}

          {!isCameraActive && !isScanning && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScanOpen(false)}>Cancel</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

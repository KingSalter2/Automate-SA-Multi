
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Vehicle } from "@/types/vehicle";
import { Plus, X, Upload, Image as ImageIcon, Eye, Save, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Form Schema
const vehicleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  variant: z.string().optional(),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().optional(),
  estMonthlyPayment: z.coerce.number().optional(),
  mileage: z.coerce.number().min(0),
  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
  transmission: z.enum(['Manual', 'Automatic']),
  bodyType: z.enum(['Sedan', 'SUV', 'Hatchback', 'Bakkie', 'Coupe', 'Wagon', 'Van']),
  condition: z.enum(['New', 'Used', 'Demo']),
  drive: z.enum(['FWD', 'RWD', 'AWD', '4x4', '4x2']).optional(),
  seats: z.coerce.number().int().min(1).max(99),
  color: z.string().min(1, "Color is required"),
  engineSize: z.string().optional(),
  description: z.string().optional(),
  features: z.string(), // We'll parse this from comma-separated string
  images: z.array(z.string()).min(1, "At least one image is required"),
  status: z.enum(['available', 'reserved', 'sold', 'draft']),
  isSpecialOffer: z.boolean().optional(),
  branch: z.string().min(1, "Branch is required"),
  stockNumber: z.string().min(1, "Stock Number is required"),
  
  // Internal Fields
  vin: z.string().optional(),
  costPrice: z.coerce.number().optional(),
  reconditioningCost: z.coerce.number().optional(),
  natisNumber: z.string().optional(),
  previousOwner: z.string().optional(),
  keyNumber: z.string().optional(),
  supplier: z.string().optional(),
  purchaseDate: z.string().optional(), // Using string for date input
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSubmit: (data: Partial<Vehicle>) => void;
  onPreview?: (data: Partial<Vehicle>) => void;
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
  onPreview,
}: VehicleFormDialogProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: "",
      model: "",
      variant: "",
      year: new Date().getFullYear(),
      price: 0,
      originalPrice: 0,
      estMonthlyPayment: 0,
      mileage: 0,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "Sedan",
      condition: "Used",
      drive: "FWD",
      seats: 5,
      color: "",
      engineSize: "",
      description: "",
      features: "",
      images: [], 
      status: "available",
      isSpecialOffer: false,
      branch: "Main Branch",
      stockNumber: "",
      vin: "",
      costPrice: 0,
      reconditioningCost: 0,
      natisNumber: "",
      previousOwner: "",
      keyNumber: "",
      supplier: "",
      purchaseDate: "",
    },
  });

  useEffect(() => {
    if (vehicle) {
      form.reset({
        ...vehicle,
        features: vehicle.features.join(", "),
        images: vehicle.images.length > 0 ? vehicle.images : [],
        purchaseDate: vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toISOString().split('T')[0] : "",
        seats: vehicle.seats ?? 5,
      });
    } else {
      form.reset({
        make: "",
        model: "",
        variant: "",
        year: new Date().getFullYear(),
        price: 0,
        originalPrice: 0,
        estMonthlyPayment: 0,
        mileage: 0,
        fuelType: "Petrol",
        transmission: "Automatic",
        bodyType: "Sedan",
        condition: "Used",
        drive: "FWD",
        seats: 5,
        color: "",
        engineSize: "",
        description: "",
        features: "",
        images: [],
        status: "available",
        isSpecialOffer: false,
        branch: "Main Branch",
        stockNumber: "",
        vin: "",
        costPrice: 0,
        reconditioningCost: 0,
        natisNumber: "",
        previousOwner: "",
        keyNumber: "",
        supplier: "",
        purchaseDate: "",
      });
    }
  }, [vehicle, form, open]);

  const processSubmit = (data: VehicleFormValues, statusOverride?: 'draft' | 'available') => {
    const formattedData: Partial<Vehicle> = {
      ...data,
      features: data.features.split(",").map((f) => f.trim()).filter((f) => f.length > 0),
      images: data.images.filter((img) => img.length > 0),
      status: statusOverride || data.status,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
    };
    onSubmit(formattedData);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = [...form.getValues("images")];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result);
            form.setValue("images", newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
  };

  const handlePreview = () => {
    if (onPreview) {
      const data = form.getValues();
      const formattedData: Partial<Vehicle> = {
        ...data,
        features: data.features.split(",").map((f) => f.trim()).filter((f) => f.length > 0),
        images: data.images.filter((img) => img.length > 0),
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      };
      onPreview(formattedData);
    }
  };

  const setMainImage = (index: number) => {
    if (index === 0) return;
    const currentImages = form.getValues("images");
    const newImages = [...currentImages];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    form.setValue("images", newImages);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          <DialogDescription>
            {vehicle ? "Update vehicle details." : "Add a new vehicle to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="specs">Specs</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="internal">Internal</TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-4">
                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input placeholder="BMW, Toyota, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="3 Series, Hilux, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="variant"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant</FormLabel>
                            <FormControl>
                              <Input placeholder="320i M Sport" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Used">Used</SelectItem>
                                <SelectItem value="Demo">Demo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stockNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Specs Tab */}
                  <TabsContent value="specs" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mileage (km)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="transmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transmission</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fuel Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Petrol">Petrol</SelectItem>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                                <SelectItem value="Electric">Electric</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bodyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Body Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select body type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="Hatchback">Hatchback</SelectItem>
                                <SelectItem value="Bakkie">Bakkie</SelectItem>
                                <SelectItem value="Coupe">Coupe</SelectItem>
                                <SelectItem value="Wagon">Wagon</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="drive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drive</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select drive type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="FWD">FWD</SelectItem>
                                <SelectItem value="RWD">RWD</SelectItem>
                                <SelectItem value="AWD">AWD</SelectItem>
                                <SelectItem value="4x4">4x4</SelectItem>
                                <SelectItem value="4x2">4x2</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seats</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="engineSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Engine Size</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 2.0L Turbo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Pricing Tab */}
                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selling Price (R)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Was Price / Retail (R)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>Optional: Shows as strikethrough price</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="estMonthlyPayment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Est. Monthly Payment (R)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="isSpecialOffer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Special Offer
                            </FormLabel>
                            <FormDescription>
                              Mark this vehicle as a special offer.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Media & Details Tab */}
                  <TabsContent value="media" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description of the vehicle..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Features (Comma separated)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Sunroof, Leather Seats, Navigation, etc." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div>
                        <FormLabel>Images</FormLabel>
                        <FormDescription>
                          Upload images for the vehicle. <strong>The first image will be the main cover image shown on the website.</strong>
                        </FormDescription>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {form.watch("images").map((image, index) => (
                          <div key={index} className={cn(
                            "relative aspect-video rounded-lg overflow-hidden border bg-muted group transition-all",
                            index === 0 ? "ring-2 ring-primary ring-offset-2" : ""
                          )}>
                            <img src={image} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
                            
                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {index !== 0 && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-6 w-6 bg-white/80 hover:bg-white text-yellow-600"
                                  title="Make Main Image"
                                  onClick={() => setMainImage(index)}
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>

                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 fill-current" /> Main Image
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Upload Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden" 
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Internal Details Tab */}
                  <TabsContent value="internal" className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                      <p className="text-sm text-yellow-800">
                        These details are for internal use only and will not be visible on the public website.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VIN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Vehicle Identification Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="natisNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NaTIS Registration Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Registration Document Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost Price (R)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>Purchase price of the vehicle</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reconditioningCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reconditioning Cost (R)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>Total spent on repairs/prep</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier / Source</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Auction, Trade-in, Private" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="keyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Number / Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Key Tag or Box Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="previousOwner"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Owner</FormLabel>
                            <FormControl>
                              <Input placeholder="Name of previous owner" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </ScrollArea>
            
            <DialogFooter className="pt-4 border-t mt-4 flex justify-between items-center sm:justify-between">
               <div className="flex gap-2">
                 <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePreview}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
               </div>
               <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={form.handleSubmit((data) => processSubmit(data, 'draft'))}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button type="button" onClick={form.handleSubmit((data) => processSubmit(data))}>
                    {vehicle ? "Update Vehicle" : "Add Vehicle"}
                  </Button>
               </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

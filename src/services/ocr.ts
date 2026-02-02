import { Vehicle } from "@/types/vehicle";

export interface OCRResult {
  success: boolean;
  data?: Partial<Vehicle>;
  error?: string;
  confidence?: number;
}

export const scanLicenseDisc = async (file: File): Promise<OCRResult> => {
  // TODO: Replace with actual OCR API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  const isSuccess = Math.random() > 0.1;

  if (!isSuccess) {
    return {
      success: false,
      error: "Could not detect a valid license disc. Please try again with better lighting."
    };
  }

  // TODO: Replace with actual OCR backend response
  const mockExtractedData: Partial<Vehicle> = {
    make: "Toyota",
    model: "Hilux",
    year: 2023,
    color: "White",
    vin: "AHTK" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    engineNumber: "2GD" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    registrationNumber: "CA " + Math.floor(Math.random() * 999999),
    variant: "2.8 GD-6 Legend 4x4 Auto",
    fuelType: "Diesel",
    transmission: "Automatic",
    features: [],
    images: [],
    status: "available"
  };

  return {
    success: true,
    data: mockExtractedData,
    confidence: 0.98
  };
};

export const scanFromCamera = async (imageData: string): Promise<OCRResult> => {
  // TODO: Replace with actual OCR API call
  await new Promise(resolve => setTimeout(resolve, 2500));

  // TODO: Replace with actual OCR backend response
  const mockExtractedData: Partial<Vehicle> = {
    make: "Volkswagen",
    model: "Polo",
    year: 2022,
    color: "Silver",
    vin: "AAVZ" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    engineNumber: "CHZ" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    registrationNumber: "GP " + Math.floor(Math.random() * 999999),
    variant: "1.0 TSI Life",
    fuelType: "Petrol",
    transmission: "Manual",
    features: [],
    images: [],
    status: "available"
  };

  return {
    success: true,
    data: mockExtractedData,
    confidence: 0.95
  };
};

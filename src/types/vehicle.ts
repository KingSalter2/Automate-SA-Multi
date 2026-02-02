export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  bodyType: 'Sedan' | 'SUV' | 'Hatchback' | 'Bakkie' | 'Coupe' | 'Wagon' | 'Van';
  condition: 'New' | 'Used' | 'Demo';
  drive?: 'FWD' | 'RWD' | 'AWD' | '4x4' | '4x2';
  seats?: number;
  color: string;
  engineSize?: string;
  images: string[];
  features: string[];
  isSpecialOffer?: boolean;
  estMonthlyPayment?: number;
  status: 'available' | 'reserved' | 'sold' | 'draft';
  vin?: string;
  engineNumber?: string;
  registrationNumber?: string;
  stockNumber: string;
  
  // Internal/Admin only fields
  costPrice?: number;
  reconditioningCost?: number;
  natisNumber?: string;
  previousOwner?: string;
  keyNumber?: string;
  supplier?: string;
  purchaseDate?: Date;

  branch: string;
  description?: string;
  serviceHistory?: boolean;
  warrantyMonths?: number;
  createdAt: Date;
}

export interface SearchFilters {
  search?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  condition?: string;
  branch?: string;
}

export interface Lead {
  id: string;
  vehicleId?: string; // Deprecated, use vehicleIds
  vehicleIds?: string[];
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  source: 'website' | 'whatsapp' | 'phone' | 'walk-in' | 'cars.co.za' | 'autotrader' | 'facebook';
  status: 'new' | 'contacted' | 'test-drive' | 'finance' | 'negotiation' | 'sold' | 'lost' | 'rejected';
  assignedTo?: string;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  saleDetails?: {
    salePrice: number;
    paymentType: 'cash' | 'financed';
    bankName?: string;
    depositAmount?: number;
    financeTerm?: number; // months
    balloonPayment?: number;
    tradeIn?: {
      make: string;
      model: string;
      year: number;
      vin?: string;
      allowance: number;
      settlement?: number;
    };
    discountAmount: number;
    discountPercentage: number;
    discountReason?: string;
    soldDate: Date;
  };
  history?: LeadHistory[];
  documents?: LeadDocument[];
}

export interface LeadDocument {
  id: string;
  name: string;
  type: 'id' | 'license' | 'proof_of_res' | 'payslip' | 'bank_statement' | 'proof_of_employment' | 'finance_application' | 'contract' | 'otp' | 'sales_invoice' | 'other';
  url: string;
  uploadedAt: Date;
}

export interface LeadHistory {
  id: string;
  action: string;
  performedBy: string;
  role?: string; // e.g., 'Sales Executive', 'F&I Manager'
  details: string;
  date: Date;
}

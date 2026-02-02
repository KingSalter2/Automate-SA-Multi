import { Lead, Vehicle } from "@/types/vehicle";

export const mockSoldVehicles: Vehicle[] = [
  {
    id: 'sold-1',
    make: 'BMW',
    model: 'X3',
    variant: 'xDrive20d M Sport',
    year: 2023,
    price: 850000,
    mileage: 15000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'SUV',
    condition: 'Used',
    color: 'Phytonic Blue',
    engineSize: '2.0L Turbo Diesel',
    images: ['/placeholder.svg'],
    features: ['M Sport Package', 'Panoramic Sunroof', 'Towbar', 'Live Cockpit Professional'],
    status: 'sold',
    stockNumber: 'AV-S001',
    vin: 'WBA1234567890ABC',
    natisNumber: 'NATIS-987654321',
    costPrice: 780000,
    reconditioningCost: 5000,
    supplier: 'WeBuyCars',
    purchaseDate: new Date('2025-11-15'),
    keyNumber: 'KEY-001-A',
    previousOwner: 'Mr. J. Coetzee',
    branch: 'Sandton',
    serviceHistory: true,
    warrantyMonths: 24,
    createdAt: new Date('2025-11-20'),
  },
  {
    id: 'sold-2',
    make: 'Toyota',
    model: 'Fortuner',
    variant: '2.8 GD-6 VX',
    year: 2024,
    price: 920000,
    mileage: 5000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'SUV',
    condition: 'Demo',
    color: 'Glacier White',
    engineSize: '2.8L Turbo Diesel',
    images: ['/placeholder.svg'],
    features: ['JBL Sound System', 'Safety Sense', 'Heated Seats', '360 Camera'],
    status: 'sold',
    stockNumber: 'AV-S002',
    vin: 'AHT1234567890DEF',
    natisNumber: 'NATIS-123456789',
    costPrice: 850000,
    reconditioningCost: 2500,
    supplier: 'Toyota SA',
    purchaseDate: new Date('2026-01-10'),
    keyNumber: 'KEY-002-B',
    previousOwner: 'Demo Stock',
    branch: 'Pretoria',
    serviceHistory: true,
    warrantyMonths: 36,
    createdAt: new Date('2026-01-15'),
  }
];

export const mockSoldLeads: Lead[] = [
  {
    id: 'lead-sold-1',
    vehicleIds: ['sold-1'],
    customerName: 'Michael van der Merwe',
    email: 'mike.vdm@example.com',
    phone: '082 555 1234',
    source: 'website',
    status: 'sold',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
    assignedTo: 'Sarah Dealer',
    saleDetails: {
      salePrice: 850000,
      paymentType: 'financed',
      bankName: 'Wesbank',
      depositAmount: 50000,
      financeTerm: 72,
      balloonPayment: 127500, // 15%
      tradeIn: {
        make: 'Volkswagen',
        model: 'Tiguan',
        year: 2018,
        allowance: 320000,
        settlement: 280000
      },
      discountAmount: 10000,
      discountPercentage: 1.17,
      discountReason: 'Loyal Customer',
      soldDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) // 35 days ago
    },
    documents: [
      {
        id: 'doc5',
        name: 'Proof of Payment',
        type: 'bank_statement',
        url: '#',
        uploadedAt: new Date('2026-02-10T08:50:00')
      },
      {
        id: 'doc6',
        name: 'Offer to Purchase',
        type: 'otp',
        url: '#',
        uploadedAt: new Date('2026-02-10T09:30:00')
      },
      {
        id: 'doc7',
        name: 'Tax Invoice',
        type: 'sales_invoice',
        url: '#',
        uploadedAt: new Date('2026-02-10T09:35:00')
      },
      {
        id: 'doc8',
        name: 'Employment Confirmation',
        type: 'proof_of_employment',
        url: '#',
        uploadedAt: new Date('2026-02-09T14:20:00')
      }
    ],
    history: [
      {
        id: 'h1',
        action: 'Lead Created',
        performedBy: 'System',
        role: 'System',
        details: 'Lead captured from Website inquiry',
        date: new Date('2025-12-01T09:00:00')
      },
      {
        id: 'h2',
        action: 'Assigned',
        performedBy: 'Rameez Admin',
        role: 'Sales Manager',
        details: 'Assigned to Sarah Dealer',
        date: new Date('2025-12-01T09:30:00')
      },
      {
        id: 'h3',
        action: 'Test Drive',
        performedBy: 'Sarah Dealer',
        role: 'Sales Executive',
        details: 'Test drive conducted with client',
        date: new Date('2025-12-05T14:00:00')
      },
      {
        id: 'h4',
        action: 'Finance Application',
        performedBy: 'John F&I',
        role: 'F&I Manager',
        details: 'Application submitted to Wesbank and ABSA',
        date: new Date('2025-12-06T10:00:00')
      },
      {
        id: 'h5',
        action: 'Finance Approved',
        performedBy: 'John F&I',
        role: 'F&I Manager',
        details: 'Approved by Wesbank at 11.5%',
        date: new Date('2025-12-08T11:00:00')
      },
      {
        id: 'h6',
        action: 'Sale Concluded',
        performedBy: 'Sarah Dealer',
        role: 'Sales Executive',
        details: 'Vehicle marked as sold, delivery scheduled',
        date: new Date('2025-12-15T15:00:00')
      }
    ]
  },
  {
    id: 'lead-sold-2',
    vehicleIds: ['sold-2'],
    customerName: 'Thandi Nkosi',
    email: 'thandi.n@example.com',
    phone: '071 222 3333',
    address: '15 Protea Avenue, Menlyn, Pretoria, 0181',
    source: 'walk-in',
    status: 'sold',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    assignedTo: 'Mike Sales',
    saleDetails: {
      salePrice: 920000,
      paymentType: 'cash',
      discountAmount: 0,
      discountPercentage: 0,
      soldDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    history: [
      {
        id: 'h7',
        action: 'Lead Created',
        performedBy: 'Mike Sales',
        role: 'Sales Executive',
        details: 'Walk-in client interested in Fortuner',
        date: new Date('2026-02-01T11:00:00')
      },
      {
        id: 'h8',
        action: 'Negotiation',
        performedBy: 'Mike Sales',
        role: 'Sales Executive',
        details: 'Client requested cash discount (declined)',
        date: new Date('2026-02-05T10:00:00')
      },
      {
        id: 'h9',
        action: 'Sale Concluded',
        performedBy: 'Mike Sales',
        role: 'Sales Executive',
        details: 'Full payment received, vehicle released',
        date: new Date('2026-02-10T09:00:00')
      }
    ]
  }
];

import { Lead } from "@/types/vehicle";

export const mockLeads: Lead[] = [
  {
    id: "1",
    customerName: "John Smith",
    email: "john.smith@example.com",
    phone: "082 123 4567",
    source: "website",
    status: "new",
    vehicleId: "1", // BMW 3 Series
    vehicleIds: ["1"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    notes: "Interested in financing options."
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "071 987 6543",
    source: "whatsapp",
    status: "contacted",
    vehicleId: "3", // VW Golf GTI
    vehicleIds: ["3"],
    assignedTo: "Mike Sales",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    notes: "Asked about trade-in value for her 2018 Polo."
  },
  {
    id: "3",
    customerName: "David Nkosi",
    email: "david.n@example.com",
    phone: "063 555 1234",
    source: "walk-in",
    status: "test-drive",
    vehicleId: "4", // Toyota Hilux
    vehicleIds: ["4"],
    assignedTo: "Sarah Dealer",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    notes: "Test drive scheduled for Saturday 10 AM."
  },
  {
    id: "4",
    customerName: "Michael Brown",
    email: "m.brown@example.com",
    phone: "083 222 3333",
    source: "phone",
    status: "finance",
    vehicleId: "5", // Ford Ranger
    vehicleIds: ["5"],
    assignedTo: "Mike Sales",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    notes: "Application submitted to Wesbank."
  },
  {
    id: "5",
    customerName: "Emily Davis",
    email: "emily.d@example.com",
    phone: "072 444 5555",
    source: "website",
    status: "sold",
    vehicleId: "2", // Mercedes C-Class
    vehicleIds: ["2"],
    assignedTo: "Sarah Dealer",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    notes: "Delivery scheduled for next week.",
    saleDetails: {
      salePrice: 450000,
      paymentType: 'financed',
      discountAmount: 20000,
      discountPercentage: 4.25,
      discountReason: "End of month special",
      soldDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
    }
  }
];

export const mockSalespeople = [
  { id: "1", name: "Mike Sales", email: "mike@ebmotors.co.za" },
  { id: "2", name: "Sarah Dealer", email: "sarah@ebmotors.co.za" },
  { id: "3", name: "Rameez Admin", email: "rameez@ebmotors.co.za" },
];


export type UserRole = 'Admin' | 'Manager' | 'Sales Executive' | 'F&I Manager' | 'Dealer Principal' | 'Receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Suspended' | 'Inactive';
  lastActive: Date;
  phoneNumber?: string;
  avatar?: string;
  permissions?: string[];
  mobileAccess?: boolean;
}

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Rameez Admin",
    email: "rameez@ebmotors.co.za",
    role: "Admin",
    status: "Active",
    lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    phoneNumber: "+27 82 123 4567",
    permissions: ["Overview", "Analytics", "Communication", "Assignments", "Leads & CRM", "Inventory", "Sales Records", "Calendar", "System Logs", "Settings"],
    mobileAccess: true
  },
  {
    id: "u2",
    name: "Mike Sales",
    email: "mike@ebmotors.co.za",
    role: "Sales Executive",
    status: "Active",
    lastActive: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    phoneNumber: "+27 83 987 6543",
    permissions: ["Overview", "Leads & CRM", "Inventory", "Sales Records", "Calendar", "Communication", "Assignments"],
    mobileAccess: true
  },
  {
    id: "u3",
    name: "Sarah Dealer",
    email: "sarah@ebmotors.co.za",
    role: "Dealer Principal",
    status: "Active",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    phoneNumber: "+27 82 555 0123",
    permissions: ["Overview", "Analytics", "Communication", "Assignments", "Leads & CRM", "Inventory", "Sales Records", "Calendar"],
    mobileAccess: false
  },
  {
    id: "u4",
    name: "John Finance",
    email: "john@ebmotors.co.za",
    role: "F&I Manager",
    status: "Suspended",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    phoneNumber: "+27 84 222 3333",
    permissions: ["Overview", "Leads & CRM", "Sales Records", "Communication"]
  },
  {
    id: "u5",
    name: "Jessica Front",
    email: "reception@ebmotors.co.za",
    role: "Receptionist",
    status: "Inactive",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    phoneNumber: "+27 71 444 5555",
    permissions: ["Overview", "Communication", "Calendar"]
  }
];

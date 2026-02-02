
import { UserRole } from "./mockUsers";

export type PlanTier = 'Basic' | 'Professional' | 'Enterprise';

export interface Feature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isPremium: boolean; // Only for higher tiers
}

export interface Client {
  id: string;
  name: string; // Dealership Name
  ownerName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Suspended' | 'Onboarding';
  tier: PlanTier;
  joinedDate: Date;
  nextBillingDate: Date;
  activeFeatures: string[]; // IDs of enabled features
  usersCount: number;
  maxUsers: number;
  carsCount: number;
}

export const mockFeatures: Feature[] = [
  { id: 'f1', name: 'Inventory Management', description: 'Basic car listing and management', isEnabled: true, isPremium: false },
  { id: 'f2', name: 'Lead Management (CRM)', description: 'Track and manage customer leads', isEnabled: true, isPremium: false },
  { id: 'f3', name: 'Sales Records', description: 'Digital sales contracts and history', isEnabled: true, isPremium: false },
  { id: 'f4', name: 'Advanced Analytics', description: 'Deep insights into sales and performance', isEnabled: true, isPremium: true },
  { id: 'f5', name: 'Stock Syndication', description: 'Auto-post to 3rd party platforms', isEnabled: true, isPremium: true },
  { id: 'f6', name: 'AI Chat Assistant', description: 'Automated customer responses', isEnabled: true, isPremium: true },
  { id: 'f7', name: 'Multi-Branch Support', description: 'Manage multiple dealership locations', isEnabled: true, isPremium: true },
  { id: 'f8', name: 'Mobile App Access', description: 'Access via mobile application', isEnabled: true, isPremium: true },
  { id: 'f9', name: 'Task Management', description: 'Assign and track team tasks', isEnabled: true, isPremium: false },
  { id: 'f10', name: 'Communication Hub', description: 'Unified messaging and client communication', isEnabled: true, isPremium: false },
  { id: 'f11', name: 'Calendar & Scheduling', description: 'Appointment and test drive scheduling', isEnabled: true, isPremium: false },
  { id: 'f12', name: 'Audit Logs', description: 'Detailed system activity logs', isEnabled: true, isPremium: true },
  { id: 'f13', name: 'Document Generation', description: 'Auto-generate OTPs, invoices, and contracts', isEnabled: true, isPremium: false },
  { id: 'f14', name: 'Social Media Integration', description: 'Connect Facebook/Instagram for lead syncing', isEnabled: true, isPremium: true },
  { id: 'f15', name: 'Staff Performance', description: 'Sales targets and activity tracking', isEnabled: true, isPremium: true },
  { id: 'f16', name: 'Workshop Booking', description: 'Service and repair scheduling module', isEnabled: true, isPremium: true },
  { id: 'f17', name: 'Support Tickets', description: 'Client support ticketing system', isEnabled: true, isPremium: false },
];

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'EB Motors',
    ownerName: 'Ricardo Alverez',
    email: 'ricardo@ebmotors.co.za',
    phone: '+27 82 123 4567',
    status: 'Active',
    tier: 'Professional',
    joinedDate: new Date('2023-01-15'),
    nextBillingDate: new Date('2024-02-15'),
    activeFeatures: ['f1', 'f2', 'f3', 'f4', 'f5', 'f8', 'f9', 'f10', 'f11', 'f13', 'f17'],
    usersCount: 5,
    maxUsers: 10,
    carsCount: 45
  }
];

export const singleClient: Client = mockClients[0];

export interface ClientUser {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales' | 'Manager';
  status: 'Active' | 'Suspended';
  lastActive: Date;
}

export const mockClientUsers: ClientUser[] = [
  { id: 'u1', clientId: 'c1', name: 'Ricardo Alverez', email: 'ricardo@ebmotors.co.za', role: 'Admin', status: 'Active', lastActive: new Date() },
  { id: 'u2', clientId: 'c1', name: 'Sarah Smith', email: 'sarah@ebmotors.co.za', role: 'Sales', status: 'Active', lastActive: new Date(Date.now() - 86400000) },
  { id: 'u3', clientId: 'c1', name: 'John Doe', email: 'john@ebmotors.co.za', role: 'Manager', status: 'Suspended', lastActive: new Date(Date.now() - 172800000) },
];

export interface ClientLog {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  canUndo: boolean;
}

export const mockClientLogs: ClientLog[] = [
  { id: 'l1', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Vehicle Added', details: 'Added 2023 Toyota Hilux (VIN: ...8839)', timestamp: new Date(Date.now() - 3600000), canUndo: true },
  { id: 'l2', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Lead Status Update', details: 'Changed lead #442 status to "Qualified"', timestamp: new Date(Date.now() - 7200000), canUndo: true },
  { id: 'l3', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Import', details: 'Imported 45 vehicles via CSV', timestamp: new Date(Date.now() - 86400000), canUndo: true },
  { id: 'l4', clientId: 'c1', userId: 'u3', userName: 'John Doe', action: 'Delete User', details: 'Removed user "Mike Ross"', timestamp: new Date(Date.now() - 172800000), canUndo: true },
  { id: 'l5', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Settings Update', details: 'Updated business hours configuration', timestamp: new Date(Date.now() - 200000000), canUndo: true },
  { id: 'l6', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Export', details: 'Exported Monthly Sales Report (PDF)', timestamp: new Date(Date.now() - 250000000), canUndo: false },
  { id: 'l7', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'User Invite', details: 'Invited new sales agent: david@ebmotors.co.za', timestamp: new Date(Date.now() - 300000000), canUndo: true },
  { id: 'l8', clientId: 'c1', userId: 'system', userName: 'System', action: 'Backup', details: 'Automated daily backup completed', timestamp: new Date(Date.now() - 350000000), canUndo: false },
  { id: 'l9', clientId: 'c1', userId: 'u3', userName: 'John Doe', action: 'Bulk Update', details: 'Updated prices for 12 vehicles', timestamp: new Date(Date.now() - 400000000), canUndo: true },
  { id: 'l10', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Login', details: 'Successful login from IP 192.168.1.45', timestamp: new Date(Date.now() - 450000000), canUndo: false },
  { id: 'l11', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Integration', details: 'Connected Facebook Lead Ads integration', timestamp: new Date(Date.now() - 500000000), canUndo: true },
  { id: 'l12', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Subscription', details: 'Switched billing cycle to Annual', timestamp: new Date(Date.now() - 600000000), canUndo: false },
  { id: 'l13', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Lead Note', details: 'Added note to lead #551: "Customer interested in financing options"', timestamp: new Date(Date.now() - 650000000), canUndo: true },
  { id: 'l14', clientId: 'c1', userId: 'u3', userName: 'John Doe', action: 'Vehicle Status', details: 'Marked 2021 Ford Ranger as "Sold"', timestamp: new Date(Date.now() - 700000000), canUndo: true },
  { id: 'l15', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'User Role', details: 'Promoted Sarah Smith to Manager', timestamp: new Date(Date.now() - 750000000), canUndo: true },
  { id: 'l16', clientId: 'c1', userId: 'system', userName: 'System', action: 'Security Alert', details: 'Failed login attempt from unfamiliar IP', timestamp: new Date(Date.now() - 800000000), canUndo: false },
  { id: 'l17', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Email Campaign', details: 'Sent "Summer Sale" campaign to 450 leads', timestamp: new Date(Date.now() - 850000000), canUndo: false },
  { id: 'l18', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'API Key', details: 'Generated new API key for website integration', timestamp: new Date(Date.now() - 900000000), canUndo: true },
  { id: 'l19', clientId: 'c1', userId: 'u3', userName: 'John Doe', action: 'Inventory Audit', details: 'Completed monthly stock take', timestamp: new Date(Date.now() - 950000000), canUndo: false },
  { id: 'l20', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Test Drive', details: 'Scheduled test drive for 2024 BMW X3', timestamp: new Date(Date.now() - 1000000000), canUndo: true },
  { id: 'l21', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Plan Upgrade', details: 'Requested upgrade to Enterprise Plan', timestamp: new Date(Date.now() - 1100000000), canUndo: false },
  { id: 'l22', clientId: 'c1', userId: 'system', userName: 'System', action: 'Auto-Response', details: 'Sent after-hours reply to lead #559', timestamp: new Date(Date.now() - 1200000000), canUndo: false },
  { id: 'l23', clientId: 'c1', userId: 'u3', userName: 'John Doe', action: 'Document', details: 'Uploaded signed contract for Deal #1022', timestamp: new Date(Date.now() - 1300000000), canUndo: true },
  { id: 'l24', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Feature Toggle', details: 'Enabled "AI Chat Assistant" feature', timestamp: new Date(Date.now() - 1400000000), canUndo: true },
  { id: 'l25', clientId: 'c1', userId: 'u2', userName: 'Sarah Smith', action: 'Lead Assignment', details: 'Reassigned 5 leads from Mike to Sarah', timestamp: new Date(Date.now() - 1500000000), canUndo: true },
  { id: 'l26', clientId: 'c1', userId: 'system', userName: 'System', action: 'Maintenance', details: 'System scheduled for maintenance window', timestamp: new Date(Date.now() - 1600000000), canUndo: false },
  { id: 'l27', clientId: 'c1', userId: 'u1', userName: 'Ricardo Alverez', action: 'Contract', details: 'Generated purchase agreement for Deal #992', timestamp: new Date(Date.now() - 1700000000), canUndo: false },
];

export interface ImportRecord {
  id: string;
  clientId: string;
  date: Date;
  type: 'Vehicles' | 'Users' | 'Leads';
  count: number;
  status: 'Success' | 'Failed' | 'Partial';
  fileName: string;
}

export const mockImportHistory: ImportRecord[] = [
  { id: 'i1', clientId: 'c1', date: new Date(Date.now() - 86400000), type: 'Vehicles', count: 45, status: 'Success', fileName: 'inventory_jan.csv' },
  { id: 'i2', clientId: 'c1', date: new Date(Date.now() - 172800000), type: 'Users', count: 5, status: 'Success', fileName: 'staff_list.csv' },
  { id: 'i3', clientId: 'c1', date: new Date(Date.now() - 259200000), type: 'Leads', count: 120, status: 'Partial', fileName: 'old_leads_export.csv' },
];


export const mockTiers = [
  {
    name: 'Basic',
    price: 3500,
    features: ['f1', 'f2', 'f11'],
    maxUsers: 3,
    maxCars: 20
  },
  {
    name: 'Professional',
    price: 4999,
    features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f8', 'f9', 'f10', 'f11', 'f13', 'f17'],
    maxUsers: 10,
    maxCars: 100
  },
  {
    name: 'Enterprise',
    price: 7899,
    features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17'],
    maxUsers: 999,
    maxCars: 9999
  }
];

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
  attachments?: string[]; // Array of file names or URLs
}

export interface Ticket {
  id: string;
  clientId: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  lastMessage: string;
  messages: TicketMessage[];
}

export const mockTickets: Ticket[] = [
  { 
    id: 't1', 
    clientId: 'c1', 
    subject: 'Integration Issue with Facebook', 
    status: 'In Progress', 
    priority: 'High', 
    createdAt: new Date(Date.now() - 86400000), 
    lastMessage: 'We are checking the API tokens.',
    messages: [
      { id: 'm1', sender: 'user', message: 'I cannot connect my Facebook account.', timestamp: new Date(Date.now() - 86400000) },
      { id: 'm2', sender: 'support', message: 'We are checking the API tokens.', timestamp: new Date(Date.now() - 86000000) }
    ]
  },
  { 
    id: 't2', 
    clientId: 'c1', 
    subject: 'How to add new user?', 
    status: 'Resolved', 
    priority: 'Low', 
    createdAt: new Date(Date.now() - 604800000), 
    lastMessage: 'User added successfully.',
    messages: [
      { id: 'm3', sender: 'user', message: 'How do I add a new user?', timestamp: new Date(Date.now() - 604800000) },
      { id: 'm4', sender: 'support', message: 'Go to Users tab and click Add.', timestamp: new Date(Date.now() - 600000000) },
      { id: 'm5', sender: 'user', message: 'User added successfully.', timestamp: new Date(Date.now() - 590000000) }
    ]
  },
  { 
    id: 't3', 
    clientId: 'c1', 
    subject: 'Billing Invoice Discrepancy', 
    status: 'Open', 
    priority: 'Medium', 
    createdAt: new Date(Date.now() - 3600000), 
    lastMessage: 'Waiting for billing department.',
    messages: [
      { id: 'm6', sender: 'user', message: 'My invoice amount is wrong.', timestamp: new Date(Date.now() - 3600000) },
      { id: 'm7', sender: 'support', message: 'Waiting for billing department.', timestamp: new Date(Date.now() - 3000000) }
    ]
  },
];

// --- New Features Data ---

// 1. Admin Users
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support' | 'Manager' | 'Developer';
  status: 'Active' | 'Inactive';
  lastLogin: Date;
  avatar?: string;
}

export const mockAdminUsers: AdminUser[] = [
  { id: 'a1', name: 'Polil Admin', email: 'admin@automate.sa', role: 'Super Admin', status: 'Active', lastLogin: new Date() },
  { id: 'a2', name: 'Sarah Support', email: 'support@automate.sa', role: 'Support', status: 'Active', lastLogin: new Date(Date.now() - 3600000) },
  { id: 'a3', name: 'Mike Manager', email: 'mike@automate.sa', role: 'Manager', status: 'Active', lastLogin: new Date(Date.now() - 86400000) },
  { id: 'a4', name: 'Dev Dave', email: 'dave@automate.sa', role: 'Developer', status: 'Inactive', lastLogin: new Date(Date.now() - 604800000) },
];

// 2. System Audit Logs
export interface SystemLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string; // e.g., 'Client Suspended', 'Plan Created'
  target: string; // e.g., 'EB Motors', 'Enterprise Plan'
  details: string;
  timestamp: Date;
  ipAddress: string;
}

export const mockSystemLogs: SystemLog[] = [
  { id: 'sl1', adminId: 'a1', adminName: 'Polil Admin', action: 'Client Created', target: 'EB Motors', details: 'Created new client account', timestamp: new Date(Date.now() - 3600000), ipAddress: '192.168.1.1' },
  { id: 'sl2', adminId: 'a2', adminName: 'Sarah Support', action: 'Ticket Resolved', target: 'Ticket #t2', details: 'Marked ticket as resolved', timestamp: new Date(Date.now() - 7200000), ipAddress: '10.0.0.45' },
  { id: 'sl3', adminId: 'a1', adminName: 'Polil Admin', action: 'Plan Updated', target: 'Professional Tier', details: 'Changed price to R4999', timestamp: new Date(Date.now() - 86400000), ipAddress: '192.168.1.1' },
  { id: 'sl4', adminId: 'a3', adminName: 'Mike Manager', action: 'Client Suspended', target: 'Bad Dealership', details: 'Suspended due to non-payment', timestamp: new Date(Date.now() - 172800000), ipAddress: '172.16.0.23' },
  { id: 'sl5', adminId: 'a1', adminName: 'Polil Admin', action: 'Feature Toggle', target: 'AI Chat', details: 'Enabled global AI feature', timestamp: new Date(Date.now() - 259200000), ipAddress: '192.168.1.1' },
];

// 3. Announcements
export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Critical';
  targetAudience: 'All' | 'Active' | 'Beta Users';
  status: 'Draft' | 'Sent' | 'Scheduled';
  scheduledFor?: Date;
  sentAt?: Date;
  author: string;
}

export const mockAnnouncements: Announcement[] = [
  { id: 'an1', title: 'Scheduled Maintenance', message: 'The system will be down for 30 mins on Sunday at 2 AM.', type: 'Warning', targetAudience: 'All', status: 'Sent', sentAt: new Date(Date.now() - 86400000), author: 'Polil Admin' },
  { id: 'an2', title: 'New Feature: AI Chat', message: 'We have launched the new AI Chat Assistant. Enable it in settings!', type: 'Success', targetAudience: 'Active', status: 'Sent', sentAt: new Date(Date.now() - 604800000), author: 'Mike Manager' },
  { id: 'an3', title: 'Privacy Policy Update', message: 'We have updated our terms of service.', type: 'Info', targetAudience: 'All', status: 'Draft', author: 'Polil Admin' },
];

// 4. Analytics Data
export interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export const mockAdvancedAnalytics = {
  mrr: { label: 'Monthly Recurring Revenue', value: 'R 245,000', change: 12.5, trend: 'up' } as AnalyticsMetric,
  churnRate: { label: 'Churn Rate', value: '2.4%', change: -0.5, trend: 'down' } as AnalyticsMetric,
  ltv: { label: 'Lifetime Value (LTV)', value: 'R 18,500', change: 5.2, trend: 'up' } as AnalyticsMetric,
  activeUsers: { label: 'Daily Active Users', value: 1240, change: 8.1, trend: 'up' } as AnalyticsMetric,
  featureUsage: [
    { name: 'Inventory', usage: 95 },
    { name: 'CRM', usage: 88 },
    { name: 'AI Chat', usage: 45 },
    { name: 'Invoicing', usage: 72 },
    { name: 'Social Integration', usage: 30 },
  ]
};

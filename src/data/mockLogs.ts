
export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE';
  timestamp: Date; // For LOGOUT, this is the logout time. For LOGIN, this is the login time.
  loginTimestamp?: Date; // Specifically for LOGOUT events to show when the session started
  ipAddress: string;
  deviceInfo: string; // Browser/OS or Computer ID
  location: string;
  status: 'success' | 'warning' | 'error';
  details?: string;
  sessionDuration?: string; // For logout events
}

export const mockLogs: SystemLog[] = [
  {
    id: "log-001",
    userId: "u1",
    userName: "Rameez Admin",
    userRole: "Admin",
    action: "LOGIN",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    ipAddress: "197.185.102.45",
    deviceInfo: "Chrome / Windows 11 (Desktop-8293X)",
    location: "Johannesburg, ZA",
    status: "success",
    details: "Successful login via credentials"
  },
  {
    id: "log-002",
    userId: "u2",
    userName: "Mike Sales",
    userRole: "Sales Executive",
    action: "LOGOUT",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    loginTimestamp: new Date(Date.now() - 1000 * 60 * 45 - (1000 * 60 * 60 * 2 + 1000 * 60 * 15)), // 2h 15m before logout
    ipAddress: "197.185.110.22",
    deviceInfo: "Safari / iPhone 14",
    location: "Cape Town, ZA",
    status: "success",
    sessionDuration: "2h 15m"
  },
  {
    id: "log-003",
    userId: "u3",
    userName: "Sarah Dealer",
    userRole: "Dealer Principal",
    action: "LOGIN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    ipAddress: "105.24.88.12",
    deviceInfo: "Firefox / MacOS",
    location: "Durban, ZA",
    status: "success"
  },
  {
    id: "log-004",
    userId: "unknown",
    userName: "Unknown User",
    userRole: "N/A",
    action: "FAILED_LOGIN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    ipAddress: "45.22.19.112",
    deviceInfo: "Unknown / Bot",
    location: "Moscow, RU",
    status: "error",
    details: "Invalid password attempt (3rd retry)"
  },
  {
    id: "log-005",
    userId: "u1",
    userName: "Rameez Admin",
    userRole: "Admin",
    action: "PROFILE_UPDATE",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    ipAddress: "197.185.102.45",
    deviceInfo: "Chrome / Windows 11",
    location: "Johannesburg, ZA",
    status: "success",
    details: "Changed email notification settings"
  },
  {
    id: "log-006",
    userId: "u2",
    userName: "Mike Sales",
    userRole: "Sales Executive",
    action: "LOGIN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day 2 hours ago
    ipAddress: "197.185.110.22",
    deviceInfo: "Safari / iPhone 14",
    location: "Cape Town, ZA",
    status: "success"
  },
  {
    id: "log-007",
    userId: "u4",
    userName: "John Finance",
    userRole: "F&I Manager",
    action: "LOGIN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    ipAddress: "196.25.10.5",
    deviceInfo: "Edge / Windows 10",
    location: "Pretoria, ZA",
    status: "success"
  },
  {
    id: "log-008",
    userId: "u4",
    userName: "John Finance",
    userRole: "F&I Manager",
    action: "PASSWORD_CHANGE",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48 - 1000 * 60 * 10), // 2 days 10 mins ago
    ipAddress: "196.25.10.5",
    deviceInfo: "Edge / Windows 10",
    location: "Pretoria, ZA",
    status: "success",
    details: "Scheduled 90-day password rotation"
  }
];

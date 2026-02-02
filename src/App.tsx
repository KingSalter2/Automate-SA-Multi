import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "@/auth/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";
import Index from "./pages/Index";
import VehiclesPage from "./pages/VehiclesPage";
import FinancePage from "./pages/FinancePage";
import AboutUs from "./pages/AboutUs";
import TradeIn from "./pages/TradeIn";
import Contact from "./pages/Contact";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import LeadsPage from "./pages/dashboard/LeadsPage";
import CalendarPage from "./pages/dashboard/CalendarPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import CommunicationPage from "./pages/dashboard/CommunicationPage";
import AssignmentsPage from "./pages/dashboard/AssignmentsPage";
import SalesRecordsPage from "./pages/dashboard/SalesRecordsPage";
import LogsPage from "./pages/dashboard/LogsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SupportPage from "./pages/dashboard/SupportPage";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SupaAdminLayout from "./pages/supaadmin/SupaAdminLayout";
import SupaAdminOverview from "./pages/supaadmin/SupaAdminOverview";
import ClientsPage from "./pages/supaadmin/ClientsPage";
import TiersPage from "./pages/supaadmin/TiersPage";
import FeaturesPage from "./pages/supaadmin/FeaturesPage";
import BillingPage from "./pages/supaadmin/BillingPage";
import TicketsPage from "./pages/supaadmin/TicketsPage";
import SupaAnalyticsPage from "./pages/supaadmin/AnalyticsPage";
import AnnouncementsPage from "./pages/supaadmin/AnnouncementsPage";
import AuditLogsPage from "./pages/supaadmin/AuditLogsPage";
import TeamPage from "./pages/supaadmin/TeamPage";
import SupaSettingsPage from "./pages/supaadmin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/trade-in" element={<TradeIn />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/documents/:leadId" element={<DocumentUploadPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Dashboard Routes */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="communication" element={<CommunicationPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="sales" element={<SalesRecordsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<SupportPage />} />
            </Route>

            {/* SupaAdmin Routes */}
            <Route
              path="/ops"
              element={
                <ProtectedRoute>
                  <SupaAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SupaAdminOverview />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tiers" element={<TiersPage />} />
              <Route path="features" element={<FeaturesPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="analytics" element={<SupaAnalyticsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="settings" element={<SupaSettingsPage />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Layouts
import { UserLayout } from "@/layouts/UserLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// Public Pages
import { LandingPage } from "@/pages/landing/LandingPage";
import { UserLogin } from "@/pages/auth/UserLogin";
import { UserRegister } from "@/pages/auth/UserRegister";
import { AdminLogin } from "@/pages/auth/AdminLogin";
import { Pricing } from "@/pages/Pricing";
import { About } from "@/pages/About";
import { Features } from "@/pages/Features";
import { ServicesPage } from "@/pages/ServicesPage";

// User Pages
import { UserDashboard } from "@/pages/user/UserDashboard";
import { Services } from "@/pages/user/Services";
import { Subscriptions } from "@/pages/user/Subscriptions";
import { Payments } from "@/pages/user/Payments";

// Admin Pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminUsers } from "@/pages/admin/Users";
import { AdminPayments } from "@/pages/admin/AdminPayments";
import { AdminServices } from "@/pages/admin/AdminServices";
import { AdminSubscriptions } from "@/pages/admin/AdminSubscriptions";
import { PaymentChannels } from "@/pages/admin/PaymentChannels";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/services" element={<ServicesPage />} />

              {/* User Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserDashboard />} />
                <Route path="services" element={<Services />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="payments" element={<Payments />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="payment-channels" element={<PaymentChannels />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

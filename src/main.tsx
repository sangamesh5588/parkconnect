import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout";
import Home from "./app/page";
import Login from "./app/(auth)/login/page";
import OTPVerification from "./app/(auth)/otp/page";
import AuthCallback from "./app/(auth)/callback/page";
import HostLanding from "./pages/HostLanding";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ScrollToTop from "./components/ui/scroll-to-top";

import HostOnboarding from "./app/host/onboarding/page";
import HostApprovalWaiting from "./app/host/onboarding/approval/page";
import ParkingApprovalWaiting from "./app/host/parking/approval/page";
import HostBookingsPage from "./app/host/bookings/page";
import HostDashboard from "./app/host/dashboard/page";
import ParkingListFlow from "./app/host/parking/list/page";
import EntryScanPage from "./app/host/entry-scan/page";
import ExitScanPage from "./app/host/exit-scan/page";
import Search from "./app/renter/search/page";
import ErrorBoundary from "./components/ui/error-boundary";
import { SearchProvider } from "./contexts/SearchContext";
import { AuthProvider } from "./contexts/AuthContext";
import { HostAuthGuard } from "./components/auth/HostAuthGuard";
import { HostRouteGuard } from "./components/auth/HostRouteGuard";
import { SimpleAuthGuard } from "./components/auth/SimpleAuthGuard";
import { HostLayout } from "./components/layout/HostLayout";
import { HostErrorBoundary } from "./components/ui/HostErrorBoundary";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Host onboarding routes */}
          <Route path="/host/onboarding" element={<HostOnboarding />} />
          <Route path="/host/onboarding/approval" element={<HostApprovalWaiting />} />

          {/* Protected Host routes with automatic redirects */}
          <Route path="/host" element={
            <HostRouteGuard>
              <HostAuthGuard>
                <HostErrorBoundary>
                  <HostLayout />
                </HostErrorBoundary>
              </HostAuthGuard>
            </HostRouteGuard>
          }>
            <Route path="dashboard" element={<HostDashboard />} />
            <Route path="parking/list" element={<ParkingListFlow />} />
            <Route path="parking/approval" element={<ParkingApprovalWaiting />} />
            <Route path="bookings" element={<HostBookingsPage />} />
            {/* Add more host routes here as we build them */}
          </Route>

          {/* Routes with layout */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="become-host" element={<HostLanding />} />
            <Route path="renter/search" element={<Search />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            {/* Add more routes here as we migrate pages */}
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
    </AuthProvider>
  </ErrorBoundary>
);

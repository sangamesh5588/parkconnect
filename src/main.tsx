import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout";
import Home from "./app/page";
import Login from "./app/(auth)/login/page";
import OTPVerification from "./app/(auth)/otp/page";
import HostLanding from "./pages/HostLanding";

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
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTPVerification />} />

          {/* Host onboarding routes */}
          <Route path="/host/onboarding" element={<HostOnboarding />} />
          <Route path="/host/onboarding/approval" element={<HostApprovalWaiting />} />

          {/* Host dashboard routes */}
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/host/parking/list" element={<ParkingListFlow />} />
          <Route path="/host/parking/approval" element={<ParkingApprovalWaiting />} />
          <Route path="/host/bookings" element={<HostBookingsPage />} />

          {/* Routes with layout */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="host" element={<HostLanding />} />
            <Route path="renter/search" element={<Search />} />
            {/* Add more routes here as we migrate pages */}
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
    </AuthProvider>
  </ErrorBoundary>
);

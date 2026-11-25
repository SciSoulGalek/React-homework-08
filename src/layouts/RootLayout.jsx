import { Outlet } from "react-router";
import { Suspense } from "react";
import NavBar from "../components/NavBar";
import PWAUpdatePrompt from "../components/PWAUpdatePrompt";
import NetworkStatus from "../components/NetworkStatus";

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <NetworkStatus />
      <PWAUpdatePrompt />
      <main>
        <Suspense fallback={<p className="status-message">Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
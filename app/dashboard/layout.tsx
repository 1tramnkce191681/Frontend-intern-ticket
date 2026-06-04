import { ProtectedRoute } from "@/components/protected-route";
import { Navigation } from "@/components/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navigation />
      {children}
    </ProtectedRoute>
  );
}

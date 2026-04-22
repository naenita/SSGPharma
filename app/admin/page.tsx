import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { isAdminAuthenticated } from "@/lib/admin-session";

async function getAdminAuthState() {
  try {
    return await isAdminAuthenticated();
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const authed = await getAdminAuthState();
  if (!authed) {
    return <AdminLogin />;
  }
  return <AdminDashboard />;
}

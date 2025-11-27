import { User } from "@/types/User";

interface AdminDashboardProps {
  user: User;
}
export default function AdminDashboard({ user } : AdminDashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.name} (Admin)</p>
    </div>
  );
}

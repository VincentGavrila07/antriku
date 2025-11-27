import { User } from "@/types/User";

interface StaffDashboardProps {
  user: User;
}
export default function StaffDashboard({ user } : StaffDashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Staff Dashboard</h1>
      <p>Welcome, {user.name} (Admin)</p>
    </div>
  );
}

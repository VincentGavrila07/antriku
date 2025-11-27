import { User } from "@/types/User";

interface CustomerDashboardProps {
  user: User;
}

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Customer Dashboard</h1>
      <p>Welcome, {user.name} (Customer)</p>
    </div>
  );
}

import { User } from "@/types/User";
import { useLanguage } from "@/app/languange-context";
import { Spin } from "antd";
interface StaffDashboardProps {
  user: User;
}
export default function StaffDashboard({ user } : StaffDashboardProps) {
  const { translations, loading } = useLanguage();
  if (loading || !translations) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Staff Dashboard</h1>
      <p>{translations.welcome.welcome}, {user.name} (Staff)</p>
    </div>
  );
}

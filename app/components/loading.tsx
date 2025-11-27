import { Spin } from "antd";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
      <Spin size="large" />
    </div>
  );
}

"use client";

import React from "react";
import { Form, Input, Button, Checkbox, Typography, notification, Alert, Divider } from "antd";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { GoogleOutlined } from "@ant-design/icons";
import { usePermission } from "../context/permission-context";
import ServiceService from "@/services/ServiceService";


const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const [errorMsg, setErrorMsg] = React.useState("");
  const { refreshPermissions } = usePermission(); // ambil refreshPermissions dari context

  const onFinish = (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setErrorMsg("");

    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: async (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          const userId = data.user.id;
          try {
            const myServiceRes = await ServiceService.getMyService(userId);
            localStorage.setItem(
              "myServices",
              JSON.stringify(myServiceRes.data)
            );
          } catch (err) {
            console.error("Gagal mengambil my service", err);
          }
          await refreshPermissions();
          router.push("/dashboard");
        },
        onError: (err: Error) => {
          setErrorMsg(err.message);
          notification.error({
            title: "Login Failed",
            description: err.message,
          });
        },
      }
    );
  };

  const logoPath = "/assets/LogoAntriku3NoBG.png";
  const bgPath = "/assets/Antri.jpg";

  return (
    // Background Halaman: Abu-abu muda agar Kartu Login terlihat "pop"
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container Utama: Grid 2 Kolom (Kiri Gambar, Kanan Form) */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-[650px]">
        {/* ================= SISI KIRI: GAMBAR BACKGROUND ================= */}
        <div className="relative hidden md:flex flex-col justify-end p-12 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgPath}')` }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-md">
              Join Antriku System
            </h2>
            <p className="text-gray-200 text-lg opacity-90 drop-shadow-sm">
              Daftarkan akun Anda dan mulai kelola antrian dengan lebih efisien
              hari ini.
            </p>
          </div>
        </div>

        {/* ================= SISI KANAN: FORM LOGIN (PUTIH BERSIH) ================= */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          {/* Header Section: Logo & Judul */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Logo Persegi Panjang */}
            <div className="border-gray-100">
              <img
                src={logoPath}
                alt="Antriku Logo"
                className="h-16 w-auto object-contain rounded-lg"
              />
            </div>

            <Title
              level={2}
              style={{ marginBottom: 0, fontWeight: 700, color: "#1f2937" }}
            >
              Login
            </Title>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <Alert
              message="Login Gagal"
              description={errorMsg}
              type="error"
              showIcon
              className="mb-6 rounded-lg"
            />
          )}

          <Form
            name="loginForm"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              label={
                <span className="font-semibold text-gray-700">
                  Email Address
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Email wajib diisi" },
                { type: "email", message: "Email tidak valid" },
              ]}
            >
              {/* Input Standar (Clean White) */}
              <Input
                placeholder="nama@email.com"
                className="rounded-lg py-2.5 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-semibold text-gray-700">Password</span>
              }
              name="password"
              rules={[
                { required: true, message: "Password wajib diisi" },
                { min: 6, message: "Password minimal 6 karakter" },
              ]}
            >
              <Input.Password
                placeholder="Masukkan password"
                className="rounded-lg py-2.5 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-8">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <a
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                href="/forgot-password" 
              >
                Forgot Password?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loginMutation.isPending}
                className="font-bold text-lg h-12 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 border-none transition-all"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Register */}
          <div className="text-center mt-6">
            <Text className="text-gray-500">
              Belum punya akun?{" "}
              <a
                className="text-blue-600 font-bold hover:underline"
                href="/register"
              >
                Daftar Sekarang
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import React from "react";
import { useRegister } from "../hooks/useRegister";
import { useRouter } from "next/navigation";
import { Form, Input, Button, notification, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { RegisterFormValues } from "@/types/User";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const router = useRouter();
  const registerMutation = useRegister();
  const [form] = Form.useForm();

  const handleError = (err: unknown) => {
    let message = "Terjadi kesalahan";

    if (err instanceof Error) message = err.message;
    else if (typeof err === "string") message = err;

    notification.error({
      title: "Register Gagal",
      description: message,
    });
  };

  const handleSubmit = (values: RegisterFormValues) => {
    const { name, email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      notification.warning({
        title: "Password tidak sama",
        description: "Password dan Confirm Password harus sama!",
      });
      return;
    }

    registerMutation.mutate(
      { name, email, password, roleId: 2 },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          notification.success({
            title: "Registrasi Berhasil",
            description: `Selamat datang, ${data.user.name}`,
          });

          router.push("/dashboard");
        },
        onError: (err: unknown) => handleError(err),
      }
    );
  };

  const logoPath = "/assets/LogoAntriku3NoBG.png";
  const bgPath = "/assets/Antri.jpg";

  return (
    // Background Halaman: Abu-abu muda (Konsisten dengan Login)
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container Utama: Grid 2 Kolom (Kiri Gambar, Kanan Form) */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-[650px]">
        {/* ================= SISI KIRI: GAMBAR BACKGROUND ================= */}
        <div className="relative hidden md:flex flex-col justify-end p-12 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgPath}')` }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

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

        {/* ================= SISI KANAN: FORM REGISTER (PUTIH BERSIH) ================= */}
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

          {/* FORM */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="font-semibold text-gray-700">Full Name</span>
              }
              name="name"
              rules={[{ required: true, message: "Nama wajib diisi" }]}
            >
              <Input
                placeholder="Your Full Name"
                className="rounded-lg py-2.5 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all"
              />
            </Form.Item>

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
              rules={[{ required: true, message: "Password wajib diisi" }]}
            >
              <Input.Password
                placeholder="Create Password"
                className="rounded-lg py-2.5 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-semibold text-gray-700">
                  Confirm Password
                </span>
              }
              name="confirmPassword"
              rules={[{ required: true, message: "Konfirmasi password wajib" }]}
            >
              <Input.Password
                placeholder="Confirm Password"
                className="rounded-lg py-2.5 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all"
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={registerMutation.isPending}
                className="font-bold text-lg h-12 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 border-none transition-all"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Link ke Login */}
          <div className="text-center mt-4">
            <Text className="text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Log in
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

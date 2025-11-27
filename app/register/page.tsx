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
      { name, email, password, roleId: 3 },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);

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

  return (
    <div className="min-h-screen bg-[#8CA6FF] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="p-10 flex flex-col justify-center">
          <Title level={2} className="mb-6">Create Your Account</Title>

          {/* Google Sign Up */}
          <Button
            type="default"
            icon={<GoogleOutlined />}
            className="w-full mb-5 flex items-center justify-center gap-2"
          >
            Sign up with Google
          </Button>

          <Text type="secondary" className="block text-center mb-5">
            OR SIGN UP WITH EMAIL
          </Text>

          {/* FORM */}
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Nama wajib diisi" }]}
            >
              <Input placeholder="Your Full Name" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Email wajib diisi" },
                { type: "email", message: "Email tidak valid" },
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password wajib diisi" }]}
            >
              <Input.Password placeholder="Create Password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: "Konfirmasi password wajib" }]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                loading={registerMutation.isPending}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <Text className="mt-6 block text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Log in
            </a>
          </Text>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-full">
          <img
            src="/assets/register.jpg"
            alt="Register Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

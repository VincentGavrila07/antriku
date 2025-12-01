"use client";

import React from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { GoogleOutlined } from '@ant-design/icons';
import { usePermission } from "../context/permission-context";

const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const [errorMsg, setErrorMsg] = React.useState("");
  const { refreshPermissions } = usePermission(); // ambil refreshPermissions dari context

  const onFinish = (values: { email: string; password: string; remember: boolean }) => {
    setErrorMsg("");

    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: async (data) => {
          localStorage.setItem("token", data.token); 
          
          await refreshPermissions(); 

          router.push("/dashboard"); 
        },
        onError: (err: Error) => {
          setErrorMsg(err.message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#8CA6FF] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE - FORM */}
        <div className="p-10 flex flex-col justify-center">
          <Title level={2} className="mb-6">Welcome Back</Title>

          {/* Google Login */}
          <Button
            type="default"
            className="w-full mb-5 flex items-center justify-center gap-2"
            icon={<GoogleOutlined />}
          >
            Log in with Google
          </Button>

          <Text type="secondary" className="my-4 text-center block">OR LOGIN WITH EMAIL</Text>

          {errorMsg}

          <Form
            name="loginForm"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
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
              rules={[
                { required: true, message: "Password wajib diisi" },
                { min: 6, message: "Password minimal 6 karakter" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Keep me logged in</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loginMutation.isPending}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>

          <Text className="text-gray-600">
            Don’t have an account?{" "}
            <a className="text-blue-600 font-semibold hover:underline" href="/register">
              Sign up
            </a>
          </Text>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-10 text-center">
          <img
            src="/assets/register.jpg"
            alt="Illustration"
            className="w-72 mb-6"
          />

          <Title level={4} className="mb-2">Sleeknote Academy</Title>
          <Text type="secondary" className="text-sm mb-6">
            We’ve got tools and tips to keep your business growing while you rest.
          </Text>

          <Button className="border px-6 py-2 rounded-md hover:bg-gray-100">
            START ACADEMY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

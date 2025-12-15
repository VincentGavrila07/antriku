// File: app/forgot-password/page.tsx
"use client";

import { Form, Input, Button, message, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import AuthService from '@/services/AuthService'; 

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        setLoading(true);
        try {
            // Memanggil API /forgot-password
            await AuthService.forgotPassword(values.email);
            
            message.success('Tautan reset kata sandi telah dikirim ke alamat email Anda.');
            // Anda bisa tambahkan router.push('/login') di sini jika ingin langsung kembali ke login

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal mengirim tautan reset.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: 30, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Title level={3} style={{ textAlign: 'center' }}>
                Lupa Kata Sandi
            </Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
                Masukkan alamat email yang terdaftar untuk menerima tautan reset.
            </Text>
            
            <Form 
                onFinish={onFinish} 
                layout="vertical"
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Masukkan email yang valid!' }]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Masukkan email Anda" />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        block
                        loading={loading}
                    >
                        Kirim Tautan Reset
                    </Button>
                </Form.Item>

                <Button type="link" onClick={() => router.push('/login')} style={{ width: '100%', marginTop: 10 }}>
                    Kembali ke Login
                </Button>
            </Form>
        </div>
    );
}
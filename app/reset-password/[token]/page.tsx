// File: app/reset-password/[token]/page.tsx
"use client";
import { Form, Input, Button, message, Typography, Alert } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import AuthService from '@/services/AuthService'; 

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
    // Mengambil token dari path parameter (/[token]/page.tsx)
    const params = useParams(); 
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Pastikan token diambil dari 'token'
    const resetToken = Array.isArray(params.token) ? params.token[0] : params.token || '';

    // Values mengandung { email, new_password, confirm_password }
    const onFinish = async (values: { email: string; new_password: string; confirm_password: string; }) => {
        if (!resetToken) {
            message.error('Token reset tidak ditemukan. Silakan coba mengakses dari tautan email Anda.');
            return;
        }
        
        setLoading(true);
        try {
            // Memanggil AuthService.resetPassword dengan 4 parameter 
            await AuthService.resetPassword(
                values.email, 
                resetToken, 
                values.new_password,
                values.confirm_password
            );
            
            message.success('Kata sandi berhasil diperbarui! Anda akan diarahkan ke halaman login.');
            router.push('/login'); 
            
        } catch (error:unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal mereset kata sandi. Coba lagi.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!resetToken) {
        return (
             <div style={{ padding: 20 }}>
                <Alert
                    message="Kesalahan Tautan"
                    description="Tautan reset tidak valid. Pastikan Anda mengklik tautan lengkap dari email Anda."
                    type="error"
                    showIcon
                />
                <Button 
                    type="default" 
                    onClick={() => router.push('/forgot-password')} 
                    style={{ marginTop: 20 }}
                >
                    Minta Tautan Reset Baru
                </Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 450, margin: '50px auto', padding: 30, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
                <LockOutlined style={{ marginRight: 10 }} /> Atur Kata Sandi Baru
            </Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
                Masukkan email terdaftar dan kata sandi baru Anda.
            </Text>
            
            <Form 
                onFinish={onFinish} 
                layout="vertical"
            >
                <Form.Item
                    name="email"
                    label="Email Terdaftar"
                    rules={[{ required: true, type: 'email', message: 'Masukkan email yang terdaftar!' }]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Masukkan email Anda" />
                </Form.Item>

                <Form.Item
                    name="new_password" // PENTING: Sesuai validasi Laravel
                    label="Kata Sandi Baru"
                    rules={[{ required: true, message: 'Wajib diisi.' }, { min: 6, message: 'Minimal 6 karakter.' }]}
                >
                    <Input.Password placeholder="Masukkan kata sandi baru" />
                </Form.Item>

                <Form.Item
                    name="confirm_password" // PENTING: Sesuai validasi Laravel
                    label="Konfirmasi Kata Sandi Baru"
                    dependencies={['new_password']}
                    hasFeedback
                    rules={[
                         { required: true, message: 'Mohon konfirmasi kata sandi Anda.' },
                         ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Kata sandi konfirmasi tidak cocok!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Ulangi kata sandi baru" />
                </Form.Item>

                <Form.Item style={{ marginTop: 30 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        block
                        loading={loading}
                        icon={<LockOutlined />}
                    >
                        Ubah Kata Sandi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
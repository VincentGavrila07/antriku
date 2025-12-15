
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

const AuthService = {

    forgotPassword: async (email: string) => { 
        try {
            const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Permintaan reset gagal. Cek kembali email.');
            }
            throw new Error('Terjadi kesalahan jaringan.');
        }
    },

    resetPassword: async (email: string, token: string, newPassword: string, confirmPassword: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/reset-password`, { 
                email,
                token, 
                new_password: newPassword, 
                confirm_password: confirmPassword 
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Reset kata sandi gagal. Tautan mungkin kedaluwarsa.');
            }
            throw new Error('Terjadi kesalahan jaringan.');
        }
    },
};

export default AuthService;
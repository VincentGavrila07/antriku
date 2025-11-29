"use client";

import { LockOutlined } from "@ant-design/icons";
export default function Forbidden() {
    return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-5">
                <div className="bg-red-100 text-red-600 p-6 rounded-full shadow-md mb-6">
                    <LockOutlined className="text-6xl" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                    403 | Forbidden
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                    Jika menurut Anda ini adalah kesalahan, silakan hubungi
                    administrator.
                </p>
            </div>
    );
}

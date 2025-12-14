"use client";

import Sidebar from "../components/sidebar";
import UserService from "@/services/UserService";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import Loading from "../components/loading";
import dayjs from "dayjs"; 

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        UserService.getMe(token)
            .then((res) => setUser(res))
            .catch(() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const today = dayjs().format("dddd, MMMM D, YYYY");

    return (
        <div className="flex min-h-screen">
            <Sidebar roleId={user?.roleId ?? 0} />
            
            <div 
                className="flex-1 flex flex-col bg-gray-50 h-screen overflow-y-auto scrollbar-hide"
            >
                <header className="flex items-center justify-between p-6 bg-white shadow sticky top-0 z-10 shrink-0">
                    <h1 className="text-xl font-semibold">Hello, {user?.name}</h1>
                    <span className="text-gray-500">{today}</span>
                </header>
                
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
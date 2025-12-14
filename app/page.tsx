"use client";

import React from "react";
import Navbar from "./components/navbar";
import { useLanguage } from "./languange-context";
import {
  RocketOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  // --- KONTEN MULTI-BAHASA ---
  const content = {
    id: {
      tagline: "Sistem Antrian #1 Di Indonesia",
      heroTitle: "Antrian Tanpa Ribet,",
      heroTitleSpan: "Hidup Lebih Damai.",
      heroDesc:
        "Solusi manajemen antrian modern untuk bisnis dan pelanggan. Ambil nomor dari rumah, datang saat giliran tiba.",
      ctaLogin: "Login Sekarang",
      ctaRegister: "Register Sekarang",
      feature1Title: "Hemat Waktu",
      feature1Desc:
        "Tidak perlu menunggu berjam-jam di lokasi. Pantau estimasi waktu secara real-time.",
      feature2Title: "Monitoring Live",
      feature2Desc:
        "Lihat nomor antrian yang sedang berjalan langsung dari HP Anda.",
      feature3Title: "Aman & Terpercaya",
      feature3Desc:
        "Sistem yang stabil dan menjaga privasi data Anda dengan standar keamanan tinggi.",
      statsUser: "Pengguna Aktif",
      statsQueue: "Antrian Selesai",
      footerRights: "Hak Cipta Dilindungi.",
      readyTitle: "Siap Mengubah Cara Mengantri?",
      readyDesc:
        "Bergabunglah sekarang dan rasakan kemudahan layanan tanpa antri.",
    },
    en: {
      tagline: "#1 Queue Management System",
      heroTitle: "Queue Without Hassle,",
      heroTitleSpan: "Live Peacefully.",
      heroDesc:
        "Modern queue management solution for businesses and customers. Get your number from home, arrive when it's your turn.",
      ctaLogin: "Login Now",
      ctaRegister: "Register Now",
      feature1Title: "Save Time",
      feature1Desc:
        "No need to wait for hours at the location. Monitor estimated time in real-time.",
      feature2Title: "Live Monitoring",
      feature2Desc:
        "See the current serving queue number directly from your phone.",
      feature3Title: "Secure & Trusted",
      feature3Desc:
        "Stable system that protects your data privacy with high security standards.",
      statsUser: "Active Users",
      statsQueue: "Queues Completed",
      footerRights: "All Rights Reserved.",
      readyTitle: "Ready to Change How You Queue?",
      readyDesc: "Join now and experience the ease of service without queuing.",
    },
  };

  const t = lang === "en" ? content.en : content.id;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white pt-24 pb-32 overflow-hidden px-6">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
              <RocketOutlined /> {t.tagline}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
              {t.heroTitle} <br />
              <span className="text-blue-600">{t.heroTitleSpan}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              {t.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Tombol Login (Primary) */}
              <button
                onClick={() => router.push("/login")}
                className="group px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <LoginOutlined /> {t.ctaLogin}
                <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Tombol Register (Secondary) */}
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-4 rounded-xl bg-white text-gray-700 border border-gray-200 font-bold text-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserAddOutlined /> {t.ctaRegister}
              </button>
            </div>
          </div>
        </div>

        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-20 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl -z-0 pointer-events-none"></div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ClockCircleOutlined />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                {t.feature1Title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {t.feature1Desc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <RocketOutlined />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                {t.feature2Title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {t.feature2Desc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <SafetyCertificateOutlined />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                {t.feature3Title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {t.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Bagian Kiri: Logo & Deskripsi Singkat */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-lg font-bold text-blue-600">Antriku</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">
                  © 2025 All rights reserved.
                </span>
              </div>
            </div>
            {/* Bagian Kanan: Links */}
            <div className="flex flex-wrap justify-center gap-6 text-gray-600 font-medium text-sm">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                About Us
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Help Center
              </a>
              <a href="#" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

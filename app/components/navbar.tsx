"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../languange-context";
import Link from "next/link";
import Image from "next/image"; // Import ini jika nanti pakai logo gambar
import { RocketOutlined, GlobalOutlined } from "@ant-design/icons"; // Ikon placeholder logo

export default function Navbar() {
  const { lang, changeLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  // Efek agar navbar berubah style saat di-scroll (Opsional, biar makin keren)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-600/95 backdrop-blur-md shadow-lg py-3" // Saat discroll: Lebih padat & shadow
          : "bg-blue-600 py-5" // Saat di atas: Lebih renggang
      } text-white`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="relative h-10 w-40">
            {" "}
            <Image
              src="/assets/LogoAntriku2NoBG.png"
              alt="Logo Antriku"
              fill 
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* --- 2. BAGIAN LANGUAGE SWITCHER --- */}
        <div className="flex items-center bg-blue-800/40 p-1 rounded-full border border-blue-500/30 backdrop-blur-sm">
          <div className="px-3 text-blue-200">
            <GlobalOutlined />
          </div>

          <button
            onClick={() => changeLanguage("en")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform ${
              lang === "en"
                ? "bg-black text-blue-700 shadow-md scale-105"
                : "text-blue-100 hover:text-white hover:bg-blue-700/50"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => changeLanguage("id")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform ${
              lang === "id"
                ? "bg-black text-blue-700 shadow-md scale-105"
                : "text-blue-100 hover:text-white hover:bg-blue-700/50"
            }`}
          >
            ID
          </button>
        </div>
      </div>
    </nav>
  );
}

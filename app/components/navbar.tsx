"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../languange-context";
import Link from "next/link";
import Image from "next/image";
import { GlobalOutlined } from "@ant-design/icons";

export default function Navbar() {
  const { lang, changeLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

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
          ? "bg-blue-600/95 backdrop-blur-md shadow-lg py-3"
          : "bg-blue-600 py-4"
      } text-white border-b border-blue-500/20`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center group cursor-pointer gap-3">
          <div className="flex flex-col justify-center pl-1">
            {" "}
            <span className="text-[10px] text-blue-200 uppercase tracking-widest leading-none mb-1">
              Powered by
            </span>
            <div className="relative h-6 w-28 opacity-90 group-hover:opacity-100 transition-opacity scale-150">
              <Image
                src="/assets/LogoAntriku3NoBG.png"
                alt="Powered by Antriku"
                fill
                className="object-contain object-left invert"
                priority
              />
            </div>
          </div>
        </Link>

        {/* --- BAGIAN LANGUAGE SWITCHER (Tetap Sama) --- */}
        <div className="flex items-center bg-blue-800/40 p-1 rounded-full border border-blue-500/30 backdrop-blur-sm">
          <div className="px-3 text-blue-200">
            <GlobalOutlined />
          </div>

          <button
            onClick={() => changeLanguage("en")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform ${
              lang === "en"
                ? "bg-blue-600 text-blue-700 shadow-md scale-105"
                : "text-blue-100 hover:text-white hover:bg-blue-700/50"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => changeLanguage("id")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform ${
              lang === "id"
                ? "bg-blue-600 text-blue-700 shadow-md scale-105"
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

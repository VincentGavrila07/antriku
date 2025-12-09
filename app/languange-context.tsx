"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface Translations {
  Sidebar: {
    appName: string;
    adminDashboard: string;
    userManagement: string;
    user:string;
    role:string;
    permission:string;
    reports: string;
    staffDashboard: string;
    orders: string;
    myDashboard: string;
    profile: string;
    logout: string;
  };
  welcome:{
    welcome:string;
  }
  
}

interface LanguageContextType {
  lang: string;
  translations: Translations | null;
  loading: boolean;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<string>("en");
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTranslations = async (selectedLang: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/translations?lang=${selectedLang}`
      );
      const data = await res.json();

      setTranslations(data);
      localStorage.setItem("translations", JSON.stringify(data));
      localStorage.setItem("lang", selectedLang);

    } catch (err) {
      console.error("Error fetch translations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load first time from storage
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    const storedTranslations = localStorage.getItem("translations");

    setLang(storedLang);

    if (storedTranslations) {
      setTranslations(JSON.parse(storedTranslations));
      setLoading(false);
    } else {
      fetchTranslations(storedLang);
    }
  }, []);

  // Fetch only when language actually changed
  useEffect(() => {
    const stored = localStorage.getItem("translations");
    if (!stored || JSON.parse(stored).lang !== lang) {
      fetchTranslations(lang);
    }
  }, [lang]);

  const changeLanguage = (newLang: string) => {
    if (newLang !== lang) {
      setLoading(true);
      setLang(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, translations, loading, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be in provider");
  return ctx;
};

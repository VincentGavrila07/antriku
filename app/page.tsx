"use client";
import { useLanguage } from "./languange-context";

export default function Navbar() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">Antriku</div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => changeLanguage("en")} 
            className={`px-4 py-2 rounded-lg ${lang === "en" ? "bg-blue-500" : "bg-blue-700"}`}>
            English Tes Farhan
          </button>
          <button 
            onClick={() => changeLanguage("id")} 
            className={`px-4 py-2 rounded-lg ${lang === "id" ? "bg-blue-500" : "bg-blue-700"}`}>
            Bahasa Tes
          </button>
        </div>
      </div>  
    </nav>
  );
}

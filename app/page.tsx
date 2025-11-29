"use client";
import { useLanguage } from "./languange-context";

export default function Home() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <div className="">
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("id")}>Bahasa</button>

      <div>Current lang: {lang}</div>
      Landing
    </div>
  );
}

"use client";

import { useLanguage } from "./LanguageContext";
import DropdownMenu from "../form/DropdownMenu";

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  const options = [
    { value: "fr", label: "FR" },
    { value: "en", label: "EN" },
  ];

  return <DropdownMenu options={options} selected={language} onChange={changeLanguage} />;
}

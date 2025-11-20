"use client";

import { useState, useEffect } from "react";
import DropdownMenu from "../form/DropdownMenu";
import { useLanguage } from "../param/LanguageContext";

const DarkLightToggle = () => {
  const [theme, setTheme] = useState("system");
  const { t } = useLanguage();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const options = [
    { value: "light", label: t("light") },
    { value: "system", label: t("system") },
    { value: "dark", label: t("dark") },
  ];

  return <DropdownMenu options={options} selected={theme} onChange={handleChange} />;
};

export default DarkLightToggle;
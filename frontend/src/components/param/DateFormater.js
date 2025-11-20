import { useLanguage } from "./LanguageContext";


const getLocaleOptions = (lang) => {
  if (lang === "fr") {
    return {
      locale: "fr-FR",
      options: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    };
  }

  return {
    locale: "en-US",
    options: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };
};

export default function DateFormater({ time }) {
    const { language } = useLanguage();
    const { locale, options } = getLocaleOptions(language);

    const cleanedTime = time.replace(/[^0-9T:\.\-Z]/g, "");
    const parsedTime = new Date(cleanedTime);

    if (isNaN(parsedTime)) {
        return <span>Date invalide</span>;
    }

    const formattedTime = parsedTime.toLocaleString(locale, options);
    return <span>{formattedTime}</span>;
}

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

const storageKey = "steamvibe.language";
let language = "vi";
try {
  const saved = localStorage.getItem(storageKey);
  if (saved === "vi" || saved === "en") language = saved;
} catch { /* Language switching still works when browser storage is unavailable. */ }

i18n.use(initReactI18next).init({
  resources: { vi: { translation: vi }, en: { translation: en } },
  lng: language,
  fallbackLng: "vi",
  supportedLngs: ["vi", "en"],
  interpolation: { escapeValue: false },
});

function persistLanguage(value) {
  document.documentElement.lang = value;
  try { localStorage.setItem(storageKey, value); } catch { /* Keep the in-memory choice. */ }
}
persistLanguage(language);
i18n.on("languageChanged", persistLanguage);

export default i18n;

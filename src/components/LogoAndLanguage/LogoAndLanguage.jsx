import "../LanguageSelect/LanguageSelect.css";
import "./LogoAndLanguage.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LogoAndLanguage() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const selected = i18n.resolvedLanguage || "vi";

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const selectOption = (option) => {
    i18n.changeLanguage(option);
    setIsOpen(false);
  };

  return (
    <div className="login-header">
      <img src="/images/logo/Logo.png" alt="SteamViBe" />
      <div className="language-select" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false); }}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="login-language-options"
          aria-label={t("language.label")}
          className="flex items-center justify-between language-select__selected"
          onClick={toggleMenu}
        >
          <span>{t(`language.${selected}`)}</span>
          <img
            className="w-[20px]"
            src="/images/logo-header/flight_4919659.png"
            alt=""
          />
        </button>

        {isOpen && (
          <ul id="login-language-options" className="language-select__options">
            <li><button type="button" lang="vi" aria-pressed={selected === "vi"} onClick={() => selectOption("vi")}>Tiếng Việt</button></li>
            <li><button type="button" lang="en" aria-pressed={selected === "en"} onClick={() => selectOption("en")}>English</button></li>
          </ul>
        )}
      </div>
    </div>
  );
}

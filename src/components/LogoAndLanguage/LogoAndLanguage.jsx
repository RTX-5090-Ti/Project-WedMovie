import "../LanguageSelect/LanguageSelect.css";
import "./LogoAndLanguage.css";
import { useState } from "react";

export default function LogoAndLanguage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("English");

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const selectOption = (option) => {
    setSelected(option);
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
          aria-label="Language"
          className="flex items-center justify-between language-select__selected"
          onClick={toggleMenu}
        >
          <span>{selected}</span>
          <img
            className="w-[20px]"
            src="/images/logo-header/flight_4919659.png"
            alt="world"
          />
        </button>

        {isOpen && (
          <ul id="login-language-options" className="language-select__options">
            <li><button type="button" onClick={() => selectOption("English")}>English</button></li>
            <li><button type="button" onClick={() => selectOption("Vietnamese")}>Vietnamese</button></li>
          </ul>
        )}
      </div>
    </div>
  );
}

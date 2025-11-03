import "./Logo&Languge.css";
import { useState } from "react";

export default function LogoAndLanguge() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("English");

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const selectOption = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="head">
      <img src="/images/logo/Logo.png" alt="" />
      <div className="custom-select">
        <div
          className="flex items-center justify-between selected"
          onClick={toggleMenu}
        >
          <span>{selected}</span>
          <img
            className="w-[20px]"
            src="/images/logo-header/flight_4919659.png"
            alt="world"
          />
        </div>

        {isOpen && (
          <ul className="options">
            <li onClick={() => selectOption("English")}>English</li>
            <li onClick={() => selectOption("Vietnamese")}>Vietnamese</li>
          </ul>
        )}
      </div>
    </div>
  );
}

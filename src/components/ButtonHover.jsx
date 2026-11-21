import { useTranslation } from "react-i18next";
export default function ButtonHover({ onClick }) {
  const { t } = useTranslation();
  return (
    <button type="button" aria-label={t("movie.more")}
      onClick={onClick}
      className="more-button group relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full border border-white/10 text-white transition-all duration-300 hover:w-[140px] hover:bg-white/10 cursor-pointer"
    >
      <span className="absolute text-sm font-medium text-yellow-400 transition-all duration-300 opacity-0 left-5 whitespace-nowrap group-hover:opacity-100">
        {t("movie.more")}
      </span>
      <i className="fa-solid fa-chevron-right text-sm transition-all duration-300 group-hover:text-yellow-400 group-hover:translate-x-[45px]"></i>
    </button>
  );
}

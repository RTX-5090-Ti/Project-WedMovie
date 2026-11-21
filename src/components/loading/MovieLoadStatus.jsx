import { useTranslation } from "react-i18next";
export default function MovieLoadStatus({ loading, error, retry }) {
  const { t } = useTranslation();
  if (loading) return <p role="status" className="p-4 text-white/70">{t("movie.loading")}</p>;
  if (!error) return null;
  return (
    <div role="alert" className="p-4 text-white bg-[#192026] rounded-lg">
      <p>{t("movie.loadError")}</p>
      <button type="button" onClick={retry} className="px-4 py-2 mt-2 text-black bg-yellow-400 rounded-lg cursor-pointer">
        {t("movie.retry")}
      </button>
    </div>
  );
}

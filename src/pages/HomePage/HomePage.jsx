import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import ContentMovie from "../../components/Content/ContentMovie.jsx";
import HomeRowMovie from "../../components/MenuMovie/HomeRowMovie";
import Top10Movies from "../../components/Top10Movie/Top10Movies";
import FeatureRowMovies from "../../components/FeatureRow/FeatureRowMovies";
import AnimeShowcaseMovies from "../../components/AnimeShowcase/AnimeShowcaseMovies";
import GenreRowMovie from "../../components/MenuMovie/GenreRowMovie.jsx";
import Footer from "../../components/Footer/FooterMovie";
import WatchedRow from "../../components/MenuMovie/WatchedRow.jsx";

import "./HomePage.css";

export default function HomePage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = t("home.pageTitle"); }, [t]);
  return (
    <div className="home-page">
      <HeaderPage />
      <ContentMovie />
      <HomeRowMovie titleName={t("home.new")} />
      <WatchedRow titleName={t("home.watched")} />
      <Top10Movies />
      <FeatureRowMovies />
      <AnimeShowcaseMovies />
      <GenreRowMovie titleName={t("home.comedy")} genre="Hài hước" />
      <GenreRowMovie titleName={t("home.horror")} genre="Kinh dị" />
      <Footer />
    </div>
  );
}

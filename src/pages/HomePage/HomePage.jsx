import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import ContentMovie from "../../components/Content/ContentMovie.jsx";
import HomeRowMovie from "../../components/MenuMovie/HomeRowMovie";
import Top10Movies from "../../components/Top10Movie/Top10Movies";
import FeatureRowMovies from "../../components/FeatureRow/FeatureRowMovies";
import AnimeShowcaseMovies from "../../components/AnimeShowcase/AnimeShowcaseMovies";
import GenreRowMovie from "../../components/MenuMovie/GenreRowMovie.jsx";
import Footer from "../../components/Footer/FooterMovie";
import WatchedRow from "../../components/MenuMovie/WatchedRow.jsx";

export default function HomePage() {
  return (
    <>
      <HeaderPage />
      <ContentMovie />
      <HomeRowMovie titleName="Phim Điện Ảnh Mối Toanh" />
      <WatchedRow titleName="Phim Đã Xem" />
      <Top10Movies />
      <FeatureRowMovies />
      <AnimeShowcaseMovies />
      <GenreRowMovie titleName="Phim Hài Cười Mệt" genre="Hài hước" />
      <GenreRowMovie titleName="Phim Kinh Dị Nổi Da Gà" genre="Kinh dị" />
      <Footer />
    </>
  );
}

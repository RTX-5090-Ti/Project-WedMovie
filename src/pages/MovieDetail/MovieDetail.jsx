import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import MovieDetailContent from "../../components/MovieDetailContent";

export default function MovieDetail() {
  return (
    <>
      <div className="relative w-full ">
        <div className="absolute left-0 right-0 top-0 z-30  h-[150px] bg-gradient-to-b from-black/80 to-[rgba(0,0,0,0.0)]"></div>
        <HeaderPage />
      </div>
      <MovieDetailContent />
    </>
  );
}

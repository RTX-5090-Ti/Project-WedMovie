import { useLocation } from "react-router-dom";
import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import ShowNewMovie from "../../components/ShowNewMovie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AllMoviesClick() {
  const { state } = useLocation(); // { title, mode }
  const navigate = useNavigate();
  useEffect(() => {
    if (state?.title) document.title = state.title;
    else document.title = "Danh sách";
  }, [state?.title]);
  return (
    <>
      <HeaderPage />
      <ShowNewMovie
        title={state?.title || "Danh sách"}
        movies={state?.movies || []}
        onTitleClick={(id) => navigate(`/movie/${id}`)}
      />
    </>
  );
}

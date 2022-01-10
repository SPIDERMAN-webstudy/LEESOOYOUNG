import { useEffect, useState } from "react";
import Movie from "../components/movie";
import styles from "../css/home.module.css";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);
  const [hide, setHide] = useState(true);
  const sortbyYear = () => {
    setSort("year");
  };
  const sortbyRate = () => {
    setSort("rating");
  };
  const sortbyDownloads = () => {
    setSort("download_count");
  };
  const sortbyLikes = () => {
    setSort("like_count");
  };
  const getMovies = async () => {
    const json = await (
      await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=0.1&sort_by=${sort}&limit=20&page=1`
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
  };
  const infiniteMovies = async () => {
    const json = await (
      await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=0.1&sort_by=${sort}&limit=20&page=${page}`
      )
    ).json();
    setMovies(movies.concat(json.data.movies));
  };
  useEffect(() => {
    getMovies();
    setLoading(true);
  }, [sort]);
  const handleScroll = () => {
    setScrollTop(document.documentElement.scrollTop);
    const scrollHeight = document.documentElement.scrollHeight - 10;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop > 200) {
      setHide(false);
    } else {
      setHide(true);
    }
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((page) => page + 1);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  useEffect(() => {
    infiniteMovies();
  }, [page]);
  const scrolltoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <h1>SOOFLIX</h1>
        </div>
      ) : (
        <div>
          {hide ? null : (
            <button className={styles.top} onClick={scrolltoTop}>
              TOP
            </button>
          )}
          <header className={styles.bar}>
            <h1 className={styles.logo}>SOOFLIX</h1>
            <nav className={styles.navi}>
              <div className={styles.sort}>
                <span id={styles.sortType2} onClick={sortbyYear}>
                  &emsp;📅Recent&emsp;
                </span>
                <span id={styles.sortType1} onClick={sortbyRate}>
                  &emsp;💯High Rating&emsp;
                </span>
                <span id={styles.sortType2} onClick={sortbyDownloads}>
                  &emsp;⬇️Most Downloads&emsp;
                </span>
                <span id={styles.sortType2} onClick={sortbyLikes}>
                  &emsp;👍Most Likes&emsp;
                </span>
              </div>
            </nav>
          </header>
          <div className={styles.movies}>
            {movies.map((movie) => (
              <Movie
                key={movie.id}
                id={movie.id}
                year={movie.year}
                rating={movie.rating}
                medium_cover_image={movie.medium_cover_image}
                title={movie.title}
                summary={movie.summary}
                genres={movie.genres}
              />
            ))}
          </div>
          <h1 className={styles.wait}>More movies coming... Wait for me!</h1>
        </div>
      )}
    </div>
  );
}

export default Home;

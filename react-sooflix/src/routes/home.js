import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Movie from "../components/movie";
import styles from "../css/home.module.css";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState("ID");
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
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=0.1&sort_by=${sort}`
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
  };
  useEffect(() => {
    getMovies();
    setLoading(true);
  }, [sort]);
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <h1>SOOFLIX</h1>
        </div>
      ) : (
        <div>
          <header className={styles.bar}>
            <h1 className={styles.logo}>SOOFLIX</h1>
            <nav className={styles.navi}>
              <div className={styles.sort}>
                <span id={styles.recent} onClick={sortbyYear}>
                  &emsp;📅Recent&emsp;
                </span>
                <span id={styles.rating} onClick={sortbyRate}>
                  &emsp;💯High Rating&emsp;
                </span>
                <span id={styles.download} onClick={sortbyDownloads}>
                  &emsp;⬇️Most Downloads&emsp;
                </span>
                <span id={styles.like} onClick={sortbyLikes}>
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
        </div>
      )}
    </div>
  );
}

export default Home;

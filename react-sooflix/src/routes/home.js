import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Movie from "../components/movie";
import styles from "../css/home.module.css";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovies = async () => {
    const json = await (
      await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=0.1&sort_by=like_count`
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
  };
  useEffect(() => {
    getMovies();
  }, []);
  console.log(movies);
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <h1>SOOFLIX</h1>
        </div>
      ) : (
        <div>
          <nav className={styles.logo}>
            <h1>
              <Link id={styles.back} to={`${process.env.PUBLIC_URL}/`}>
                SOOFLIX
              </Link>
            </h1>
          </nav>
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

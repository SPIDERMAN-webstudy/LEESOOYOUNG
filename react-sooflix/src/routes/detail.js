import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import styles from "../css/detail.module.css";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState();
  const { id } = useParams();
  const getMovies = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    setMovies(json.data.movie);
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
          <h1>
            <Link id={styles.back} to={`${process.env.PUBLIC_URL}/`}>
              SOOFLIX
            </Link>
          </h1>
          <div className={styles.movie}>
            <img
              className={styles.img}
              src={movies.medium_cover_image}
              alt={movies.title}
            />
            <div className={styles.detail}>
              <h2 className={styles.title}>{movies.title}</h2>
              <h2 className={styles.rate}>⭐ {movies.rating}</h2>
              <h2 className={styles.rate}>👍 {movies.like_count}</h2>
              <h2 className={styles.rate}>
                ⬇️{" "}
                {movies.download_count
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h2>
              <h2 className={styles.year}>{movies.year}</h2>
              <ul className={styles.genres}>
                {movies.genres.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {movies.yt_trailer_code !== "" ? (
              <div className={styles.Youtube}>
                <iframe
                  width="900"
                  height="600"
                  src={`https://www.youtube.com/embed/${movies.yt_trailer_code}`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;

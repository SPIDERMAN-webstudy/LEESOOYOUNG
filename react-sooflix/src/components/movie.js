import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "../css/movie.module.css";

function Movie({
  id,
  medium_cover_image,
  rating,
  title,
  summary,
  genres,
  year,
}) {
  return (
    <div className={styles.movie}>
      <Link to={`/movie/${id}`}>
        <img className={styles.img} src={medium_cover_image} alt={title} />
      </Link>
      <div>
        <h2 className={styles.title}>
          <Link to={`/movie/${id}`}>{title}</Link>
        </h2>
        <p>{summary.length > 235 ? `${summary.slice(0, 235)}...` : summary}</p>
        <h3 className={styles.rating}>⭐ {rating} / 10</h3>
        <h3 className={styles.year}>{year}</h3>
      </div>
    </div>
  );
}

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  medium_cover_image: PropTypes.string.isRequired,
  download_count: PropTypes.number.isRequired,
  like_count: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movie;

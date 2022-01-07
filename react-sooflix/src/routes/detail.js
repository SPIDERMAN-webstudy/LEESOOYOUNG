import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Detail() {
  const [movies, setMovies] = useState();
  const { id } = useParams();
  const getMovies = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    setMovies(json.data.movie);
  };
  useEffect(() => {
    getMovies();
  }, []);
  console.log(movies);
  return <h1>Detail</h1>;
}

export default Detail;

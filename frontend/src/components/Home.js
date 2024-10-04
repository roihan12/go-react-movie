import { Link } from "react-router-dom";
import TicketImg from "./../images/movie_tickets.jpg";

const Home = () => {
  return (
    <div className="text-center">
      <h2>Find a movie to watch tonight!</h2>
      <hr />
      <Link to={"/movies"}>
        <img src={TicketImg} alt="movie-tickets" />
      </Link>
    </div>
  );
};

export default Home;

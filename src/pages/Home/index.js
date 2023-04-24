import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apicalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

function Home() {
  const [searchText = "", setSearchText] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-6">
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search for movies"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
           {/*  <button
              className="btn btn-outline-primary"
              type="button"
              id="button-addon2"
            >
              Search
            </button> */}
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-4">
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <div className="col-md-4 col-lg-3 mb-4" key={movie._id}>
              <div
                className="card h-100 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
                  )
                }
              >
                <img
                  src={movie.poster}
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;

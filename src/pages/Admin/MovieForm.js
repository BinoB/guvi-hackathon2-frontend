import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { AddMovie, UpdateMovie } from "../../apicalls/movies";
import moment from "moment";
import { toast } from "react-toastify";

const defaultFormData = {
  title: "",
  description: "",
  duration: "",
  language: "",
  releaseDate: "",
  genre: "",
  poster: "",
};

function MovieForm({
  showMovieFormModal,
  setShowMovieFormModal,
  selectedMovie,
  getData,
  formType,
}) {
  const [formData, setFormData] = useState(
    selectedMovie || { ...defaultFormData }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedMovie) {
      setFormData(selectedMovie);
    } else {
      setFormData(defaultFormData);
    }
  }, [selectedMovie]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(ShowLoading());

      let response = null;
      if (formType === "add") {
        response = await AddMovie(formData);
      } else {
        response = await UpdateMovie({
          ...formData,
          movieId: formData._id,
        });
      }

      if (response.success) {
        getData();
        toast.success(response.message);
        setFormData(defaultFormData);
        setShowMovieFormModal(false);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setShowMovieFormModal(false);
  };

  return (
    <div className="p-5 my-2 col-md-3 algin-item-center" style={{ display: showMovieFormModal ? "block" : "none" }}>
      <div className="text-center"><h2>{formType === "add" ? "ADD MOVIE" : "EDIT MOVIE"}</h2></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Movie Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="description">Movie Description</label>
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="duration">Movie Duration (Min)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="language">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
          >
            <option value="">Select Language</option>
            <option value="Telugu">Telugu</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>
        <div>
          <label htmlFor="releaseDate">Movie Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={moment(formData.releaseDate).format("YYYY-MM-DD")}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="genre">Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
          >
            <option value="">Select Genre</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Thriller">Thriller</option>
          </select>
        </div>
        <div>
          <label htmlFor="poster">Movie Poster URL</label>
          <input
            type="text"
            name="poster"
            value={formData.poster}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary my-3 mr-2" type="submit">{formType === "add" ? "ADD" : "UPDATE"}</button>
        <button className="btn btn-secondary" onClick={handleCancel}>CANCEL</button>
      </form>
    </div>
  );
}

export default MovieForm;

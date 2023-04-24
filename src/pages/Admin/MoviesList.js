import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import MovieForm from "./MovieForm";
import moment from "moment";
import { DeleteMovie, GetAllMovies } from "../../apicalls/movies";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";


function MoviesList() {
  const [movies, setMovies] = React.useState([]);
  
  const dispatch = useDispatch();
  const [showMovieFormModal, setShowMovieFormModal] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [formType, setFormType] = React.useState("add");

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await (GetAllMovies());
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
  };


  const handleDelete = async (movieId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteMovie({
        movieId,
      });
      if (response.success) {
        toast.success(response.message);
        getData();
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };
  

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => {
        return (
          <img
            src={record.poster}
            alt="poster"
            height="60"
            width="80"
            className="br-1"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "title",
    },

    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, record) => {
        return moment(record.releaseDate).format("DD-MM-YYYY");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedMovie(record);
                setFormType("edit");
                setShowMovieFormModal(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];


  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-1 text-dark ">
        <button
          title="Add Movie"
          className="btn btn-primary rounded-pill"
          variant="outlined"
          onClick={() => {
            setShowMovieFormModal(true);
            setFormType("add");
          }}
        >Add Movie</button>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left font-bold bg-gray-200 text-gray-700"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              {columns.map((column, index) => (
                <td key={index} className="border px-4 py-2">
                  {column.render ? (
                    column.render(movie[column.dataIndex], movie)
                  ) : (
                    movie[column.dataIndex]
                    )}
                    </td>
                    ))}
                    </tr>
                    ))}
                    </tbody>
                    </table>
                      <MovieForm
    showMovieFormModal={showMovieFormModal}
    setShowMovieFormModal={setShowMovieFormModal}
    selectedMovie={selectedMovie}
    setSelectedMovie={setSelectedMovie}
    formType={formType}
    getData={getData}
  />
</div>
);
}

export default MoviesList;









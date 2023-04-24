import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { GetAllMovies } from "../../../apicalls/movies";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loadersSlice";
import {
  AddShow,
  DeleteShow,
  GetAllShowsByTheatre,
} from "../../../apicalls/theatres";
import moment from "moment";
import { toast } from "react-toastify";

const initialFormData = {
  name: "",
  date: "",
  time: "",
  movie: "",
  ticketPrice: "",
  totalSeats: "",
};

function Shows({ openShowsModal, setOpenShowsModal, theatre }) {
  const [view, setView] = useState("table");
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const moviesResponse = await GetAllMovies();
      if (moviesResponse.success) {
        setMovies(moviesResponse.data);
      } else {
        toast.error(moviesResponse.message);
      }

      const showsResponse = await GetAllShowsByTheatre({
        theatreId: theatre._id,
      });
      if (showsResponse.success) {
        setShows(showsResponse.data);
      } else {
        toast.error(showsResponse.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoading());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(ShowLoading());
      const response = await AddShow({
        ...formData,
        theatre: theatre._id,
      });
      if (response.success) {
        toast.success(response.message);
        getData();
        setView("table");
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoading());
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteShow({ showId: id });

      if (response.success) {
        toast.success(response.message);
        getData();
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoading());
    }
  };


  const columns = [
    {
      title: "Show Name",
      dataIndex: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(text).format("MMM Do YYYY");
      },
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (text, record) => {
        return record.movie.title;
      },
    },
    {
      title: "Ticket Price",
      dataIndex: "ticketPrice",
    },
    {
      title: "Total Seats",
      dataIndex: "totalSeats",
    },
    {
      title: "Available Seats",
      dataIndex: "availableSeats",
      render: (text, record) => {
        return record.totalSeats - record.bookedSeats.length;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            {record.bookedSeats.length === 0 && (
              <i
                className="ri-delete-bin-line"
                onClick={() => {
                  handleDelete(record._id);
                }}
              ></i>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-5 my-2 col-md-3 algin-item-center">
      <div
      className="model"
      title=""
      open={openShowsModal}
      onCancel={() => setOpenShowsModal(false)}
      width={1400}
      footer={null}
    >
      <h1 className="text-primary text-md uppercase mb-1">
        Theatre : {theatre.name}
      </h1>
      <hr />

      <div className="flex justify-between mt-1 mb-1 items-center">
        <h1 className="text-md uppercase">
          {view === "table" ? "Shows" : "Add Show"}
        </h1>
        {view === "table" && (
          <button
            class="btn btn-outline-primary"
            title="Add Show"
            onClick={() => {
              setView("form");
            }}
          >
            Add Show
          </button>
        )}
      </div>

      {view === "table" && <Table columns={columns} dataSource={shows} />}

      {view === "form" && (
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor="title">Show Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="title">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label htmlFor="title">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="title">Movie</label>
              <select
                name="movie"
                value={formData.movie}
                onChange={handleInputChange}
              >
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="title">Ticket Price</label>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="title">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end gap-1 my-2">
              <button
                class="btn btn-outline-secondary"
                title="Cancel"
                oonClick={() => {
                  setView("table");
                }}
              >
                Cancel
              </button>

              <button class="btn btn-primary" type="submit" title="SAVE">
                SAVE
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
    </div>
  );
}

export default Shows;

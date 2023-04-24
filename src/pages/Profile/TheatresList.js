import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TheatreForm from "./TheatreForm";
import {
  DeleteTheatre,
  
  GetAllTheatresByOwner,
} from "../../apicalls/theatres";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { toast } from "react-toastify";
import Shows from "./Shows";

function TheatresList() {
  const { user } = useSelector((state) => state.users);
  const [showTheatreFormModal, setShowTheatreFormModal] = useState(false);
const [selectedTheatre = null, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState([]);
  const [openShowsModal, setOpenShowsModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatresByOwner({
        owner: user._id,
      });
      if (response.success) {
        setTheatres(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({ theatreId: id });
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-1">
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={() => {
            setFormType("add");
            setShowTheatreFormModal(true);
          }}
        >
          Add Theatre
        </button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {theatres.map((theatre) => (
            <tr key={theatre._id}>
              <td>{theatre.name}</td>
              <td>{theatre.address}</td>
              <td>{theatre.phone}</td>
              <td>{theatre.email}</td>
              <td>
                {theatre.isActive ? (
                  <span className="badge bg-success">Approved</span>
                ) : (
                  <span className="badge bg-warning text-dark">
                    Pending / Blocked
                  </span>
                )}
              </td>
              <td>
                <div className="d-flex gap-1 align-items-center">
                  <i
                    className="ri-delete-bin-line cursor-pointer"
                    onClick={() => handleDelete(theatre._id)}
                  ></i>
                  <i
                    className="ri-pencil-line cursor-pointer"
                    onClick={() => {
                      setFormType("edit");
                      setSelectedTheatre(theatre);
                      setShowTheatreFormModal(true);
                    }}
                  ></i>
                  {theatre.isActive && (
                    <span
                      className="underline cursor-pointer"
                      onClick={() => {
                        setSelectedTheatre(theatre);
                        setOpenShowsModal(true);
                      }}
                    >
                      Shows
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showTheatreFormModal && (
        <TheatreForm
          showTheatreFormModal={showTheatreFormModal}
          setShowTheatreFormModal={setShowTheatreFormModal}
          formType={formType}
          setFormType={setFormType}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}

      {openShowsModal && (
        <Shows
          openShowsModal={openShowsModal}
          setOpenShowsModal={setOpenShowsModal}
          theatre={selectedTheatre}
        />
      )}
    </div>
  );
}
export default TheatresList;

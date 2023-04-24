import React, { useEffect, useState, useCallback } from "react";
import { GetAllTheatres, UpdateTheatre } from "../../apicalls/theatres";
import { useDispatch,  } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { toast } from "react-toastify";

function TheatresList() {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatres();
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
  }, [dispatch]);

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(ShowLoading());
      const response = await UpdateTheatre({
        theatreId: theatre._id,
        ...theatre,
        isActive: !theatre.isActive,
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
  
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Phone</th>
            <th scope="col">Email</th>
            <th scope="col">Owner</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {theatres.map((theatre) => (
            <tr key={theatre._id}>
              <td>{theatre.name}</td>
              <td>{theatre.address}</td>
              <td>{theatre.phone}</td>
              <td>{theatre.email}</td>
              <td>{theatre.owner.name}</td>
              <td>{theatre.isActive ? "Approved" : "Pending / Blocked"}</td>
              <td>
                {theatre.isActive ? (
                  <span
                    className="underline"
                    onClick={() => handleStatusChange(theatre)}
                  >
                    Block
                  </span>
                ) : (
                  <span
                    className="underline"
                    onClick={() => handleStatusChange(theatre)}
                  >
                    Approve
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TheatresList;

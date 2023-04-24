import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddTheatre, UpdateTheatre } from "../../apicalls/theatres";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { toast } from "react-toastify";

function TheatreForm({
  showTheatreFormModal,
  setShowTheatreFormModal,
  formType,
  setFormType,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [name, setName] = useState(selectedTheatre?.name || "");
  const [address, setAddress] = useState(selectedTheatre?.address || "");
  const [phone, setPhone] = useState(selectedTheatre?.phone || "");
  const [email, setEmail] = useState(selectedTheatre?.email || "");

  const onFinish = async (e) => {
    e.preventDefault();
    const values = { name, address, phone, email, owner: user._id };
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await AddTheatre(values);
      } else {
        values.theatreId = selectedTheatre._id;
        response = await UpdateTheatre(values);
      }

      if (response.success) {
        toast.success(response.message);
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
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

  return (
    <div className="p-5 my-2 col-md-3 algin-item-center">
      <h2>{formType === "add" ? "Add Theatre" : "Edit Theatre"}</h2>
      <form onSubmit={onFinish}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <textarea
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end gap-1">
          <button
            type="button"
            className="btn btn-outline-secondary me-1"
            onClick={() => {
              setShowTheatreFormModal(false);
              setSelectedTheatre(null);
            }}
          >
            Cancel
          </button>

          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default TheatreForm;

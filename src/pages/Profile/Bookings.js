import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetBookingsOfUser } from "../../apicalls/bookings";
import moment from "moment";
import { toast } from "react-toastify";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();
      if (response.success) {
        setBookings(response.data);
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
    <div className="container">
      <div className="row">
        {bookings.map((booking) => (
          <div className="col-md-4 mb-3">
            <div className="card p-2 flex justify-between">
              <div>
                <h1 className="text-xl">
                  {booking.show.movie.title} ({booking.show.movie.language})
                </h1>
                <div className="divider"></div>
                <h1 className="text-sm">
                  {booking.show.theatre.name} ({booking.show.theatre.address})
                </h1>
                <h1 className="text-sm">
                  Date & Time:{" "}
                  {moment(booking.show.date).format("MMM Do YYYY")} -{" "}
                  {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                </h1>
                <h1 className="text-sm">
                  Amount : ₹ {booking.show.ticketPrice * booking.seats.length}
                </h1>
                <h1 className="text-sm">Booking ID: {booking._id}</h1>
              </div>
              <div>
                <img
                  src={booking.show.movie.poster}
                  alt=""
                  height={100}
                  width={100}
                  className="br-1"
                />
                <h1 className="text-sm">Seats: {booking.seats.join(", ")}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;

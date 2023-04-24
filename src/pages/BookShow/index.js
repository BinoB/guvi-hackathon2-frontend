import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetShowById } from "../../apicalls/theatres";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import StripeCheckout from "react-stripe-checkout";
import { BookShowTickets, MakePayment } from "../../apicalls/bookings";
import {  toast } from "react-toastify";
import screen from "../../assets/screen.jpg";


function BookShow() {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetShowById({
        showId: params.id,
      });
      if (response.success) {
        setShow(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const getSeats = () => {
    const columns = 10;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="flex gap-1 flex-col p-2 card">
        {Array.from(Array(rows).keys()).map((seat, index) => {
          return (
            <div className="flex gap-1 justify-center">
              {Array.from(Array(columns).keys()).map((column, index) => {
                const seatNumber = seat * columns + column + 1;
                let seatClass = "seat";

                if (selectedSeats.includes(seat * columns + column + 1)) {
                  seatClass = seatClass + " selected-seat";
                }

                if (show.bookedSeats.includes(seat * columns + column + 1)) {
                  seatClass = seatClass + " booked-seat";
                }

                return (
                  seat * columns + column + 1 <= totalSeats && (
                    <div
                      className={seatClass}
                      onClick={() => {
                        if (selectedSeats.includes(seatNumber)) {
                          setSelectedSeats(
                            selectedSeats.filter((item) => item !== seatNumber)
                          );
                        } else {
                          setSelectedSeats([...selectedSeats, seatNumber]);
                        }
                      }}
                    >
                      <h1 className="text-sm">{seat * columns + column + 1}</h1>
                    </div>
                  )
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const book = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await BookShowTickets({
        show: params.id,
        seats: selectedSeats,
        transactionId,
        user: user._id,
      });
      if (response.success) {
        toast.success(response.message);
        navigate("/profile");
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoading());
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await MakePayment(
        token,
        selectedSeats.length * show.ticketPrice * 100
      );
      if (response.success) {
        toast.success(response.message);
        book(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    show && (
      <div>
        <div>
        {/* show infomation */}

        <div className="flex justify-between card p-2 items-center">
          <div>
            <h1 className="text-sm">{show.theatre.name}</h1>
            <h1 className="text-sm">{show.theatre.address}</h1>
          </div>

          <div>
            <h1 className="text-2xl uppercase">
              {show.movie.title} ({show.movie.language})
            </h1>
          </div>

          <div>
            <h1 className="text-sm">
              {moment(show.date).format("MMM Do yyyy")} -{" "}
              {moment(show.time, "HH:mm").format("hh:mm A")}
            </h1>
          </div>
        </div>

        {/* seats */}

        <div className="flex justify-center mt-2">{getSeats()}</div>

        {selectedSeats.length > 0 && (
          <div className="mt-2 flex justify-center gap-2 items-center flex-col">
            <div className="flex justify-center">
              <div className="flex uppercase card p-2 gap-3">
                <h1 className="text-sm"><b>Selected Seats</b> : {selectedSeats.join(" , ")}</h1>

                <h1 className="text-sm">
                  <b>Total Price</b> : {selectedSeats.length * show.ticketPrice}
                </h1>
              </div>
            </div>
            <StripeCheckout
              token={onToken}
              amount={selectedSeats.length * show.ticketPrice * 100}
              billingAddress
              stripeKey="pk_test_51MzdKsEQl95n6mTDuLhXJWMCCTc8hFyuBMTSNIHiH1hLytmqdywNJ63N1ixAjtdQimv5FIm0AUXYx3Xb75dNq9JQ00sNchq4XA"
            >
              <button className="btn btn-primary" title="Book Now">Book Now</button>
              
            </StripeCheckout>
          </div>
        )}
      </div>
      <div className="my-5 d-flex justify-center align-items-center justify-content-center">
      <img src={screen} class="img-fluid" alt="screen"/>
  
  
</div>

      </div>

    )
  );
}

export default BookShow;
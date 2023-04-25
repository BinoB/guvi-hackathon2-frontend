import { axiosInstance } from ".";

// make payment
export const MakePayment = async (token, amount) => {
  try {
    const response = await axiosInstance.post("https://guvi-hackathon2.onrender.com/api/bookings/make-payment", {
      token,
      amount,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// book shows
export const BookShowTickets = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "https://guvi-hackathon2.onrender.com/api/bookings/book-show",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get bookings of a user
export const GetBookingsOfUser = async () => {
  try {
    const response = await axiosInstance.get("https://guvi-hackathon2.onrender.com/api/bookings/get-bookings");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

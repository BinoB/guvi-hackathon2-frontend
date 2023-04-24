import React, { useEffect } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { toast } from "react-toastify";
import { HiOutlineLogout } from "react-icons/hi";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        dispatch(SetUser(null));
        toast.error(response.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoading());
      dispatch(SetUser(null));
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    user && (
      <div className="layout p-1">
        <div className="header bg-light flex justify-between p-2">
          <div>
            <h1
              className="text-2xl text-dark cursor-pointer"
              onClick={() => navigate("/")}
            >
              Universal Movies
            </h1>
          </div>

          <div className="bg-white p-1 flex gap-1">
            <i className=" text-primary"></i>
            <h1
              className="text-sm underline"
              onClick={() => {
                if (user.isAdmin) {
                  navigate("/admin");
                } else {
                  navigate("/profile");
                }
              }}
            >
              {user.name}
            </h1>

            <HiOutlineLogout
              className="ml-2 text-primary cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            />
          </div>
        </div>
        <div className=" mt-1 p-1">{children}</div>
      </div>
    )
  );
}

export default ProtectedRoute;

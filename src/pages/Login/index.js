import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (e) => {
    e.preventDefault();
    const values = {
      email,
      password,
    };
    try {
      dispatch(ShowLoading());
      const response = await LoginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        toast.success(response.message);

        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
    <section className="vh-100 bg-dark">
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px;" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Login
                  </h2>

                  <form onSubmit={onFinish}>
                   

                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example3cg">
                        Your Email
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="email"
                        classNameName="form-control"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example4cg">
                        Password
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        classNameName="form-control"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="d-flex justify-content-center">
                      <div className="d-flex flex-column mt-2 gap-1">
                        <button
                          type="submit"
                          className="btn btn-primary my-3"
                        >
                          Login
                        </button>
                        <Link to="/register" className="text-primary">
                          Have already an account? Register
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
}

export default Login;

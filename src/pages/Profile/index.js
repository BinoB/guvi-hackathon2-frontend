import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../../components/PageTitle";
import TheatresList from "./TheatresList";
import Bookings from "./Bookings";

function Profile() {
  const [activeTab, setActiveTab] = React.useState("bookings");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <PageTitle title="Profile" />

      <div>
        <button className="btn btn-light mr-2" onClick={() => handleTabChange("bookings")}>Bookings</button>
        <button className="btn btn-lignt" onClick={() => handleTabChange("theatres")}>Theatres</button>
      </div>

      <div className="my-2">
      {activeTab === "bookings" && <Bookings />}
      {activeTab === "theatres" && <TheatresList />}
      </div>
    </div>
  );
}

export default Profile;

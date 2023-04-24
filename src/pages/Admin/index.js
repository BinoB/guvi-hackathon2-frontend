import React from "react";
import PageTitle from "../../components/PageTitle";
import MoviesList from "./MoviesList";
import TheatresList from "./TheatresList";

function Admin() {
  const [activeTab, setActiveTab] = React.useState("movies");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <PageTitle title="Admin" />

      <div className="btn-group">
        <button className="btn btn-light mr-2"
          variant={activeTab === "movies" ? "primary" : "secondary"}
          onClick={() => handleTabChange("movies")}
        >
          Movies
        </button>
        <button className="btn btn-light"
          variant={activeTab === "theatres" ? "primary" : "secondary"}
          onClick={() => handleTabChange("theatres")}
        >
          Theatres
        </button>
      </div >

      <div className="my-5">
      {activeTab === "movies" ? <MoviesList /> : <TheatresList />}
      </div>
    </div>
  );
}

export default Admin;


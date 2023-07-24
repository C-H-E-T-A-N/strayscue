import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Reporter.css";
import logo from "../assets/profile.png";

const AddSponsor = () => {
  const { user, logoutUser, allSponsors, getAllSponsors, websiteUrl } =
    useContext(AuthContext);
    const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSponsors, setFilteredSponsors] = useState([]);

  useEffect(() => {
    getAllSponsors();
  }, [getAllSponsors]);

  useEffect(() => {
    // Filter sponsors based on search query
    const filtered = allSponsors.filter((data) => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      return (
        data.sponsor_name.toLowerCase().includes(lowerCaseSearchQuery) ||
        data.animal_fit_for_surgery.toLowerCase().includes(lowerCaseSearchQuery)
      );
    });
    setFilteredSponsors(filtered);
  }, [allSponsors, searchQuery]);

  const handleEditSponsorButton = (data) => {
    navigate("/Sponsor/EditSponsor", { state: { data: data } });
  };


  const handleSponsorDeleteButton = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Sponsor?"
    );
    if (confirmDelete) {
      try {
        // Delete the specific Sponsor by making an API call
        const response = await fetch(
          `${websiteUrl}/sponsors/delete/${id}/`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          // Sponsor successfully deleted, perform any necessary actions (e.g., refresh the Sponsor list)
          getAllSponsors(); // Refresh the Sponsor list after deletion
        } else {
          // Handle the case when the delete request fails
          console.log("Failed to Delete Sponsor:", id);
        }
      } catch (error) {
        // Handle any errors that occur during the delete operation
        console.error("Error Deleting Sponsor:", error);
      }
    }
  };

  return user ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "0",
        margin: "0",
        height: "100vh",
      }}
    >
      <NavBar />
      <>
        <div
          style={{
            paddingTop: "5rem",
            width: "100vw",
            paddingLeft: "50px",
          }}
          className="container"
        >
          <h4 className="heading1">Add Sponsor </h4>
          <div className="case-lists mx-auto">
            <div className="menu1">
              <Link
                to="/Sponsor/AddSponsor"
                style={{
                  background: "rgb(245, 145, 32)",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
                className="btn "
              >
                Add Sponsor
              </Link>
              <input
                type="text"
                placeholder="Search by Name/Type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Displaying Sponsor Data */}
            <div className="container-fluid" style={{ overflow: "scroll" }}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Logo</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSponsors.map((data, index) => {
                    return (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>{data.sponsor_name}</td>
                        <td>{data.animal_fit_for_surgery}</td>
                        <td>
                          <img
                            src={`http://localhost:8000${data.sponsor_logo}`}
                            alt="Sponsor Logo"
                            height="30px"
                          />
                        </td>
                        <td>
                          <button className="btn btn-primary" onClick={()=>handleEditSponsorButton(data)}>Edit</button>
                          <div
                            className="btn btn-primary mx-1"
                            onClick={() => {
                              handleSponsorDeleteButton(data.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      <div
        style={{
          position: "absolute",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          right: "0.1rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100vw",
          fontSize: "20px",
          zIndex: "9",
          padding: "0.5rem 0.5rem",
          backgroundColor: "#ffffff",
        }}
      >
        <span>
          <label style={{ padding: "0.5rem", fontWeight: "bold" }}>
          {localStorage.getItem("username")}
          </label>
          <img
            width="17%"
            style={{ marginRight: "1.5rem", cursor: "pointer" }}
            src={logo}
            alt="Logo"
          ></img>
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-right-from-bracket"
            onClick={logoutUser}
          ></i>
        </span>
      </div>
    </div>
  ) : (
    <div>
      <p>You are not logged in, redirecting...</p>
    </div>
  );
};

export default AddSponsor;

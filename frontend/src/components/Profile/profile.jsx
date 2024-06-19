import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import photo from "./download.png";
import "./profile.css";

function Profile(props) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});

  const callProfilePage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setUserData(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
      setLoaded(true);
    } catch (e) {
      console.log(e);
      navigate("/login");
    }
  };

  const showFollowers = () => {
    navigate("/followerslist");
  };
  const showFollowings = () => {
    navigate("/followinglist");
  };

  useEffect(() => {
    callProfilePage();
  }, []);

  const editProfile = () => {
    navigate("/editprofile");
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      props.setflag(false);
      navigate("/login");
    } else {
      props.setflag(true);
    }
  });

  if (!loaded) return <h1>Loading... <i className="fas fa-sync-alt fa-spin"></i></h1>;

  return (
    <div className="container my-5">
      <div className="card">
        <div className="row">
          <div className="col-md-3 text-center">
            <img src={photo} className="pphoto" alt="profile_photo" />
          </div>
          <div className="col-md-5">
            <div className="card-body">
              <h1 className="card-title">{userData?.userName}</h1>
              <p className="card-text">
                <b>Name:</b> {userData?.firstName} {userData?.lastName}
              </p>
              <p className="card-text">
                <b>Email:</b> {userData?.email}
              </p>
              <p className="card-text">
                <b>Skills:</b> {userData?.skills}
                {console.log(userData.skills)}
              </p>
              <p className="card-text">
                <b>Age:</b> {userData?.age}
              </p>
              <p className="card-text">
                <b>Contact Number:</b> {userData?.contactNumber}
              </p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <h4>
              Followers:{" "}
              <button onClick={showFollowers}>
                {userData?.followers?.length}
              </button>
            </h4>
            <h4>
              Following:{" "}
              <button onClick={showFollowings}>
                {userData?.followings?.length}
              </button>
            </h4>
            <button type="submit" onClick={editProfile} className="edit-btn">
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

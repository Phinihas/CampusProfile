import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './userlist.css'; // Ensure this matches the actual file name and path

function UserList(props) {
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users", { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const callUserPage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/userlist", {
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

  useEffect(() => {
    callUserPage();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      props.setflag(false);
      navigate("/login");
    } else {
      props.setflag(true);
    }
  });

  const followUnfollow = async (userID, e) => {
    e.preventDefault();
    const follower = userID;
    const id = userData?._id;

    const res = await fetch("http://localhost:5000/api/userlist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ follower, id }),
    });

    if (res.status === 201) {
      setUserData({
        ...userData,
        followings: userData?.followings.concat({ following: follower }),
      });
      setUsers(
        users?.map((u) =>
          u._id !== id
            ? u
            : { ...u, followings: u.followings.concat({ following: follower }) }
        )
      );
      setUsers(
        users?.map((u) =>
          u._id !== follower
            ? u
            : { ...u, followers: u.followers.concat({ follower: id }) }
        )
      );
    } else if (res.status === 200) {
      setUserData({
        ...userData,
        followings: userData?.followings?.filter((f) => f.following !== follower),
      });
      setUsers(
        users?.map((u) =>
          u._id !== id
            ? u
            : { ...u, followings: u.followings?.filter((f) => f.following !== follower) }
        )
      );
      setUsers(
        users?.map((u) =>
          u._id !== follower
            ? u
            : { ...u, followers: u.followers?.filter((f) => f.follower !== id) }
        )
      );
    } else {
      window.alert("Error");
    }
  };

  if (!loaded) {
    return (
      <h1 className="text-center my-5">
        Loading... <i className="fas fa-sync-alt fa-spin"></i>
      </h1>
    );
  } else {
    return (
      <div className="container">
        <div className="row">
          {users?.map((user) => {
            const alreadyfollow = userData?.followings.some(
              (following) => following.following === user?._id
            );
            return (
              <div className="col-md-4 mb-4" key={user?._id}>
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    {/* <div className="thumb">
                      <img
                        src={`http://localhost:5000/images/${user.profileImage}`}
                        alt="User"
                        className="rounded-circle mb-3"
                        width="80"
                        height="80"
                      />
                    </div> */}
                    <h5 className="card-title">{user?.userName}</h5>
                    {!(userData?._id === user?._id) ? (
                      <button
                        onClick={(e) => followUnfollow(user?._id, e)}
                        className={`btn btn-${alreadyfollow ? 'danger' : 'primary'} btn-sm`}
                      >
                        <i className={`fas fa-user-${alreadyfollow ? 'minus' : 'plus'}`}></i> {alreadyfollow ? 'Unfollow' : 'Follow'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default UserList;

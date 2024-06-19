import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FollowingList(props) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users", { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});

  const goProfile = () => {
    navigate("/profile");
  };

  const followUnfollow = async (userId, e) => {
    e.preventDefault();

    const follower = userId;
    const id = userData?._id;

    const res = await fetch("http://localhost:5000/api/userlist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower,
        id,
      }),
    });

    if (res.status === 201) {
      // window.alert("Followed Successfully");
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
      // window.location.reload();
    } else if (res.status === 200) {
      // window.alert("Unfollowed Successfully");
      setUserData({
        ...userData,
        followings: userData?.followings.filter((f) => f.following !== follower),
      });
      setUsers(
        users?.map((u) =>
          u._id !== id
            ? u
            : {
                ...u,
                followings: u.followings.filter(
                  (f) => f.following !== follower
                ),
              }
        )
      );
      setUsers(
        users?.map((u) =>
          u._id !== follower
            ? u
            : { ...u, followers: u.followers?.filter((f) => f.follower !== id) }
        )
      );
      // window.location.reload();
    } else {
      window.alert("Error");
    }
  };
  const callUserPage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/followinglist", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      //   console.log(data);
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

  if (!loaded)
    return (
      <h1>
        Loading... <i class="fas fa-sync-alt fa-spin"></i>
      </h1>
    );
  else
    return (
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Following List</th>
            <th>
              <button className="btn btn-primary" onClick={goProfile}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            const alreadyfollow = userData?.followings?.some(
              (following) => following.following === user._id
            );
            return (
              <tr key={user._id}>
                {!(userData?._id === user?._id) ? (
                  <>
                    {!alreadyfollow ? (
                      <></>
                    ) : (
                      <>
                        <td>
                          <i className="fas fa-user-alt"></i> {user.userName}
                        </td>
                        <td>
                          {" "}
                          <button
                            onClick={(e) => followUnfollow(user._id, e)}
                            className="followButton"
                            style={{ fontSize: "13px" }}
                          >
                            <i
                              className="fas fa-user-plus"
                              style={{ color: "red", fontSize: "13px" }}
                            ></i>
                            {"  "}Unfollow
                          </button>
                        </td>
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
}

export default FollowingList;

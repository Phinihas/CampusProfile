import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Subgreddiitusers(props) {
  const { subgreddiitId } = useParams();

  // console.log(subgreddiitId);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [users, setUsers] = useState([]);
  // const [ThisSubGreddiit, setThisSubGreddiit] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000http://localhost:5000/api/fsubgreddiits", {withCredentials: true})
      .then((res) => setSubGreddiits(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users", { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

  const callSubgreddiitsPage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subgreddiits", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data);
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

  const remove = async (userId, e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/removeuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subgreddiitId,
          userId,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        // window.alert("User Removed Successfully");
        console.log("User Removed Successfully");
        setUsers(
          users?.map((u) =>
            u._id !== userId
              ? u
              : {
                  ...u,
                  subgreddiits: u.subgreddiits.filter(
                    (s) => s.subgreddiit !== subgreddiitId
                  ),
                  acceptedJoins: u.acceptedJoins.filter(
                    (a) => a.accept != subgreddiitId
                  ),
                }
          )
        );
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  followers: s.followers?.filter((f) => f.follower !== userId),
                }
          )
        );
        // window.location.reload();
      } else {
        window.alert("Not Removed");
        console.log("Not Removed");
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    callSubgreddiitsPage();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      props.setflag(false);
      navigate("/login");
    } else {
      props.setflag(true);
    }
  }, []);

  // const callEachSubgreddiitsPage = async () => {
  //   try {
  //     const res = await fetch(`/mysubgreddiits/${subgreddiitId}`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         subgreddiitId,
  //       }),
  //     });
  //     const data = await res.json();
  //     // console.log(data);
  //     setThisSubGreddiit(data);
  //     if (!data) {
  //       const error = new Error(res.error);
  //       throw error;
  //     } else {
  //       console.log("Got ThisSubGreddiit Successfully");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     navigate("/Mysubgreddiits");
  //   }
  // };
  // useEffect(() => {
  //   callEachSubgreddiitsPage();
  // }, []);

  const goMySubGreddiits = () => {
    navigate(`/mysubgreddiits/${subgreddiitId}`);
    window.location.reload();
  };
  if (!loaded)
    return (
      <h1>
        Loading... <i class="fas fa-sync-alt fa-spin"></i>
      </h1>
    );
  else
    return (
      <>
        <div
          style={{
            display: "flex",
            background: "black",
            padding: "5px 0 5px 5px",
            fontSize: "20px",
          }}
        >
          <div style={{ margin: "10px" }}>
            <NavLink
              to={`/mysubgreddiits/${subgreddiitId}/users`}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              <i className="fas fa-users"></i> SG Users
            </NavLink>
          </div>
          <div style={{ margin: "10px" }}>
            <NavLink
              to={`/mysubgreddiits/${subgreddiitId}/stats`}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              <i className="fas fa-users"></i> SG Stats
            </NavLink>
          </div>
          <div style={{ margin: "10px" }}>
            <NavLink
              to={`/mysubgreddiits/${subgreddiitId}/joinrequests`}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              <i className="fas fa-users"></i> SG Join Requests
            </NavLink>
          </div>
          <div style={{ margin: "10px" }}>
            <NavLink
              to={`/mysubgreddiits/${subgreddiitId}/reports`}
              style={({ isActive }) => ({
                color: isActive ? "greenyellow" : "white",
              })}
            >
              <i className="fas fa-users"></i> SG Reports
            </NavLink>
          </div>
        </div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Subgreddiit Users</th>
              <th>
                <button className="btn btn-primary" onClick={goMySubGreddiits}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              let yourSubGreddiit = false;
              if (user?.subgreddiits) {
                yourSubGreddiit = user?.subgreddiits?.some(
                  (sub) => sub.subgreddiit === subgreddiitId
                );
              }
              let notowner = false;
              if (user?.acceptedJoins) {
                notowner = user?.acceptedJoins?.some(
                  (sub) => sub.accept === subgreddiitId
                );
              }
              // console.log(yourSubGreddiit);
              return (
                <tr key={user?._id}>
                  {!yourSubGreddiit ? (
                    <></>
                  ) : (
                    <>
                      <td>
                        <i className="fas fa-user-alt"></i> {user?.userName}
                      </td>
                      <td>
                        {notowner && (
                          <button
                            className="btnsize"
                            onClick={(e) => remove(user?._id, e)}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2>Blocked Users</h2>
        <table className="table table-bordered table-striped">
          <tbody>
            {users?.map((user) => {
              let blockedUser = false;
              if (user?.blockedSubgreddiits) {
                blockedUser = user?.blockedSubgreddiits?.some(
                  (sub) => sub.blocked === subgreddiitId
                );
              }
              // console.log(blockedUser);
              return (
                <tr key={user?._id}>
                  {!blockedUser ? (
                    <></>
                  ) : (
                    <>
                      <td>
                        <i className="fas fa-user-alt"></i> {user?.userName}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
}

export default Subgreddiitusers;

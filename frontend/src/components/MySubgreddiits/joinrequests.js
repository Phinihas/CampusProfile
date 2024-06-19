import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Joinrequests(props) {
  const { subgreddiitId } = useParams();
  // console.log(subgreddiitId);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [users, setUsers] = useState([]);
  // const [ThisSubGreddiit, setThisSubGreddiit] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", {withCredentials: true})
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

  const Accept = async (e, userID) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/acceptingrequests", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          subgreddiitId,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log("Accepted");
        // window.alert("Accepted Successfully");
        setUsers(
          users?.map((u) =>
            u._id !== userID
              ? u
              : {
                  ...u,
                  acceptedJoins: u.acceptedJoins.concat({
                    accept: subgreddiitId,
                  }),
                  subgreddiits: u.subgreddiits.concat({
                    subgreddiit: subgreddiitId,
                  }),
                  requestedJoins: u.requestedJoins.filter(
                    (r) => r.request !== subgreddiitId
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
                  joinrequests: s.joinrequests?.filter(
                    (r) => r.user.userID !== userID
                  ),
                  followers: s.followers.concat({ follower: userID }),
                }
          )
        );
        // window.location.reload();
      } else {
        console.log("Not Accepted");
        window.alert("Not Accepted Successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Decline = async (e, userID) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/decliningrequests", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          subgreddiitId,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log("Declined");
        // window.alert("Declined Successfully");
        setUsers(
          users?.map((u) =>
            u._id !== userID
              ? u
              : {
                  ...u,
                  requestedJoins: u.requestedJoins.filter(
                    (r) => r.request !== subgreddiitId
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
                  joinrequests: s.joinrequests?.filter(
                    (r) => r.user.userID !== userID
                  ),
                }
          )
        );
        // window.location.reload();
      } else {
        console.log("Not Declined");
        window.alert("Not Declined Successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

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

  const goMySubGreddiits = async (e) => {
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
              <th>Join Requests</th>
              <th>
                <button className="btn btn-primary" onClick={goMySubGreddiits}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {subGreddiits?.map((subGreddiit) => {
              const yourSubGreddiit = subGreddiit?._id === subgreddiitId;
              return (
                <tr key={subGreddiit._id}>
                  {!yourSubGreddiit ? (
                    <></>
                  ) : (
                    <>
                      {" "}
                      {subGreddiit?.joinrequests?.map((keyword) => (
                        <>
                          <td>
                            <i className="fas fa-user-alt"></i>{" "}
                            {keyword?.user?.userName}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={(e) => Accept(e, keyword?.user?.userID)}
                            >
                              Accept
                            </button>{" "}
                            <button
                              className="red"
                              onClick={(e) => Decline(e, keyword?.user?.userID)}
                            >
                              Decline
                            </button>
                          </td>
                        </>
                      ))}
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

export default Joinrequests;

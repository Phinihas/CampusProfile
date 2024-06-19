import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import BlockButton from "./blockbutton";

function Subgreddiitreports(props) {
  const { subgreddiitId } = useParams();
  // console.log(subgreddiitId);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [reports, setReports] = useState([]);
  // const [ThisSubGreddiit, setThisSubGreddiit] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", {withCredentials: true})
      .then((res) => setSubGreddiits(res.data))
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

  const handleDelete = async (postId) => {
    const res = await fetch("http://localhost:5000/api/deletepost", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subgreddiitId,
        postId,
      }),
    });
    // const data = await res.json();

    if (res.status === 201) {
      console.log("Post Deleted Successfully");
      // window.alert("Post Deleted Successfully");
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : { ...s, posts: s.posts?.filter((p) => p._id !== postId) }
        )
      );
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : { ...s, reported: s.reported?.filter((r) => r.post !== postId) }
        )
      );
      let newreports = reports.filter((r) => r.post !== postId);
      setReports(newreports);
      // window.location.reload();
    } else if (res.status === 202) {
      console.log("Time Delay Deletion");
      window.alert("Time Delay Deletion");
    } else {
      console.log("Post not Deleted");
      window.alert("Post not Deleted");
    }
  };

  // const DeleteReport = async(reportId) => {
  //   console.log(reportId);
  //   try {
  //     const res = await fetch("/deletereport", {
  //       method: "PUT",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         subgreddiitId,
  //         reportId,
  //       }),
  //     });
  //     // const data = await res.json();

  //     if (res.status === 201) {
  //       console.log("Post Deleted for Time Delay Successfully");
  //       window.alert("Post Deleted for Time Delay Successfully");
  //       setSubGreddiits(
  //         subGreddiits.map((s) =>
  //           s._id !== subgreddiitId
  //             ? s
  //             : {
  //                 ...s,
  //                 reported: s.reported.filter((r) => r._id !== reportId),
  //               }
  //         )
  //       );
  //       // window.location.reload();
  //     } else {
  //       console.log("Post not Deleted for Time Delay");
  //       window.alert("Post not Deleted for Time Delay");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleIgnore = async (reportId) => {
    const res = await fetch("http://localhost:5000/api/ignorereport", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subgreddiitId,
        reportId,
      }),
    });
    // const data = await res.json();

    if (res.status === 201) {
      console.log("Post Ignored Successfully");
      // window.alert("Post Ignored Successfully");
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                reported: s.reported?.map((r) =>
                  r._id !== reportId ? r : { ...r, ignored: 1 }
                ),
              }
        )
      );
      setReports(
        reports.map((r) => (r._id !== reportId ? r : { ...r, ignored: 1 }))
      );
      // window.location.reload();
    } else if (res.status === 202) {
      console.log("Time Delay Deletion");
      window.alert("Time Delay Deletion");
    } else {
      console.log("Post not Ignored");
      window.alert("Post not Ignored");
    }
  };

  const getreports = async (req, res) => {
    try {
      const res = await fetch("http://localhost:5000/api/getreports", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subgreddiitId,
        }),
      });
      const data = await res.json();
      // console.log(data);
      setReports(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getreports();
  }, []);

  // const handleBlock = async (reportPost, reportId) => {
  //   const res = await fetch("/blockuser", {
  //     method: "PUT",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({
  //       subgreddiitId,
  //       reportPost,
  //       reportId,
  //     }),
  //   });
  //   // const data = await res.json();

  //   if (res.status === 201) {
  //     console.log("User Blocked Successfully");
  //     window.alert("User Blocked Successfully");
  //     setSubGreddiits(
  //       subGreddiits.map((s) =>
  //         s._id !== subgreddiitId
  //           ? s
  //           : {
  //               ...s,
  //               blockedSG: s.blockedSG.concat({ blocked: reportPost }),
  //             }
  //       )
  //     );
  //     // window.location.reload();
  //   } else if (res.status === 200) {
  //     console.log("User Already Blocked ");
  //     window.alert("User Already Blocked ");
  //   } else {
  //     console.log("User not Blocked");
  //     window.alert("User not Blocked");
  //   }
  // };

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

  // const timewait = 1 * 60 * 1000;

  const goMySubGreddiits = () => {
    navigate(`/mysubgreddiits/${subgreddiitId}`);
    window.location.reload();
  };
  if (!loaded || !reports)
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
              <th>Subgreddiit Reports</th>
              <th>
                <button className="btn btn-primary" onClick={goMySubGreddiits}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </th>
            </tr>
            <tr>
              <th>Reported By</th>
              <th>Reported To</th>
              <th>Concern</th>
              <th>Post</th>
              <th>Block</th>
              <th>Delete</th>
              <th>Ignore</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((report) => {
              return (
                <tr key={report?._id}>
                  <td>{report?.reportedByName}</td>
                  <td>{report?.reportedToName}</td>
                  <td>{report?.text}</td>
                  <td>{report?.postName}</td>
                  <td>
                    <BlockButton
                      subgreddiitId={subgreddiitId}
                      report={report}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(report?.post)}
                      disabled={report?.ignored === 1}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleIgnore(report?._id)}
                      disabled={report?.ignored === 1}
                    >
                      Ignore
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
}

export default Subgreddiitreports;

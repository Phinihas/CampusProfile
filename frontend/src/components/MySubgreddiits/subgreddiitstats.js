import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Graph from "./Graphs";
import Views from "./viewsgraph";
import Posts from "./postsgraph";
import ReportsDeletesChart from "./reportgraph";

function Subgreddiitstats(props) {
  const { subgreddiitId } = useParams();
  // console.log(subgreddiitId);
  // console.log(subgreddiitId);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [followersgrowth, setFollowersGrowth] = useState([]);
  const [postsgrowth, setPostsGrowth] = useState([]);
  const [reportsgrowth, setReportsGrowth] = useState([]);
  const [opensgrowth, setOpensGrowth] = useState([]);
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

  const getstatsfollowers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getstatsfollowers", {
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
      setFollowersGrowth(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getstatsfollowers();
  }, []);

  const getstatsposts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getstatsposts", {
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
      setPostsGrowth(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getstatsposts();
  }, []);

  const getstatsreports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getstatsreports", {
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
      setReportsGrowth(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getstatsreports();
  }, []);

  const getstatsopens = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getstatsopens", {
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
      setOpensGrowth(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getstatsopens();
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
  // console.log(followersgrowth);
  const goMySubGreddiits = () => {
    navigate(`/mysubgreddiits/${subgreddiitId}`);
    window.location.reload();
  };
  if (!loaded || !followersgrowth)
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
              <th>Subgreddiit Stats</th>
              <th>
                <button className="btn btn-primary" onClick={goMySubGreddiits}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <p></p>
        <h2>Followers Growth : </h2>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {followersgrowth?.map((f) => {
              return (
                <tr key={f.dt}>
                  <td>{f.dt}</td>
                  <td>{f.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p></p>
        <h2>Posts Growth : </h2>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {postsgrowth?.map((f) => {
              return (
                <tr key={f.dt}>
                  <td>{f.dt}</td>
                  <td>{f.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p></p>
        <h2>Views : </h2>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {opensgrowth?.map((f) => {
              return (
                <tr key={f.dt}>
                  <td>{f.dt}</td>
                  <td>{f.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p></p>
        <h2>Reports - Deletes : </h2>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reports</th>
              <th>Deletes</th>
            </tr>
          </thead>
          <tbody>
            {reportsgrowth?.map((f) => {
              return (
                <tr key={f.dt}>
                  <td>{f.dt}</td>
                  <td>{f.report}</td>
                  <td>{f.del}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p></p>
        <h2>Followers Growth Graph : </h2>
        <Graph data={followersgrowth} />
        <p></p>
        <h2>Views : </h2>
        <Views data={opensgrowth} />
        <p></p>
        <h2>Posts : </h2>
        <Posts data={postsgrowth} />
        <p></p>
        <h2>Reports & Deletes : </h2>
        <ReportsDeletesChart data={reportsgrowth} />
      </>
    );
}

export default Subgreddiitstats;

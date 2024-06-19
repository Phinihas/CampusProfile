import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./mysubgreddiits.css";

function Mysubgreddiits(props) {
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", { withCredentials: true })
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

  const Open = async (subgreddiitId, e) => {
    e.preventDefault();
    navigate(`/mysubgreddiits/${subgreddiitId}`);
  };

  const Delete = async (subGreddiitID, e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/subgreddiits", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify({ subGreddiitID }),
    });

    const data = await res.json();

    if (!res.status === 201 || !data) {
      window.alert("Deletion Failed");
      console.log("Invalid Deletion");
    } else {
      console.log("Successful Deletion");
      setSubGreddiits(subGreddiits.filter((s) => s._id !== subGreddiitID));
      navigate("/mysubgreddiits");
    }
  };

  const createSubGreddiit = () => {
    navigate("/createsubgreddiit");
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

  if (!loaded) {
    return (
      <div className="loading">
        <h1>
          Loading... <i className="fas fa-sync-alt fa-spin"></i>
        </h1>
      </div>
    );
  } else {
    return (
      <div className="table-container">
        <div className="d-flex mb-3">
          <h3>My SubGreddiits List</h3>
          <button className="btn btn-primary btn-create" onClick={createSubGreddiit}>
            <i className="fas fa-plus"></i> Create New
          </button>
        </div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Followers</th>
              <th>Posts</th>
              <th>Creation Date</th>
              <th>Tags</th>
              <th>Banned Keywords</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subGreddiits.map((subGreddiit) => {
              const yourSubGreddiit = subGreddiit.owner === userData._id;
              return (
                yourSubGreddiit && (
                  <tr key={subGreddiit._id}>
                    <td>{subGreddiit.name}</td>
                    <td>{subGreddiit.description}</td>
                    <td>{subGreddiit.followers.length}</td>
                    <td>{subGreddiit.posts.length}</td>
                    <td>{new Date(subGreddiit.creationDate).toLocaleDateString()}</td>
                    <td>{subGreddiit.tags.map((tag) => tag.tag).join(", ")}</td>
                    <td>{subGreddiit.bannedKeyWords.map((keyword) => keyword.keyword).join(", ")}</td>
                    <td>
                      <button onClick={(e) => Open(subGreddiit._id, e)} className="btn green btn-sm">
                        <i className="fas fa-folder-open"></i> Open
                      </button>
                      <button onClick={(e) => Delete(subGreddiit._id, e)} className="btn red btn-sm ml-2">
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Mysubgreddiits;

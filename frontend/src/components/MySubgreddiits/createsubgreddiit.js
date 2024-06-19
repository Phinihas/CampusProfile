import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import axios from "axios";

function CreateSubGreddiit(props) {
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);

  const [RegDisable, SetRegDisable] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", { withCredentials: true })
      .then((res) => setSubGreddiits(res.data))
      .catch((err) => console.error(err));
  }, []);
  const [mySubGreddiit, setMySubGreddit] = useState({
    name: "",
    description: "",
    owner: "",
    followers: [],
    tags: "",
    bannedKeyWords: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Created Sub Greddiit");
  };

  useEffect(() => {
    mySubGreddiit.name === "" || mySubGreddiit.description === ""
      ? SetRegDisable(true)
      : SetRegDisable(false);
  });

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
  let name, value;

  console.log(userData);

  const userID = userData._id;

  const handleInputs = (event) => {
    name = event.target.name;
    value = event.target.value;

    setMySubGreddit({
      ...mySubGreddiit,
      [name]: value,
      owner: userID,
      followers: [{ follower: userID }],
    });
  };

  const postData = async (e) => {
    e.preventDefault();
SetRegDisable(true);
    const { name, description, owner, followers, tags, bannedKeyWords } =
      mySubGreddiit;
    console.log(mySubGreddiit.followers);
    console.log(owner);
    const res = await fetch("http://localhost:5000/api/subgreddiits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify({
        name,
        description,
        owner,
        followers,
        tags,
        bannedKeyWords,
      }),
    });

    const data = await res.json();

    if (!res.status === 201 || !data) {
      window.alert("Creation Failed");
      console.log("Invalid creation");
    } else {
      window.alert("Creation Successful");
      console.log("Successful creation");
      navigate("/mysubgreddiits");
    }
    SetRegDisable(false);
  };

  const goMySubGreddiits = () => {
    navigate("/mysubgreddiits");
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
  if (!loaded)
    return (
      <h1>
        Loading... <i class="fas fa-sync-alt fa-spin"></i>
      </h1>
    );
  else
    return (
      <>
        <div className="wrapper bg-dark d-flex align-items-center justify-content-center w-100">
          <div className="editProfile">
            <form onSubmit={handleSubmit} method="POST">
              <div className="form-group was-validated mb-2">
                <label htmlFor="text" className="form-label">
                  Name
                </label>
                <input
                  className="form-control"
                  name="name"
                  type="text"
                  placeholder="Enter name of the Subgreddiit"
                  value={mySubGreddiit.name}
                  onChange={handleInputs}
                  required
                />
              </div>

              <div className="form-group was-validated mb-2">
                <label htmlFor="text" className="form-label">
                  Description
                </label>
                <input
                  className="form-control"
                  name="description"
                  type="text"
                  placeholder="Enter description of Subgreddiit"
                  value={mySubGreddiit.description}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div className="form-group was-validated mb-2">
                <label htmlFor="text" className="form-label">
                  Tags
                </label>
                <input
                  className="form-control"
                  name="tags"
                  type="text"
                  placeholder="Enter tags (,) seperated"
                  value={mySubGreddiit.tags}
                  onChange={handleInputs}
                  required
                  pattern="^\s*[a-z]+(?:\s*,\s*[a-z]+)*\s*$"
                />
                <div className="invalid-feedback">Tags Not Acceptable</div>
              </div>
              <div className="form-group was-validated mb-2">
                <label htmlFor="text" className="form-label">
                  Banned Keywords
                </label>
                <input
                  className="form-control"
                  name="bannedKeyWords"
                  type="text"
                  placeholder="Enter bannedKeyWords (,) seperated"
                  value={mySubGreddiit.bannedKeyWords}
                  onChange={handleInputs}
                  required
                  pattern="^\s*[a-zA-Z]+(?:\s*,\s*[a-zA-Z]+)*\s*$"
                />
                <div className="invalid-feedback">
                  Banned KeyWords Not Acceptable
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success block w-100"
                onClick={postData}
                disabled={RegDisable}
              >
                Create
              </button>
              <p>
                Don't want to Create?{" "}
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={goMySubGreddiits}
                >
                  Cancel
                </button>
              </p>
            </form>
          </div>
        </div>
      </>
    );
}

export default CreateSubGreddiit;
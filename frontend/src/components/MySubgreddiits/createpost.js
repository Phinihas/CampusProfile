import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CreatePost(props) {
  const { subgreddiitId } = useParams();
  // console.log(subgreddiitId);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);

  const [RegDisable, SetRegDisable] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", {withCredentials: true})
      .then((res) => setSubGreddiits(res.data))
      .catch((err) => console.error(err));
  }, []);
  const [myPost, setMyPost] = useState({
    postName: "",
    description: "",
    postedBy: { Id: "", userName: "" },
    postedIn: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Created Post");
  };

  useEffect(() => {
    myPost?.postName === "" || myPost?.description === ""
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

  const handleInputs = (event) => {
    name = event.target.name;
    value = event.target.value;

    setMyPost({
      ...myPost,
      [name]: value,
      postedBy: {
        ...myPost.postedBy,
        Id: userData?._id,
        userName: userData?.userName,
      },
      postedIn: subgreddiitId,
    });
  };

  const postData = async (e) => {
    e.preventDefault();
SetRegDisable(true);
    const { postName, description, postedBy, postedIn } = myPost;
    // console.log(postedBy);
    const res = await fetch("http://localhost:5000/api/creatingposts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify({
        postName,
        description,
        postedBy,
        postedIn,
      }),
    });

    const data = await res.json();
    const md = data.maskedDescription;

    if (res.status === 201) {
      window.alert("Banned Key Word is Detected");
      console.log("Banned Key Word is Detected");
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                posts: s.posts.concat({
                  postName: postName,
                  description: md,
                  postedBy: postedBy,
                  postedIn: postedIn,
                }),
              }
        )
      );
      navigate(`/mysubgreddiits/${subgreddiitId}`);
    } else if (res.status === 200) {
      window.alert("Creation Successful");
      console.log("Successful creation");
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                posts: s.posts.concat({
                  postName: postName,
                  description: md,
                  postedBy: postedBy,
                  postedIn: postedIn,
                }),
              }
        )
      );
      navigate(`/mysubgreddiits/${subgreddiitId}`);
    } else {
      console.log("creation failed");
      window.alert("creation failed");
    }
    SetRegDisable(false);
  };

  const goMySubGreddiits = () => {
    navigate(`/mysubgreddiits/${subgreddiitId}`);
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
            <form onSubmit={handleSubmit} method="PUT">
              <div className="form-group was-validated mb-2">
                <label htmlFor="text" className="form-label">
                  Name
                </label>
                <input
                  className="form-control"
                  name="postName"
                  type="text"
                  placeholder="Enter name of the Post"
                  value={myPost.postName}
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
                  placeholder="Enter description of Post"
                  value={myPost.description}
                  onChange={handleInputs}
                  required
                />
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

export default CreatePost;

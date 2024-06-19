import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Cancelrequest(props) {
  const { subgreddiitId } = useParams();
  //   console.log(subgreddiitId);
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

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Created Post");
  };

  const [decision, setDecision] = useState("");

  useEffect(() => {
    decision !== "YES" ? SetRegDisable(true) : SetRegDisable(false);
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
    setDecision(value);
  };
  const userID = userData._id;
  const userDetails = { userID: userID, userName: userData.userName };
  const postData = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/cancellingrequest", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        decision,
        subgreddiitId,
        userID,
        userDetails,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      // window.alert("Cancellation Successful");
      console.log("Successful Cancellation");
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                joinrequests: s.joinrequests?.filter(
                  (u) => u.user.userID !== userID
                ),
              }
        )
      );
      setUserData({
        ...userData,
        requestedJoins: userData.requestedJoins.filter(
          (r) => r.request !== subgreddiitId
        ),
      });
      navigate(`/subgreddiits`);
    } else {
      window.alert("Cancellation Failed");
      console.log("Invalid Cancellation");
    }
  };

  const goSubgreddiits = () => {
    navigate(`/subgreddiits`);
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
                  Decision
                </label>
                <input
                  className="form-control"
                  name="decision"
                  type="text"
                  placeholder="Type YES to Cancel request"
                  value={decision}
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
                Cancel
              </button>
              <p>
                Don't want to Cancel request?{" "}
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={goSubgreddiits}
                >
                  Back
                </button>
              </p>
            </form>
          </div>
        </div>
      </>
    );
}

export default Cancelrequest;

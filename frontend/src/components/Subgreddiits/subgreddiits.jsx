import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./subgreddiits.css";
import { useState } from "react";
import axios from "axios";
import SubgreddiitSearchBar from "./searchBar";

function Subgreddiits(props) {
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sflag, setSflag] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", { withCredentials: true })
      .then((res) => setSubGreddiits(res.data))
      .catch((err) => console.error(err));
  }, []);

  // console.log(subGreddiits);

  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    const filteredSubgreddiits = subGreddiits?.filter((subgreddiit) =>
      subgreddiit?.name.toLowerCase().includes(searchTerm)
    );
    if (filteredSubgreddiits.length === 0) {
      setSflag(true);
    } else {
      setSflag(false);
    }
    setSearchResults(filteredSubgreddiits);
  };

  const allTags = subGreddiits?.reduce((acc, subGreddiit) => {
    subGreddiit?.tags.forEach((tag) => acc.add(tag.tag));
    return acc;
  }, new Set());

  const uniqueTags = Array.from(allTags);

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

  const userID = userData?._id;

  const userDetails = { userID: userID, userName: userData?.userName };

  const Join = async (subgreddiitId, e) => {
    e.preventDefault();
    // console.log(userDetails);
    const res = await fetch("http://localhost:5000/api/subgreddiitsjoining", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subgreddiitId,
        userID,
        userDetails,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      window.alert("Join Request Sent Successfully");
      console.log("Join Request Sent Successfully");
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                joinrequests: s.joinrequests.concat({ user: userDetails }),
              }
        )
      );
      setSearchResults(
        searchResults?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                joinrequests: s.joinrequests.concat({ user: userDetails }),
              }
        )
      );
      setUserData({
        ...userData,
        requestedJoins: userData?.requestedJoins.concat({
          request: subgreddiitId,
        }),
      });
      // window.location.reload();
    } else if (res.status === 200) {
      window.alert("You cannot Join Again Once You Left");
      console.log("You cannot Join Again Once You Left");
      // window.location.reload();
    } else if (res.status === 202) {
      window.alert("You are Blocked");
      console.log("You are Blocked");
      // window.location.reload();
    } else {
      window.alert("Cannot Send Join Request");
      console.log("Cannot Send Join Request");
      window.location.reload();
    }
  };

  const Open = async (subgreddiitId, e) => {
    e.preventDefault();

    let check = false;
    if (userData?.subgreddiits) {
      check = userData?.subgreddiits?.some(
        (s) => s.subgreddiit === subgreddiitId
      );
    }
    if (check) {
      try {
        const res = await fetch("http://localhost:5000/api/openingsg", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            subgreddiitId,
          }),
        });
        if (res.status === 201) {
          navigate(`/subgreddiits/${subgreddiitId}`);
        } else {
          console.log("Some Error");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      window.alert("You have to Join first to open");
    }
  };

  useEffect(() => {
    callSubgreddiitsPage();
  }, []);

  const Cancel = (subgreddiitId, e) => {
    e.preventDefault();
    navigate(`/subgreddiits/${subgreddiitId}/cancelrequest`);
  };

  const filtering = async (filter) => {
    try {
      const res = await fetch("http://localhost:5000/api/subgreddiitsfiltering", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          filter,
        }),
      });

      const data = await res.json();
      console.log(data);

      setSubGreddiits(data);

      if (res.status === 201) {
        // window.alert("Filtered Successfully");
        console.log("Filtered Successfully");
      } else {
        window.alert("Not Filtered Successfully");
        console.log("Not Filtered Successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const searchTagPage = async (tag) => {
    try {
      const res = await fetch("http://localhost:5000/api/tagsfiltering", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tag,
        }),
      });

      const data = await res.json();
      // console.log(data);

      setSubGreddiits(data);

      if (res.status === 201) {
        // window.alert("Filtered Successfully");
        console.log("Filtered Successfully");
      } else {
        window.alert("Not Filtered Successfully");
        console.log("Not Filtered Successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Leave = async (subgreddiitId, e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/subgreddiitsleaving", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subgreddiitId,
        userID,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      window.alert("Left Successfully");
      console.log("Left Successfully");
      setUserData({
        ...userData,
        leftSG: userData?.leftSG?.concat({ left: subgreddiitId }),
        subgreddiits: userData?.subgreddiits?.filter(
          (s) => s.subgreddiit !== subgreddiitId
        ),
        acceptedJoins: userData?.acceptedJoins?.filter(
          (a) => a.accept !== subgreddiitId
        ),
      });
      setSubGreddiits(
        subGreddiits?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                followers: s.followers?.filter((f) => f.follower !== userID),
              }
        )
      );
      setSearchResults(
        searchResults?.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                followers: s.followers?.filter((f) => f.follower !== userID),
              }
        )
      );
      // window.location.reload();
    } else if (res.status === 200) {
      window.alert("Owner Can't Leave");
    } else {
      window.alert("Cannot Leave");
      console.log("Cannot leave");
      window.location.reload();
    }
  };

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
        <h1>Subreddits Page</h1>
        <SubgreddiitSearchBar onSearch={handleSearch} />
        {sflag && (
          <p>
            <h3>Nothing Found</h3>
          </p>
        )}
        {searchResults.length >= 1 ? (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Searched SubGreddiits List</th>
              </tr>
            </thead>
            <tbody>
              {searchResults?.map((subGreddiit) => {
                const alreadyrequested = subGreddiit?.joinrequests?.some(
                  (s) => s.user?.userID === userData?._id
                );
                const alreadyfollow = subGreddiit?.followers?.some(
                  (s) => s.follower === userData?._id
                );
                return (
                  <>
                    {alreadyfollow ? (
                      <tr key={subGreddiit?._id}>
                        <td>
                          <i className="fas fa-file-alt"></i>{" "}
                          {subGreddiit?.name}
                          <p></p>
                          <p>Description : {subGreddiit?.description}</p>
                          <p>No. of People : {subGreddiit?.followers.length}</p>
                          <p>No. of Posts : {subGreddiit?.posts.length}</p>
                          <p>
                            Created on:{" "}
                            {new Date(
                              subGreddiit?.creationDate
                            ).toLocaleDateString()}
                          </p>
                          {/* <p>
                      Banned KeyWords :{" "}
                      {subGreddiit?.bannedKeyWords
                        .map((keyword) => keyword.keyword)
                        .join(", ")}
                    </p> */}
                        </td>
                        <td>
                          {" "}
                          <button
                            onClick={(e) => Open(subGreddiit?._id, e)}
                            className="green"
                            style={{ fontSize: "13px" }}
                          >
                            <i
                              className="fas fa-user-plus"
                              style={{ color: "orange", fontSize: "13px" }}
                            ></i>
                            {"  "}Open
                          </button>
                        </td>
                        {!alreadyrequested && !alreadyfollow ? (
                          <td>
                            {" "}
                            <button
                              onClick={(e) => Join(subGreddiit?._id, e)}
                              className="followButton"
                              style={{ fontSize: "13px" }}
                            >
                              <i
                                className="fas fa-user-plus"
                                style={{ color: "green", fontSize: "13px" }}
                              ></i>
                              {"  "}Join
                            </button>
                          </td>
                        ) : !alreadyfollow ? (
                          <td>
                            {" "}
                            <button
                              onClick={(e) => Cancel(subGreddiit?._id, e)}
                              className="orange"
                              style={{ fontSize: "13px" }}
                              // disabled={true}
                            >
                              <i
                                className="fas fa-user-plus"
                                style={{ color: "green", fontSize: "13px" }}
                              ></i>
                              {"  "}Deciding
                            </button>
                          </td>
                        ) : (
                          <td>
                            {" "}
                            <button
                              onClick={(e) => Leave(subGreddiit?._id, e)}
                              className="red"
                              style={{ fontSize: "13px" }}
                              disabled={subGreddiit?.owner === userData?._id}
                            >
                              <i
                                className="fas fa-user-plus"
                                style={{ color: "black", fontSize: "13px" }}
                              ></i>
                              {"  "}Leave
                            </button>
                          </td>
                        )}
                      </tr>
                    ) : (
                      <>
                        <tr key={subGreddiit?._id}>
                          <td>
                            <i className="fas fa-file-alt"></i>{" "}
                            {subGreddiit?.name}
                            <p></p>
                            <p>Description : {subGreddiit?.description}</p>
                            <p>
                              No. of People : {subGreddiit?.followers.length}
                            </p>
                            <p>No. of Posts : {subGreddiit?.posts.length}</p>
                            <p>
                              Created on:{" "}
                              {new Date(
                                subGreddiit?.creationDate
                              ).toLocaleDateString()}
                            </p>
                            {/* <p>
                    Banned KeyWords :{" "}
                    {subGreddiit?.bannedKeyWords
                      .map((keyword) => keyword.keyword)
                      .join(", ")}
                  </p> */}
                          </td>
                          <td>
                            {" "}
                            <button
                              onClick={(e) => Open(subGreddiit?._id, e)}
                              className="green"
                              style={{ fontSize: "13px" }}
                            >
                              <i
                                className="fas fa-user-plus"
                                style={{ color: "orange", fontSize: "13px" }}
                              ></i>
                              {"  "}Open
                            </button>
                          </td>
                          {!alreadyrequested && !alreadyfollow ? (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Join(subGreddiit?._id, e)}
                                className="followButton"
                                style={{ fontSize: "13px" }}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "green", fontSize: "13px" }}
                                ></i>
                                {"  "}Join
                              </button>
                            </td>
                          ) : !alreadyfollow ? (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Cancel(subGreddiit?._id, e)}
                                className="orange"
                                style={{ fontSize: "13px" }}
                                // disabled={true}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "green", fontSize: "13px" }}
                                ></i>
                                {"  "}Deciding
                              </button>
                            </td>
                          ) : (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Leave(subGreddiit?._id, e)}
                                className="red"
                                style={{ fontSize: "13px" }}
                                disabled={subGreddiit?.owner === userData?._id}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "black", fontSize: "13px" }}
                                ></i>
                                {"  "}Leave
                              </button>
                            </td>
                          )}
                        </tr>
                      </>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        ) : (
          <>
            <p></p>
            <p></p>
            <button className="btnsize" onClick={() => filtering("nameAsc")}>
              Ascending
            </button>{" "}
            <button className="btnsize" onClick={() => filtering("nameDesc")}>
              Descending
            </button>{" "}
            <button className="btnsize" onClick={() => filtering("followers")}>
              Followers
            </button>{" "}
            <button
              className="btnsize"
              onClick={() => filtering("creationDate")}
            >
              Creation Date
            </button>{" "}
            <p></p>
            <p></p>
            <h3>Search By Tags:</h3>
            <div className="button-container">
              {uniqueTags.map((tag) => (
                <h1 key={tag}>
                  <button
                    className="btnsize"
                    onClick={() => searchTagPage(tag)}
                  >
                    {tag}
                  </button>{" "}
                </h1>
              ))}
            </div>
            <p></p>
            <p></p>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Joined SubGreddiits List</th>
                </tr>
              </thead>
              <tbody>
                {subGreddiits?.map((subGreddiit) => {
                  const alreadyrequested = subGreddiit?.joinrequests.some(
                    (s) => s?.user?.userID === userData?._id
                  );
                  const alreadyfollow = subGreddiit?.followers.some(
                    (s) => s?.follower === userData?._id
                  );
                  return (
                    <>
                      {alreadyfollow && (
                        <tr key={subGreddiit?._id}>
                          <td>
                            <i className="fas fa-file-alt"></i>{" "}
                            {subGreddiit?.name}
                            <p></p>
                            <p>Description : {subGreddiit?.description}</p>
                            <p>
                              No. of People : {subGreddiit?.followers.length}
                            </p>
                            <p>No. of Posts : {subGreddiit?.posts.length}</p>
                            <p>
                              Created on:{" "}
                              {new Date(
                                subGreddiit?.creationDate
                              ).toLocaleDateString()}
                            </p>
                            {/* <p>
                      Banned KeyWords :{" "}
                      {subGreddiit?.bannedKeyWords
                        .map((keyword) => keyword.keyword)
                        .join(", ")}
                    </p> */}
                          </td>
                          <td>
                            {" "}
                            <button
                              onClick={(e) => Open(subGreddiit?._id, e)}
                              className="green"
                              style={{ fontSize: "13px" }}
                            >
                              <i
                                className="fas fa-user-plus"
                                style={{ color: "orange", fontSize: "13px" }}
                              ></i>
                              {"  "}Open
                            </button>
                          </td>
                          {!alreadyrequested && !alreadyfollow ? (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Join(subGreddiit?._id, e)}
                                className="followButton"
                                style={{ fontSize: "13px" }}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "green", fontSize: "13px" }}
                                ></i>
                                {"  "}Join
                              </button>
                            </td>
                          ) : !alreadyfollow ? (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Cancel(subGreddiit?._id, e)}
                                className="orange"
                                style={{ fontSize: "13px" }}
                                // disabled={true}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "green", fontSize: "13px" }}
                                ></i>
                                {"  "}Deciding
                              </button>
                            </td>
                          ) : (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Leave(subGreddiit?._id, e)}
                                className="red"
                                style={{ fontSize: "13px" }}
                                disabled={subGreddiit?.owner === userData?._id}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "black", fontSize: "13px" }}
                                ></i>
                                {"  "}Leave
                              </button>
                            </td>
                          )}
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Remaining SubGreddiits List</th>
                </tr>
              </thead>
              <tbody>
                {subGreddiits?.map((subGreddiit) => {
                  const alreadyrequested = subGreddiit?.joinrequests?.some(
                    (s) => s?.user?.userID === userData?._id
                  );
                  const alreadyfollow = subGreddiit?.followers?.some(
                    (s) => s?.follower === userData?._id
                  );
                  return (
                    <>
                      {!alreadyfollow && (
                        <tr key={subGreddiit?._id}>
                          <td>
                            <i className="fas fa-file-alt"></i>{" "}
                            {subGreddiit?.name}
                            <p></p>
                            <p>Description : {subGreddiit?.description}</p>
                            <p>
                              No. of People : {subGreddiit?.followers.length}
                            </p>
                            <p>No. of Posts : {subGreddiit?.posts.length}</p>
                            <p>
                              Created on:{" "}
                              {new Date(
                                subGreddiit?.creationDate
                              ).toLocaleDateString()}
                            </p>
                            {/* <p>
                    Banned KeyWords :{" "}
                    {subGreddiit?.bannedKeyWords
                      .map((keyword) => keyword.keyword)
                      .join(", ")}
                  </p> */}
                          </td>
                          <td>
                            {" "}
                            <button
                              onClick={(e) => Open(subGreddiit?._id, e)}
                              className="green"
                              style={{ fontSize: "13px" }}
                            >
                              <i
                                className="fas fa-user-plus"
                                style={{ color: "orange", fontSize: "13px" }}
                              ></i>
                              {"  "}Open
                            </button>
                          </td>
                          {!alreadyrequested && !alreadyfollow ? (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Join(subGreddiit?._id, e)}
                                className="followButton"
                                style={{ fontSize: "13px" }}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "green", fontSize: "13px" }}
                                ></i>
                                {"  "}Join
                              </button>
                            </td>
                          ) : !alreadyfollow ? (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Cancel(subGreddiit?._id, e)}
                                className="orange"
                                style={{ fontSize: "13px" }}
                                // disabled={true}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "green", fontSize: "13px" }}
                                ></i>
                                {"  "}Deciding
                              </button>
                            </td>
                          ) : (
                            <td>
                              {" "}
                              <button
                                onClick={(e) => Leave(subGreddiit?._id, e)}
                                className="red"
                                style={{ fontSize: "13px" }}
                                disabled={subGreddiit?.owner === userData?._id}
                              >
                                <i
                                  className="fas fa-user-plus"
                                  style={{ color: "black", fontSize: "13px" }}
                                ></i>
                                {"  "}Leave
                              </button>
                            </td>
                          )}
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </>
    );
}

export default Subgreddiits;

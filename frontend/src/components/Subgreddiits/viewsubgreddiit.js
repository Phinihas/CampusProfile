import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { NavLink } from "react-router-dom";
import "./viewsubgreddiit.css";
// import Modal from "@mui/material/Modal";
import Modal from "react-modal";
import photo from "../Profile/download.png";

Modal.setAppElement("#root");

function Viewsubgreddiit(props) {
  const { subgreddiitId } = useParams();
  // console.log(subgreddiitId);
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [reportConcern, setReportConcern] = useState("");
  const [postName, setPostName] = useState("");
  const [description, setDescription] = useState("");
  // const [LoadAgain, setLoadAgain] = useState(false);
  const [users, setUsers] = useState([]);
  // const [commentPostID, setCommentPostID] = useState(false);
  // const [ThisSubGreddiit, setThisSubGreddiit] = useState({});

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handlePostOpenModal = () => {
    setIsPostOpen(true);
  };

  const handleInputChange = (event) => {
    setReportConcern(event.target.value);
  };

  const handlePostNameInputChange = (event) => {
    setPostName(event.target.value);
  };

  const handlePostDescriptionInputChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    // Do something with the input value
    // console.log(reportConcern);

    // Close the modal
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const closePostModal = () => {
    setIsPostOpen(false);
  };

  const handleCommentClick = (postID, e) => {
    e.preventDefault();
    if (showCommentField === postID) setShowCommentField(false);
    else {
      setShowCommentField(postID);
      // setCommentPostID(postID);
    }
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    // send comment to server
    setShowCommentField(false);
    // setCommentPostID(false);
    setComment("");
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", { withCredentials: true })
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

  const userID = userData?._id;
  const like = async (postID, e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/likes", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          subgreddiitId,
          postID,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log("Liked Successfully");
        // window.alert("Liked Successfully");
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  posts: s.posts?.map((p) =>
                    p._id !== postID
                      ? p
                      : {
                          ...p,
                          likes: p.likes.concat({ like: userID }),
                        }
                  ),
                }
          )
        );
        // window.location.reload();
      } else if (res.status === 200) {
        console.log("Removed Like Successfully");
        // window.alert("Removed Like Successfully");
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  posts: s.posts?.map((p) =>
                    p._id !== postID
                      ? p
                      : {
                          ...p,
                          likes: p.likes?.filter((l) => l.like != userID),
                        }
                  ),
                }
          )
        );
        // window.location.reload();
      } else {
        console.log("Like Operation Not done successfully");
        window.alert("Like Operation Not done successfully");
      }
    } catch (e) {
      console.log(e);
    }
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
        followings: userData?.followings.filter(
          (f) => f.following !== follower
        ),
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
            : { ...u, followers: u.followers.filter((f) => f.follower !== id) }
        )
      );
      // window.location.reload();
    } else {
      window.alert("Error");
    }
  };

  const deleteComment = async (owner, commentID, postID, commentedByID, e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/deletecommentsfromsubgreddiit", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          owner,
          postID,
          commentID,
          commentedByID,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log("Comment Deleted Successfully");
        // window.alert("Comment Deleted Successfully");
        setSubGreddiits((subGreddiits) => {
          const updatedSubGreddiits = subGreddiits?.map((subGreddiit) => {
            if (subGreddiit?._id === subgreddiitId) {
              return {
                ...subGreddiit,
                posts: subGreddiit?.posts?.map((post) => {
                  if (post._id === postID) {
                    return {
                      ...post,
                      comments: post?.comments?.filter(
                        (comment) => comment._id !== commentID
                      ),
                    };
                  }
                  return post;
                }),
              };
            }
            return subGreddiit;
          });
          return updatedSubGreddiits;
        });
      } else if (res.status === 200) {
        console.log("Can't Delete Others");
        window.alert("Can't Delete Others");
      } else {
        console.log("Comment Delete Operation Not done successfully");
        window.alert("Comment Delete Operation Not done successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dislike = async (postID, e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/dislikes", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          subgreddiitId,
          postID,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log("Disliked Successfully");
        // window.alert("Disliked Successfully");
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  posts: s.posts?.map((p) =>
                    p._id !== postID
                      ? p
                      : {
                          ...p,
                          dislikes: p.dislikes.concat({ dislike: userID }),
                        }
                  ),
                }
          )
        );
        // window.location.reload();
      } else if (res.status === 200) {
        console.log("Removed Dislike Successfully");
        // window.alert("Removed Dislike Successfully");
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  posts: s.posts?.map((p) =>
                    p._id !== postID
                      ? p
                      : {
                          ...p,
                          dislikes: p.dislikes?.filter(
                            (l) => l.dislike != userID
                          ),
                        }
                  ),
                }
          )
        );
        // window.location.reload();
      } else {
        console.log("Dislike Operation Not done successfully");
        window.alert("Dislike Operation Not done successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const user_name = userData?.userName;

  const postComment = async (postID, comment, e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_name,
          userID,
          subgreddiitId,
          postID,
          comment,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log("Commented Successfully");
        // window.alert("Commented Successfully");
        setShowCommentField(false);
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  posts: s.posts?.map((p) =>
                    p._id !== postID
                      ? p
                      : {
                          ...p,
                          comments: p.comments.concat({
                            commentedByID: userID,
                            comment: comment,
                            commentedBy: user_name,
                          }),
                        }
                  ),
                }
          )
        );
        // window.location.reload();
      } else {
        console.log("Comment Operation Not done successfully");
        window.alert("Comment Operation Not done successfully");
        setShowCommentField(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const savePost = async (subgreddiitId, postId, e) => {
    // console.log(postId);
    try {
      const res = await fetch("http://localhost:5000/api/savepost", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          subgreddiitId,
          postId,
        }),
      });
      // const data = await res.json();
      const saved = { subgreddiitId: subgreddiitId, postId: postId };
      if (res.status === 201) {
        console.log("Post Saved Successfully");
        // window.alert("Post Saved Successfully");
        setUserData({
          ...userData,
          savedPosts: userData?.savedPosts.concat({ saved: saved }),
        });
        // window.location.reload();
      } else if (res.status === 200) {
        console.log("You already saved this post");
        window.alert("You already saved this post");
      } else {
        console.log("Post not Saved");
        window.alert("Post not Saved");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const reportPost = async (
    subgreddiitId,
    reportedTo,
    abuser,
    concern,
    postId,
    postName,
    e
  ) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/reportpost", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID,
          user_name,
          subgreddiitId,
          reportedTo,
          abuser,
          concern,
          postId,
          postName,
        }),
      });
      // const data = await res.json();

      if (res.status === 201) {
        console.log("Post Reported Successfully");
        window.alert("Post Reported Successfully");
        setSubGreddiits(
          subGreddiits?.map((s) =>
            s._id !== subgreddiitId
              ? s
              : {
                  ...s,
                  reported: s.reported.concat({
                    reportedByName: user_name,
                    postName: postName,
                    reportedBy: userID,
                    reportedTo: reportedTo,
                    reportedToName: abuser,
                    text: concern,
                    post: postId,
                  }),
                }
          )
        );
        setIsOpen(false);
        // window.location.reload();
      } else {
        console.log("Post not Reported");
        window.alert("Post not Reported");
        setIsOpen(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deletePost = async (subgreddiitId, postId, e) => {
    try {
      const res = await fetch("http://localhost:5000/api/sdeletepost", {
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
              : {
                  ...s,
                  posts: s.posts?.filter((p) => p._id !== postId),
                }
          )
        );
        // window.location.reload();
      } else {
        console.log("Post not Deleted");
        window.alert("Post not Deleted");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goMySubGreddiits = () => {
    navigate("/subgreddiits");
    window.location.reload();
  };
  // const Post = (e) => {
  //   e.preventDefault();
  //   navigate(`/subgreddiits/${subgreddiitId}/createpost`);
  // };

  const postedBy = { userName: user_name, Id: userID };
  const Post = async (postName, description, postedIn, e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/creatingposts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
      setIsPostOpen(false);
      window.location.reload();
    } else if (res.status === 200) {
      // window.alert("Creation Successful");
      console.log("Successful creation");
      setSubGreddiits(
        subGreddiits.map((s) =>
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
      setIsPostOpen(false);
      window.location.reload();
    } else {
      console.log("creation failed");
      window.alert("creation failed");
    }
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
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Subgreddiit Info</th>
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
                <tr key={subGreddiit?._id}>
                  {!yourSubGreddiit ? (
                    <></>
                  ) : (
                    <>
                      <td>
                        <img src={photo} />
                      </td>
                      <td>
                        <i className="fas fa-file-alt"></i> {subGreddiit?.name}
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
                        <p>
                          Tags :{" "}
                          {subGreddiit?.tags?.map((tag) => tag.tag).join(", ")}
                        </p>
                        <p>
                          Banned KeyWords :{" "}
                          {subGreddiit?.bannedKeyWords
                            ?.map((keyword) => keyword.keyword)
                            .join(", ")}
                        </p>
                      </td>
                      <td>
                        <button
                          className="btnsize"
                          onClick={handlePostOpenModal}
                          // disabled={alreadyreported && ireported}
                        >
                          <i
                            className="fas fa-plus"
                            style={{ color: "yellowgreen", fontSize: "13px" }}
                          ></i>
                          {"  "}Post
                        </button>
                        <Modal
                          isOpen={isPostOpen}
                          onRequestClose={closePostModal}
                          contentLabel="Example Modal"
                          style={{
                            content: {
                              width: "600px",
                              height: "250px",
                              margin: "auto",
                            },
                          }}
                        >
                          <h2>Post</h2>
                          <form onSubmit={handleSubmit}>
                            <label htmlFor="input-field">Name: </label>{" "}
                            <input
                              id="Enter Post Name"
                              type="text"
                              value={postName}
                              style={{ width: "100%" }}
                              onChange={handlePostNameInputChange}
                            />
                            <p></p>
                            <label htmlFor="input-field">
                              Description:{" "}
                            </label>{" "}
                            <input
                              id="Enter Post description"
                              type="text-area"
                              value={description}
                              style={{ width: "100%" }}
                              onChange={handlePostDescriptionInputChange}
                            />
                            <p></p>
                            <button
                              type="submit"
                              onClick={(e) =>
                                Post(postName, description, subGreddiit?._id, e)
                              }
                            >
                              Submit
                            </button>{" "}
                            <button type="button" onClick={closePostModal}>
                              Cancel
                            </button>
                          </form>
                        </Modal>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <table className="table table-bordered table-striped table-full-width">
          <thead>
            <tr>
              <th>Posts</th>
            </tr>
          </thead>
          {subGreddiits?.map((subGreddiit) => {
            const yourSubGreddiit = subGreddiit?._id === subgreddiitId;
            return (
              <tbody key={subGreddiit?._id}>
                {!yourSubGreddiit ? (
                  <></>
                ) : (
                  <>
                    {subGreddiit?.posts?.map((post) => {
                      const Alreadylike = post.likes?.some(
                        (l) => l.like === userID
                      );
                      const Alreadydislike = post?.dislikes?.some(
                        (l) => l.dislike === userID
                      );
                      const alreadyfollow = userData?.followings?.some(
                        (following) => following.following === post.postedBy.Id
                      );
                      const isBlocked = subGreddiit?.blockedSG?.some(
                        (b) => b.blocked === post.postedBy.Id
                      );
                      const alreadySaved = userData?.savedPosts?.some(
                        (p) => p.saved.postId === post._id
                      );
                      const alreadyreported = subGreddiit?.reported?.some(
                        (r) => r.post === post._id
                      );
                      const ireported = subGreddiit?.reported?.some(
                        (r) => r.reportedBy === userID
                      );
                      const mePosted = post.postedBy.Id === userData?._id;
                      const postedOwner =
                        post.postedBy.Id === subGreddiit?.owner;
                      // console.log(mePosted);
                      const meOwner = subGreddiit?.owner === userData?._id;
                      return (
                        <tr key={post._id}>
                          <td>
                            <p>
                              Name: {post.postName}{" "}
                              {!alreadySaved && (
                                <>
                                  <button
                                    onClick={(e) =>
                                      savePost(subGreddiit?._id, post._id, e)
                                    }
                                    className="btnsize"
                                  >
                                    Save
                                  </button>
                                </>
                              )}{" "}
                              {(mePosted || meOwner) && (
                                <button
                                  className="btnsize"
                                  onClick={(e) =>
                                    deletePost(subGreddiit?._id, post._id, e)
                                  }
                                >
                                  Delete
                                </button>
                              )}{" "}
                              {!meOwner &&
                                !mePosted &&
                                !postedOwner &&
                                !isBlocked && (
                                  <>
                                    <button
                                      className="btnsize"
                                      onClick={handleOpenModal}
                                      // disabled={alreadyreported && ireported}
                                    >
                                      Report
                                    </button>
                                    <Modal
                                      isOpen={isOpen}
                                      onRequestClose={closeModal}
                                      contentLabel="Example Modal"
                                      style={{
                                        content: {
                                          width: "400px",
                                          height: "200px",
                                          margin: "auto",
                                        },
                                      }}
                                    >
                                      <h2>Report</h2>
                                      <form onSubmit={handleSubmit}>
                                        <label htmlFor="input-field">
                                          Concern:
                                        </label>
                                        <input
                                          id="Type your Concern"
                                          type="text"
                                          value={reportConcern}
                                          onChange={handleInputChange}
                                        />
                                        <p></p>
                                        <button
                                          type="submit"
                                          onClick={(e) =>
                                            reportPost(
                                              subGreddiit?._id,
                                              post.postedBy.Id,
                                              post.postedBy.userName,
                                              reportConcern,
                                              post._id,
                                              post.postName,
                                              e
                                            )
                                          }
                                        >
                                          Submit
                                        </button>{" "}
                                        <button
                                          type="button"
                                          onClick={closeModal}
                                        >
                                          Cancel
                                        </button>
                                      </form>
                                    </Modal>
                                  </>
                                )}
                            </p>
                            <p>
                              {!isBlocked ? (
                                <>Posted by: {post.postedBy.userName} </>
                              ) : (
                                <>Posted by: Blocked User</>
                              )}{" "}
                              {post?.postedBy.Id !== userID && (
                                <>
                                  {!alreadyfollow ? (
                                    <>
                                      {" "}
                                      <button
                                        onClick={(e) =>
                                          followUnfollow(post.postedBy.Id, e)
                                        }
                                        className="followButton"
                                        style={{ fontSize: "13px" }}
                                      >
                                        <i
                                          className="fas fa-user-plus"
                                          style={{
                                            color: "blue",
                                            fontSize: "13px",
                                          }}
                                        ></i>
                                        {"  "}Follow
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <button
                                        onClick={(e) =>
                                          followUnfollow(post.postedBy.Id, e)
                                        }
                                        className="followButton"
                                        style={{ fontSize: "13px" }}
                                      >
                                        <i
                                          className="fas fa-user-plus"
                                          style={{
                                            color: "red",
                                            fontSize: "13px",
                                          }}
                                        ></i>
                                        {"  "}Unfollow
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                            </p>
                            <p className="highlight-description">
                              {post.description}
                            </p>
                            <p>
                              {Alreadylike ? (
                                <button
                                  onClick={(e) => like(post._id, e)}
                                  className="btnsize"
                                >
                                  <i
                                    className="fas fa-thumbs-up"
                                    style={{ color: "pink" }}
                                  ></i>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => like(post._id, e)}
                                  className="btnsize"
                                  disabled={Alreadydislike}
                                >
                                  <i
                                    className="fas fa-thumbs-up"
                                    style={{ color: "white" }}
                                  ></i>
                                </button>
                              )}{" "}
                              Likes: {post.likes.length}
                            </p>
                            <p>
                              {Alreadydislike ? (
                                <button
                                  onClick={(e) => dislike(post._id, e)}
                                  className="btnsize"
                                >
                                  {" "}
                                  <i
                                    className="fas fa-thumbs-down"
                                    style={{ color: "pink" }}
                                  ></i>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => dislike(post._id, e)}
                                  className="btnsize"
                                  disabled={Alreadylike}
                                >
                                  {" "}
                                  <i
                                    className="fas fa-thumbs-down"
                                    style={{ color: "white" }}
                                  ></i>
                                </button>
                              )}{" "}
                              Dislikes: {post.dislikes.length}
                            </p>
                            <p>
                              <button
                                onClick={(e) => handleCommentClick(post._id, e)}
                                className="btnsize"
                              >
                                <i className="fas fa-comment"></i>
                              </button>{" "}
                              Comments:
                            </p>
                            {showCommentField === post._id && (
                              <form onSubmit={handleCommentSubmit}>
                                <input
                                  type="text"
                                  value={comment}
                                  onChange={(event) =>
                                    setComment(event.target.value)
                                  }
                                />{" "}
                                <button
                                  type="submit"
                                  onClick={(e) =>
                                    postComment(post._id, comment, e)
                                  }
                                >
                                  {" "}
                                  Comment
                                </button>
                              </form>
                            )}
                            <ul>
                              {post.comments?.map((comment) => (
                                <li key={comment._id}>
                                  <p></p>
                                  <p></p>
                                  {comment.commentedBy} - {comment.comment}{" "}
                                  {"  "} {"  "}
                                  {(subGreddiit?.owner === userID ||
                                    comment.commentedByID === userID) &&
                                    comment._id && (
                                      <button
                                        className="btnsize"
                                        onClick={(e) =>
                                          deleteComment(
                                            subGreddiit?.owner,
                                            comment._id,
                                            post._id,
                                            comment.commentedByID,
                                            e
                                          )
                                        }
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    )}
                                  <p></p>
                                  <p></p>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            );
          })}
        </table>
        {/* {setLoadAgain(true)} */}
      </>
    );
}

export default Viewsubgreddiit;

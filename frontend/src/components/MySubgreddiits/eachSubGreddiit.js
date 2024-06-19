import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./eachsubgreddiit.css";
import photo from "../Profile/download.png";

function EachSubGreddiit(props) {
  const { subgreddiitId } = useParams();
  // console.log(subgreddiitId);
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [subGreddiits, setSubGreddiits] = useState([]);
  const [users, setUsers] = useState([]);
  // const [commentPostID, setCommentPostID] = useState(false);
  // const [ThisSubGreddiit, setThisSubGreddiit] = useState({});

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
                          likes: p.likes.filter((l) => l.like != userID),
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
                          dislikes: p.dislikes.filter(
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
      // const data = await res.json();
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

  const deletePost = async (subgreddiitId, postId, e) => {
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
                posts: s.posts.filter((p) => p._id !== postId),
              }
        )
      );
      // window.location.reload();
    } else {
      console.log("Post not Deleted");
      window.alert("Post not Deleted");
    }
  };

  const savePost = async (subgreddiitId, postId, e) => {
    e.preventDefault();
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
      // setSubGreddiits(subGreddiits);
      // window.location.reload();
    } else if (res.status === 200) {
      console.log("You already saved this post");
      window.alert("You already saved this post");
    } else {
      console.log("Post not Saved");
      window.alert("Post not Saved");
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

  const goMySubGreddiits = () => {
    navigate("/mysubgreddiits");
    window.location.reload();
  };

  const deleteComment = async (commentID, postID, e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/deletecomments", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          postID,
          commentID,
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
        // window.location.reload();
      } else {
        console.log("Comment Delete Operation Not done successfully");
        window.alert("Comment Delete Operation Not done successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Post = (e) => {
    e.preventDefault();
    navigate(`/mysubgreddiits/${subgreddiitId}/createpost`);
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
                          onClick={(e) => Post(e)}
                          className="followButton"
                          style={{ fontSize: "13px" }}
                        >
                          <i
                            className="fas fa-plus"
                            style={{ color: "yellowgreen", fontSize: "13px" }}
                          ></i>
                          {"  "}Post
                        </button>
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
                      const Alreadylike = post?.likes?.some(
                        (l) => l.like === userID
                      );
                      const Alreadydislike = post?.dislikes?.some(
                        (l) => l.dislike === userID
                      );
                      const alreadyfollow = userData?.followings?.some(
                        (following) =>
                          following.following === post?.postedBy?.Id
                      );
                      const alreadySaved = userData?.savedPosts?.some(
                        (p) => p.saved.postId === post._id
                      );
                      const mePosted = post?.postedBy?.Id === userData?._id;
                      const meOwner = subGreddiit?.owner === userData?._id;
                      const isBlocked = subGreddiit?.blockedSG?.some(
                        (b) => b.blocked === post.postedBy.Id
                      );
                      return (
                        <tr key={post._id}>
                          <td>
                            <p>
                              Name: {post?.postName}{" "}
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
                              )}
                              {""}
                              {(mePosted || meOwner) && (
                                <button
                                  className="btnsize"
                                  onClick={(e) =>
                                    deletePost(subGreddiit?._id, post._id, e)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </p>
                            <p>
                              {!isBlocked ? (
                                <>Posted by: {post.postedBy.userName} </>
                              ) : (
                                <>Posted by: Blocked User</>
                              )}{" "}
                              {post.postedBy.Id !== userID && (
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
                              {post.comments.map((c) => (
                                <li key={c._id}>
                                  <p></p>
                                  <p></p>
                                  {c.commentedBy} - {c.comment} {"  "} {"  "}
                                  {c._id && (
                                    <button
                                      className="btnsize"
                                      onClick={(e) =>
                                        deleteComment(c._id, post._id, e)
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
      </>
    );
}

export default EachSubGreddiit;

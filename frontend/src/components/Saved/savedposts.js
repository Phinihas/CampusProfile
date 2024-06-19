import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
// import { NavLink } from "react-router-dom";
import "./savedposts.css";

function SavedPosts(props) {
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

  const userID = userData._id;
  const like = async (postID, subgreddiitId, e) => {
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
                  posts: s.posts.map((p) =>
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
                  posts: s.posts.map((p) =>
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
    const id = userData._id;

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
        followings: userData.followings.concat({ following: follower }),
      });
      setUsers(
        users.map((u) =>
          u._id !== id
            ? u
            : { ...u, followings: u.followings.concat({ following: follower }) }
        )
      );
      setUsers(
        users.map((u) =>
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
        followings: userData?.followings?.filter(
          (f) => f.following !== follower
        ),
      });
      setUsers(
        users?.map((u) =>
          u._id !== id
            ? u
            : {
                ...u,
                followings: u.followings?.filter(
                  (f) => f.following !== follower
                ),
              }
        )
      );
      setUsers(
        users?.map((u) =>
          u._id !== follower
            ? u
            : { ...u, followers: u.follower?.filter((f) => f.follower !== id) }
        )
      );
      // window.location.reload();
    } else {
      window.alert("Error");
    }
  };

  const deleteComment = async (
    owner,
    commentID,
    postID,
    commentedByID,
    subgreddiitId,
    e
  ) => {
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

  const dislike = async (postID, subgreddiitId, e) => {
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

  const unsavePost = async (subgreddiitId, postId, e) => {
    // console.log(postId);
    try {
      const res = await fetch("http://localhost:5000/api/unsavepost", {
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
        console.log("Post UnSaved Successfully");
        // window.alert("Post UnSaved Successfully");
        setUserData({
          ...userData,
          savedPosts: userData?.savedPosts?.filter(
            (s) => s.saved.postId !== postId
          ),
        });
        // window.location.reload();
      } else if (res.status === 200) {
        console.log("You already unsaved this post");
        window.alert("You already unsaved this post");
      } else {
        console.log("Post not Saved");
        window.alert("Post not Saved");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const user_name = userData?.userName;

  const postComment = async (postID, comment, subgreddiitId, e) => {
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
              <th>Saved Posts</th>
            </tr>
          </thead>
          {subGreddiits?.map((subGreddiit) => {
            let savedSubGreddiit = false;
            if (userData.savedPosts) {
              savedSubGreddiit = userData?.savedPosts.some(
                (s) => s.saved.subgreddiitId === subGreddiit?._id
              );
            }
            return (
              <tbody key={subGreddiit?._id}>
                {!savedSubGreddiit ? (
                  <></>
                ) : (
                  <>
                    <tr>
                      <th>
                        <i className="fas fa-file-alt"></i> {subGreddiit?.name}
                      </th>
                    </tr>
                    {subGreddiit?.posts?.map((post) => {
                      let Alreadylike = false;
                      if (post.likes) {
                        Alreadylike = post?.likes?.some(
                          (l) => l.like === userID
                        );
                      }

                      let Alreadydislike = false;
                      if (post.dislikes) {
                        Alreadydislike = post?.dislikes?.some(
                          (l) => l.dislike === userID
                        );
                      }
                      let alreadyfollow;
                      if (userData.followings) {
                        alreadyfollow = userData?.followings?.some(
                          (following) =>
                            following.following === post.postedBy.Id
                        );
                      }

                      let ispostSaved = false;
                      if (userData.savedPosts) {
                        ispostSaved = userData?.savedPosts?.some(
                          (p) => p.saved.postId === post._id
                        );
                      }

                      let isBlocked = false;
                      if (subGreddiit?.blockedSG) {
                        isBlocked = subGreddiit?.blockedSG?.some(
                          (b) => b.blocked === post.postedBy.Id
                        );
                      }
                      return (
                        <tr key={post._id}>
                          {ispostSaved && (
                            <td>
                              <p>
                                Name: {post.postName}{" "}
                                <button
                                  className="btnsize"
                                  onClick={(e) =>
                                    unsavePost(subGreddiit?._id, post._id, e)
                                  }
                                >
                                  unsave
                                </button>
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
                                    onClick={(e) =>
                                      like(post._id, subGreddiit?._id, e)
                                    }
                                    className="btnsize"
                                  >
                                    <i
                                      className="fas fa-thumbs-up"
                                      style={{ color: "pink" }}
                                    ></i>
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) =>
                                      like(post._id, subGreddiit?._id, e)
                                    }
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
                                    onClick={(e) =>
                                      dislike(post._id, subGreddiit?._id, e)
                                    }
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
                                    onClick={(e) =>
                                      dislike(post._id, subGreddiit?._id, e)
                                    }
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
                                  onClick={(e) =>
                                    handleCommentClick(post._id, e)
                                  }
                                  className="btnsize"
                                >
                                  <i className="fas fa-comment"></i>
                                </button>{" "}
                                Comments:
                              </p>
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
                                              subGreddiit?._id,
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
                                      postComment(
                                        post._id,
                                        comment,
                                        subGreddiit?._id,
                                        e
                                      )
                                    }
                                  >
                                    {" "}
                                    Comment
                                  </button>
                                </form>
                              )}
                            </td>
                          )}
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

export default SavedPosts;

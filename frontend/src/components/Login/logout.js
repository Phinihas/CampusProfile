import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Logout(props) {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("user");
    props.setflag(false);
    fetch("http://localhost:5000/api/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        navigate("/login", { relace: true });
        if (res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

export default Logout;

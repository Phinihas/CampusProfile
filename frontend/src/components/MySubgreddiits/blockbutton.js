import React, { useState, useEffect } from "react";
import axios from "axios";
const BlockButton = (props) => {

 
  const [timeLeft, setTimeLeft] = useState(3);
  const [startimer, setstartimer] = useState(false);
  const [subGreddiits, setSubGreddiits] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fsubgreddiits", {withCredentials: true})
      .then((res) => setSubGreddiits(res.data))
      .catch((err) => console.error(err));
  }, []);

  const subgreddiitId = props.subgreddiitId;
  const report = props.report;
  const reportPost = report?.reportedTo;
  const reportId = report?._id;

  

  useEffect(() => {
    let intervalId = null;
    if (startimer) {
      intervalId = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft === 0) {
            clearInterval(intervalId);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [startimer]);

  const handleBlock = async () => {
    const res = await fetch("http://localhost:5000/api/blockuser", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subgreddiitId,
        reportPost,
        reportId,
      }),
    });
    // const data = await res.json();

    if (res.status === 201) {
      console.log("User Blocked Successfully");
      window.alert("User Blocked Successfully");
      setSubGreddiits(
        subGreddiits.map((s) =>
          s._id !== subgreddiitId
            ? s
            : {
                ...s,
                blockedSG: s.blockedSG.concat({ blocked: reportPost }),
              }
        )
      );
      // window.location.reload();
    } else if (res.status === 200) {
      console.log("User Already Blocked ");
      window.alert("User Already Blocked ");
    } else {
      console.log("User not Blocked");
      window.alert("User not Blocked");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
     handleBlock();
    }
  }, [timeLeft]);

  return (
    <>
      {timeLeft === 3 && !startimer ? (
        <button
          disabled={report?.ignored}
          onClick={() => setstartimer(true)}
        >
          Block
        </button>
      ) : (
        <button
          disabled={timeLeft === 0}
          onClick={() => {
            setstartimer(false);
            setTimeLeft(3);
          }}
        >
          {" "}
          cancel in {timeLeft}
        </button>
      )}
    </>
  );
};

export default BlockButton;

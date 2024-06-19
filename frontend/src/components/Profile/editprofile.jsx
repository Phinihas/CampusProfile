import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./editprofile.css";

function Editprofile(props) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [RegDisable, setRegDisable] = useState(true);

  const callEditProfilePage = async () => {
    try {
      const res  = await fetch("http://localhost:5000/api/editprofile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setUser(data);

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
    callEditProfilePage();
  }, []);

  const isValidRegUserName = /^[a-zA-Z0-9._-]{3,15}$/.test(user.userName);
  const isValidEmail = /^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email);
  const isValidContactNumber = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(user.contactNumber);
  const isValidAge = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(user.age);
  const isValidFirstName = /^[a-zA-Z ]+$/.test(user.firstName);
  const isValidLastName = /^[a-zA-Z ]+$/.test(user.lastName);

  useEffect(() => {
    user.userName === "" ||
    user.email === "" ||
    user.skills === "" ||
    user.contactNumber === "" ||
    user.firstName === "" ||
    user.lastName === "" ||
    user.age === "" ||
    !isValidRegUserName ||
    !isValidFirstName ||
    !isValidLastName ||
    !isValidEmail || 
    !isValidContactNumber ||
    !isValidAge
      ? setRegDisable(true)
      : setRegDisable(false);
  }, [
    user.userName,
    user.email,
    user.skills,
    user.contactNumber,
    user.firstName,
    user.lastName,
    user.age,
    isValidRegUserName,
    isValidFirstName,
    isValidLastName,
    isValidEmail,
    isValidContactNumber,
    isValidAge,
  ]);

  let name, value;

  const handleInputs = (event) => {
    name = event.target.name;
    value = event.target.value;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handlingProfile = async (e) => {
    e.preventDefault();
    const { _id, firstName, lastName, userName, email, skills, age, contactNumber } = user;
    const res = await fetch("http://localhost:5000/api/editprofile", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        firstName,
        lastName,
        userName,
        email,
        skills,
        age,
        contactNumber,
      }),
    });
    const data = await res.json();

    if (res.status === 422) {
      window.alert("A user with the provided email exists");
    } else if (res.status === 400 || !data) {
      window.alert("Update not done");
    } else {
      window.alert("Update Successful");
      setUser({
        ...user,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        skills: skills,
        age: age,
        contactNumber: contactNumber,
      });
      navigate("/profile");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      props.setflag(false);
      navigate("/login");
    } else {
      props.setflag(true);
    }
  });

  const goProfile = () => {
    navigate("/profile");
  };

  if (!loaded)
    return (
      <h1>
        Loading... <i className="fas fa-sync-alt fa-spin"></i>
      </h1>
    );
  else
    return (
      <div className="wrapper d-flex align-items-center justify-content-center">
        <div className="editProfile bg-light p-4 rounded shadow-sm">
          <form onSubmit={handleSubmit} method="PUT">
            <div className="form-group was-validated mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                className="form-control"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={user.firstName}
                onChange={handleInputs}
                required
                pattern="^[a-zA-Z ]+$"
              />
            </div>

            <div className="form-group was-validated mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                className="form-control"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={user.lastName}
                onChange={handleInputs}
                required
                pattern="^[a-zA-Z ]+$"
              />
            </div>

            <div className="form-group was-validated mb-3">
              <label htmlFor="userName" className="form-label">User Name</label>
              <input
                className="form-control"
                name="userName"
                type="text"
                placeholder="Enter user name"
                value={user.userName}
                onChange={handleInputs}
                required
                minLength={5}
                pattern="^[a-zA-Z0-9._-]{3,15}$"
              />
              <div className="invalid-feedback">User Name not available</div>
            </div>

            <div className="form-group was-validated mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                className="form-control"
                name="email"
                type="email"
                placeholder="Enter email"
                value={user.email}
                onChange={handleInputs}
                required
                pattern="^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
              />
            </div>

            <div className="form-group was-validated mb-3">
              <label htmlFor="skills" className="form-label">Skills</label>
              <input
                className="form-control"
                name="skills"
                type="text"
                placeholder="Enter skills"
                value={user.skills}
                onChange={handleInputs}
                required
              />
            </div>

            <div className="form-group was-validated mb-3">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                className="form-control"
                name="age"
                type="text"
                placeholder="Enter age"
                value={user.age}
                onChange={handleInputs}
                required
                pattern="^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$"
              />
            </div>

            <div className="form-group was-validated mb-3">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input
                className="form-control"
                name="contactNumber"
                type="text"
                placeholder="Enter contact number"
                value={user.contactNumber}
                onChange={handleInputs}
                required
                pattern="^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mb-3"
              onClick={handlingProfile}
              disabled={RegDisable}
            >
              Save
            </button>
            <p className="text-center">
              Don't want to Update?{" "}
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={goProfile}
              >
                Cancel
              </button>
            </p>
          </form>
        </div>
      </div>
    );
}

export default Editprofile;

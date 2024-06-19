import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    skills: "",
    age: "",
    contactNumber: "",
    password: "",
  });

  const [currentPage, setCurrentPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(true);
  const [RegDisable, setRegDisable] = useState(true);

  const isValidUserEmail =
    /^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  const isValidRegUserName = /^[a-zA-Z0-9._-]{3,15}$/.test(user.userName);
  const isValidEmail =
    /^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email);
  const isValidContactNumber =
    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(user.contactNumber);
  const isValidAge = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(user.age);
  const isValidFirstName = /^[a-zA-Z ]+$/.test(user.firstName);
  const isValidLastName = /^[a-zA-Z ]+$/.test(user.lastName);

  useEffect(() => {
    email === "" || password === "" || !isValidUserEmail || password.length < 5
      ? setDisable(true)
      : setDisable(false);
  }, [email, password, isValidUserEmail, password.length]);

  useEffect(() => {
    user.userName === "" ||
    user.password === "" ||
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
    !isValidAge ||
    user.password.length < 5
      ? setRegDisable(true)
      : setRegDisable(false);
  }, [
    user.userName,
    user.password,
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
    user.password.length,
  ]);

  let name, value;

  const handleInputs = (event) => {
    name = event.target.name;
    value = event.target.value;

    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/Profile");
    }
  }, [navigate]);

  const postData = async (page, e) => {
    e.preventDefault();

    setCurrentPage(page);

    const {
      firstName,
      lastName,
      userName,
      email,
      skills,
      age,
      contactNumber,
      password,
    } = user;

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        userName,
        email,
        skills,
        age,
        contactNumber,
        password,
      }),
    });

    const data = await res.json();

    if (res.status === 422 || !data) {
      window.alert("Registration Failed");
      console.log("Invalid Registration");
    } else {
      window.alert("Registration Successful");
      console.log("Successful Registration");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (currentPage === "login") {
      console.log("Logging in with email:", email, "and password:", password);
    } else {
      console.log("Registering with email:", user.email, "and password:", user.password);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlingProfile = async (e) => {
    e.preventDefault();
    setDisable(true);
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();

    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
    } else {
      window.alert("Login Successful");
      localStorage.setItem("user", email);
      navigate("/profile");
    }
    setDisable(false);
  };

  return (
    <div className="wrapper">
      <div className="login">
        {currentPage === "login" ? (
          <>
            <h2 className="mb-3 text-center">Login</h2>
            <form onSubmit={handleSubmit} method="POST">
              <div className="form-group was-validated mb-2">
                <label htmlFor="text" className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  pattern="^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                />
              </div>
              <div className="form-group was-validated mb-2">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={5}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={disable}
                onClick={(e) => handlingProfile(e)}
              >
                Login
              </button>
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => handlePageChange("register")}
                >
                  Register
                </button>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="mb-3 text-center">Register</h2>
            <form method="POST" className="register-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={user.firstName}
                  onChange={handleInputs}
                  placeholder="Enter First Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={user.lastName}
                  onChange={handleInputs}
                  placeholder="Enter Last Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userName">User Name</label>
                <input
                  type="text"
                  name="userName"
                  className="form-control"
                  value={user.userName}
                  onChange={handleInputs}
                  placeholder="Enter User Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={user.email}
                  onChange={handleInputs}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <input
                  type="text"
                  name="skills"
                  className="form-control"
                  value={user.skills}
                  onChange={handleInputs}
                  placeholder="Enter Skills"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  name="age"
                  className="form-control"
                  value={user.age}
                  onChange={handleInputs}
                  placeholder="Enter Age"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  className="form-control"
                  value={user.contactNumber}
                  onChange={handleInputs}
                  placeholder="Enter Contact Number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={user.password}
                  onChange={handleInputs}
                  placeholder="Enter Password"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100 mt-3"
                disabled={RegDisable}
                onClick={(e) => postData("login", e)}
              >
                Register
              </button>
              <p className="text-center mt-3">
                Already have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => handlePageChange("login")}
                >
                  Login
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

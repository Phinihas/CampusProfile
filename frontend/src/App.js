import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import Login from "./components/Login/login";
import Home from "./components/Home/home";
import Profile from "./components/Profile/profile";
import Editprofile from "./components/Profile/editprofile";
import Subgreddiits from "./components/Subgreddiits/subgreddiits";
import Mysubgreddiits from "./components/MySubgreddiits/mysubgreddiits";
import UserList from "./components/Users/userlist";
import FollowersList from "./components/Profile/followerslist";
import FollowingList from "./components/Profile/followinglist";
import CreateSubGreddiit from "./components/MySubgreddiits/createsubgreddiit";
import axios from "axios";
import EachSubGreddiit from "./components/MySubgreddiits/eachSubGreddiit";
import Subgreddiitreports from "./components/MySubgreddiits/subgreddiitreports";
import Subgreddiitstats from "./components/MySubgreddiits/subgreddiitstats";
import Joinrequests from "./components/MySubgreddiits/joinrequests";
import Subgreddiitusers from "./components/MySubgreddiits/subgreddiitusers";
import CreatePost from "./components/MySubgreddiits/createpost";
import Cancelrequest from "./components/Subgreddiits/joincancel";
import Viewsubgreddiit from "./components/Subgreddiits/viewsubgreddiit";
import SavedPosts from "./components/Saved/savedposts";
import Logout from "./components/Login/logout";

function App() {
  const [flag, setflag] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("user")) setflag(true);
    else {
      setflag(false);
    }
  }, [flag]);
  const logout = () => {
    localStorage.removeItem("user");
    setflag(false);
    window.location.reload();
  };

  return (
    <div className="App">
      <Router>
        <div className="nav-container">
          {!flag ? (
            <>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-home"></i> Home
              </NavLink>
              <NavLink to="/Login" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-sign-in-alt"></i> Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/Subgreddiits" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-clipboard-list"></i> Subgreddiits
              </NavLink>
              <NavLink to="/MySubgreddiits" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-file-alt"></i> MySubgreddiits
              </NavLink>
              <NavLink to="/Profile" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-user-alt"></i> Profile
              </NavLink>
              <NavLink to="/userlist" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-users"></i> Users
              </NavLink>
              <NavLink to="/savedposts" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-save"></i> Saved
              </NavLink>
              <NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </NavLink>
            </>
          )}
        </div>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Profile" element={<Profile flag={flag} setflag={setflag} />} />
          <Route exact path="/subgreddiits" element={<Subgreddiits flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits" element={<Mysubgreddiits flag={flag} setflag={setflag} />} />
          <Route exact path="/editprofile" element={<Editprofile flag={flag} setflag={setflag} />} />
          <Route exact path="/userlist" element={<UserList flag={flag} setflag={setflag} />} />
          <Route exact path="/savedposts" element={<SavedPosts flag={flag} setflag={setflag} />} />
          <Route exact path="/followerslist" element={<FollowersList flag={flag} setflag={setflag} />} />
          <Route exact path="/followinglist" element={<FollowingList flag={flag} setflag={setflag} />} />
          <Route exact path="/createsubgreddiit" element={<CreateSubGreddiit flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits/:subgreddiitId" element={<EachSubGreddiit flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits/:subgreddiitId/users" element={<Subgreddiitusers flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits/:subgreddiitId/stats" element={<Subgreddiitstats flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits/:subgreddiitId/joinrequests" element={<Joinrequests flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits/:subgreddiitId/reports" element={<Subgreddiitreports flag={flag} setflag={setflag} />} />
          <Route exact path="/mysubgreddiits/:subgreddiitId/createpost" element={<CreatePost flag={flag} setflag={setflag} />} />
          <Route exact path="/subgreddiits/:subgreddiitId/cancelrequest" element={<Cancelrequest flag={flag} setflag={setflag} />} />
          <Route exact path="/subgreddiits/:subgreddiitId" element={<Viewsubgreddiit flag={flag} setflag={setflag} />} />
          <Route exact path="/logout" element={<Logout flag={flag} setflag={setflag} />} />
          <Route exact path="/*" element={
            <center>
              <h1 className="h22">404 Page Not Found</h1>
            </center>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

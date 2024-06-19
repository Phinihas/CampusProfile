const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/userSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
const SubGreddiit = require("../model/subgreddiitSchema");
router.use(cookieParser());
const ObjectId = mongoose.Types.ObjectId;

require("../db/conn");

router.get("/", (req, res) => {
  res.send("Hello World from the server router js");
});

const timeDelay = 10 * 24 * 60 * 60 * 1000;

// router.post('/register', (req, res) => {
//     const { firstName, lastName, userName, email, age, contactNumber, password } = req.body;
//     if (!firstName || !lastName || !userName || !email || !age || !contactNumber || !password) {
//         return res.status(422).json({
//             erroe: "Please fill the fields properly"
//         });
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({
//                     error: "Email already Exist"
//                 });

//             }
//                 const user = new User({ firstName, lastName, userName, email, age, contactNumber, password });

//                 user.save().then(() => {
//                     res.status(201).json({ message: "user registered successfully" });
//                 }).catch((err) => res.status(500).json({ error: "Failed to register" }));
//         }).catch(err => { console.log(err) });
// });

// Async - Await

router.post("/api/register", async (req, res) => {
  const { firstName, lastName, userName, email, skills, age, contactNumber, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !age ||
    !contactNumber ||
    !password
  ) {
    return res.status(422).json({
      error: "Please fill the fields properly",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }

    const user = new User({
      firstName,
      lastName,
      userName,
      email,
      skills,
      age,
      contactNumber,
      password,
    });

    await user.save();

    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    console.log(err);
    res.send("Some Error on console");
  }
});

router.get("/api/logout", (req, res) => {
  console.log("Loggingout");

  res.clearCookie("jwt", { path: "/" });
  res.status(200).send("User Logout");
});

router.post("/api/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please fill the fields properly",
      });
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      const isMatch = await bcrypt.compare(password, userExist.password);
      token = await userExist.generateAuthToken();

      if (!isMatch) {
        res.status(400).json({ error: "Wrong Password" });
      } else {
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 600000000000000),
          httpOnly: true,
        });

        console.log("token: " + token);
        // console.log(`${req.cookies.jwt}`);
        res.json({ message: "User Logged in Successfully" });
      }
    } else {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/userlist", authenticate, async (req, res) => {
  try {
    const { follower, id } = req.body;
    const userNow = await User.findById(id);
    const check = userNow?.followings.filter(
      (f) => f.following === follower
    ).length;
    if (!check) {
      const updatedFollowings = userNow.followings.concat({
        following: follower,
      });
      await User.findByIdAndUpdate(id, { followings: updatedFollowings });
      const userFollowing = await User.findById(follower);
      const updatedFollowers = userFollowing.followers.concat({ follower: id });
      await User.findByIdAndUpdate(follower, { followers: updatedFollowers });

      res.status(201).json({ message: "Followed Successfully" });
    } else {
      const updatedFollowings = userNow?.followings.filter(
        (f) => f.following !== follower
      );
      await User.findByIdAndUpdate(id, { followings: updatedFollowings });
      const userFollowing = await User.findById(follower);
      const updatedFollowers = userFollowing?.followers.filter(
        (f) => f.follower !== id
      );
      await User.findByIdAndUpdate(follower, { followers: updatedFollowers });
      res.status(200).json({ message: "Removed Successfully" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.post("/api/subgreddiits", authenticate, async (req, res) => {
  const { name, description, owner, followers, tags, bannedKeyWords } =
    req.body;

  try {
    const subgreddiit = new SubGreddiit({
      name,
      description,
      owner,
      creationDate: Date.now(),
      followers,
      tags: tags ? tags.split(",").map((tag) => ({ tag: tag.trim() })) : [],
      bannedKeyWords: bannedKeyWords
        ? bannedKeyWords
            .split(",")
            .map((keyword) => ({ keyword: keyword.trim() }))
        : [],
    });

    await subgreddiit.save();
    // console.log(subgreddiit._id);
    const userNow = await User.findById(owner);
    const updatedsubgreddiits = userNow?.subgreddiits.concat({
      subgreddiit: subgreddiit._id,
    });
    await User.findByIdAndUpdate(owner, { subgreddiits: updatedsubgreddiits });

    res.status(201).json({ message: "subgreddiit created successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/unsavepost", authenticate, async (req, res) => {
  const { userID, subgreddiitId, postId } = req.body;
  const saved = { subgreddiitId: subgreddiitId, postId: postId };
  try {
    const userNow = await User.findById(userID);
    const alreadySaved = userNow?.savedPosts?.some(
      (s) => s.saved?.postId === postId
    );
    if (alreadySaved) {
      const updatedsaves = userNow?.savedPosts?.filter(
        (s) => s.saved.postId !== postId
      );
      const data = await User.findByIdAndUpdate(userID, {
        savedPosts: updatedsaves,
      });
      res.status(201).json({ message: "UnSaved Successfully" });
    } else {
      res.status(200).json({ message: "Already UnSaved" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.delete("/api/subgreddiits", authenticate, async (req, res) => {
  const { subGreddiitID } = req.body;
   console.log(subGreddiitID);
  try {
    const result = await User.updateMany(
      {
        $or: [
          { "subgreddiits.subgreddiit": subGreddiitID },
          { "requestedJoins.request": subGreddiitID },
          { "acceptedJoins.accept": subGreddiitID },
          { "leftSG.left": subGreddiitID },
        ],
      },
      {
        $pull: {
          subgreddiits: { subgreddiit: subGreddiitID },
          requestedJoins: { request: subGreddiitID },
          acceptedJoins: { accept: subGreddiitID },
          leftSG: { left: subGreddiitID },
        },
      },
      { multi: true, arrayFilters: [{ "elem.subgreddiit": subGreddiitID }] }
    );
    // console.log(`Matched: ${result.matchedCount}`);
    // console.log(`Modified: ${result.modifiedCount}`);
    // console.log(`Deleted: ${result.deletedCount}`);

    await SubGreddiit.deleteOne({ _id: subGreddiitID });
    res.status(201).json({ message: "subgreddiit deleted successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/getreports", authenticate, async (req, res) => {
  const { subgreddiitId } = req.body;
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const data = subgreddiit?.reported;
    let newdata = [];
    for (let i = 0; i < data?.length; i++) {
      let current_time = Date.now();
      if (
        current_time - Number(data[i]?.creationDate) >= timeDelay &&
        !data[i]?.ignored
      ) {
        console.log("if condition in getreport");
      } else {
        newdata.push(data[i]);
      }
    }
    await SubGreddiit.findByIdAndUpdate(subgreddiitId, { reported: newdata });
    res.status(201).send(newdata);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/deletereport", authenticate, async (req, res) => {
  const { subgreddiitId, reportId } = req.body;
  const nreportId = reportId?.reportId;
  console.log(subgreddiitId, nreportId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const reportNow = subgreddiit?.reported?.filter(
      (r) => r._id.toString() === nreportId
    );
    // console.log(reportNow);
    // console.log(reportNow[0].creationDate);
    if (Date.now() - Number(reportNow.creationDate) >= timeDelay) {
      const updatedSubgreddiit = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "reported._id": nreportId },
        { $unset: { reported: "" } }
      );
      res.status(202).json({ message: "Time Delay Deletion" });
    } else {
      res.status(202).json({ error: "TimeDelay Fault" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.delete("/api/deletepost", authenticate, async (req, res) => {
  const { subgreddiitId, postId } = req.body;

  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);

    const result = await User.updateMany(
      {
        "savedPosts.saved.postId": postId,
      },
      {
        $pull: {
          savedPosts: { "saved.postId": postId },
        },
      },
      {
        arrayFilters: [{ "saved.postId": postId }],
      }
    );

    const result1 = await SubGreddiit.updateMany(
      { "reported.post": postId },
      { $unset: { reported: "" } }
    );

    const result2 = await SubGreddiit.updateOne(
      { _id: subgreddiitId },
      { $pull: { posts: { _id: postId } } }
    );
    const updateDeletePostDates = subgreddiit?.deletePostDates.concat({
      deletePostDate: Date.now(),
    });
    const data = await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
      deletePostDates: updateDeletePostDates,
    });

    res.status(201).json({ message: "post deleted successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.delete("/api/sdeletepost", authenticate, async (req, res) => {
  const { subgreddiitId, postId } = req.body;

  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);

    const result = await User.updateMany(
      {
        "savedPosts.saved.postId": postId,
      },
      {
        $pull: {
          savedPosts: { "saved.postId": postId },
        },
      },
      {
        arrayFilters: [{ "saved.postId": postId }],
      }
    );

    const result1 = await SubGreddiit.updateMany(
      { "reported.post": postId },
      { $unset: { reported: "" } }
    );

    const result2 = await SubGreddiit.updateOne(
      { _id: subgreddiitId },
      { $pull: { posts: { _id: postId } } }
    );
    const updateDeleteSPostDates = subgreddiit?.deleteSPostDates.concat({
      deleteSPostDate: Date.now(),
    });
    const data = await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
      deleteSPostDates: updateDeleteSPostDates,
    });

    res.status(201).json({ message: "post deleted successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/ignorereport", authenticate, async (req, res) => {
  const { subgreddiitId, reportId } = req.body;
  console.log(reportId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const reportNow = subgreddiit?.reported?.filter(
      (r) => r._id.toString() === reportId
    );
    // console.log(reportNow);
    // console.log(reportNow[0].creationDate);
    if (Date.now() - Number(reportNow?.creationDate) >= timeDelay) {
      const updatedSubgreddiit = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "reported._id": reportId },
        { $unset: { reported: "" } }
      );
      res.status(202).json({ message: "Time Delay Deletion" });
    } else {
      const updatedSubgreddiit = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "reported._id": reportId },
        { $set: { "reported.$.ignored": 1 } }
      );
      res.status(201).json({ message: "Ignored Successfully" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/blockuser", authenticate, async (req, res) => {
  const { subgreddiitId, reportPost, reportId } = req.body;
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const alreadyblocked = subgreddiit?.blockedSG.filter(
      (b) => b.blocked === reportPost
    ).length;
    const reportNow = subgreddiit?.reported?.filter(
      (r) => r._id.toString() === reportId
    );
    // console.log(reportNow);
    // console.log(reportNow[0].creationDate);
    if (Date.now() - Number(reportNow?.creationDate) >= timeDelay) {
      const updatedSubgreddiit = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "reported._id": reportId },
        { $unset: { reported: "" } }
      );
      res.status(202).json({ message: "Time Delay Deletion" });
    } else {
      // console.log(alreadyblocked);
      if (!alreadyblocked) {
        const updatedfollowers = subgreddiit?.followers?.filter(
          (s) => s.follower !== reportPost
        );
        const followersCount = subgreddiit?.followers.length - 1;
        const updatedSubgreddiit = await SubGreddiit.updateOne(
          { _id: subgreddiitId },
          { $pull: { reported: { _id: reportId } } }
        );
        const result1 = await SubGreddiit.updateOne(
          { _id: subgreddiitId },
          { $pull: { reported: { reportedTo: reportPost } } }
        );
        const updatedblocks = subgreddiit?.blockedSG.concat({
          blocked: reportPost,
        });
        const userreportingto = await User.findById(reportPost);
        // console.log(reportPost, userreportingto);
        const updateAccepts = userreportingto?.acceptedJoins?.filter(
          (a) => a.accept !== subgreddiitId
        );
        const updatedsubgreddiits = userreportingto?.subgreddiits?.filter(
          (s) => s.subgreddiit !== subgreddiitId
        );
        const ublockedsubgreddiits =
          userreportingto?.blockedSubgreddiits.concat({
            blocked: subgreddiitId,
          });
        const updateRejectedDates = subgreddiit?.rejectedDates.concat({
          rejectedDate: Date.now(),
        });
        const data = await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
          blockedSG: updatedblocks,
          followers: updatedfollowers,
          followersCount: followersCount,
          rejectedDates: updateRejectedDates,
        });
        const data2 = await User.findByIdAndUpdate(reportPost, {
          acceptedJoins: updateAccepts,
          subgreddiits: updatedsubgreddiits,
          blockedSubgreddiits: ublockedsubgreddiits,
        });

        res.status(201).json({ message: "Blocked" });
      } else {
        res.status(200).json({ message: "Already Blocked" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(422).json({ message: "Some Error on Console" });
  }
});

const getSubGreddiitsSorted = async (sortCriteria) => {
  let sort = {};
  if (sortCriteria.includes("nameAsc")) {
    sort.name = 1;
  } else if (sortCriteria.includes("nameDesc")) {
    sort.name = -1;
  }
  if (sortCriteria.includes("followers")) {
    sort.followersCount = -1;
  }
  if (sortCriteria.includes("creationDate")) {
    sort.creationDate = -1;
  }
  const subGreddiits = await SubGreddiit.find().sort(sort);
  // console.log(subGreddiits);
  return subGreddiits;
};

router.put("/api/subgreddiitsfiltering", authenticate, async (req, res) => {
  const { filter } = req.body;
  // console.log(filter);
  try {
    const data = await getSubGreddiitsSorted(filter);
    res.status(201).send(data);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/tagsfiltering", authenticate, async (req, res) => {
  const { tag } = req.body;
  // console.log(tag);
  try {
    const data = await SubGreddiit.find({ "tags.tag": tag });
    res.status(201).send(data);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/reportpost", authenticate, async (req, res) => {
  const {
    userID,
    user_name,
    subgreddiitId,
    reportedTo,
    abuser,
    concern,
    postId,
    postName,
  } = req.body;
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const updatedreports = subgreddiit?.reported.concat({
      reportedByName: user_name,
      postName: postName,
      reportedBy: userID,
      reportedTo: reportedTo,
      reportedToName: abuser,
      text: concern,
      post: postId,
      creationDate: Date.now(),
    });
    const updateReportedDates = subgreddiit?.reportedDates.concat({
      reportedDate: Date.now(),
    });
    const data = await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
      reported: updatedreports,
      reportedDates: updateReportedDates,
    });
    res.status(201).json({ message: "Reported Successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/getstatsfollowers", authenticate, async (req, res) => {
  const { subgreddiitId } = req.body;
  // console.log(subgreddiitId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const data1 = subgreddiit?.acceptedDates;
    const data2 = subgreddiit?.rejectedDates;

    // console.log(data1);
    // console.log(data2);

    let startDate = new Date(subgreddiit?.creationDate);
    let endDate = new Date(Date.now());
    // console.log(startDate);
    // console.log(endDate);

    const arr = [];
    for (
      let d = startDate;
      d <= endDate || d.toDateString() == endDate.toDateString();
      d.setDate(d.getDate() + 1)
    ) {
      let cnt1 = 0;
      // console.log("hi");
      for (let i = 0; i < data1?.length; i++) {
        // console.log("hello");
        let accepteddate = new Date(Number(data1[i]?.acceptedDate));
        // console.log(accepteddate, d);
        if (
          accepteddate <= d ||
          accepteddate.toDateString() == d.toDateString()
        ) {
          cnt1++;
        }
        // console.log(cnt);
      }

      let cnt2 = 0;
      for (let i = 0; i < data2?.length; i++) {
        let rejectedDate = new Date(Number(data2[i]?.rejectedDate));
        if (
          rejectedDate <= d ||
          rejectedDate.toDateString() == d.toDateString()
        ) {
          cnt2++;
        }
      }
      let value = cnt1 - cnt2;
      let now = new Date(d);
      let dt = now.toLocaleDateString();
      arr.push({ dt, value });
    }

    // console.log(arr);
    res.status(201).send(arr);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/getstatsposts", authenticate, async (req, res) => {
  const { subgreddiitId } = req.body;
  // console.log(subgreddiitId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const data1 = subgreddiit?.postDates;
    const data2 = subgreddiit?.deleteSPostDates;

    // console.log(data1);

    let startDate = new Date(subgreddiit?.creationDate);
    let endDate = new Date(Date.now());
    // console.log(startDate);
    // console.log(endDate);

    const arr = [];
    for (
      let d = startDate;
      d <= endDate || d.toDateString() == endDate.toDateString();
      d.setDate(d.getDate() + 1)
    ) {
      let cnt1 = 0;
      // console.log("hi");
      for (let i = 0; i < data1?.length; i++) {
        // console.log("hello");
        let postdate = new Date(Number(data1[i]?.postDate));
        // console.log(postdate, d);
        if (postdate <= d || postdate.toDateString() == d.toDateString()) {
          cnt1++;
        }
        // console.log(cnt);
      }
      let cnt2 = 0;
      // console.log("hi");
      for (let i = 0; i < data2?.length; i++) {
        // console.log("hello");
        let deletepostdate = new Date(Number(data2[i]?.deleteSPostDate));
        // console.log(postdate, d);
        if (
          deletepostdate <= d ||
          deletepostdate.toDateString() == d.toDateString()
        ) {
          cnt2++;
        }
        // console.log(cnt);
      }
      let value = cnt1 - cnt2;
      let now = new Date(d);
      let dt = now.toLocaleDateString();
      arr.push({ dt, value });
    }

    // console.log(arr);
    res.status(201).send(arr);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/getstatsopens", authenticate, async (req, res) => {
  const { subgreddiitId } = req.body;
  // console.log(subgreddiitId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const data1 = subgreddiit?.openDates;

    // console.log(data1);

    let startDate = new Date(subgreddiit?.creationDate);
    let endDate = new Date(Date.now());
    // console.log(startDate);
    // console.log(endDate);

    const arr = [];
    for (
      let d = startDate;
      d <= endDate || d.toDateString() == endDate.toDateString();
      d.setDate(d.getDate() + 1)
    ) {
      let cnt1 = 0;
      // console.log("hi");
      for (let i = 0; i < data1?.length; i++) {
        // console.log("hello");
        let opendate = new Date(Number(data1[i]?.openDate));
        // console.log(opendate, d);
        if (opendate <= d || opendate.toDateString() == d.toDateString()) {
          cnt1++;
        }
        // console.log(cnt);
      }

      let value = cnt1;
      let now = new Date(d);
      let dt = now.toLocaleDateString();
      arr.push({ dt, value });
    }

    // console.log(arr);
    res.status(201).send(arr);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/getstatsreports", authenticate, async (req, res) => {
  const { subgreddiitId } = req.body;
  // console.log(subgreddiitId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const data1 = subgreddiit?.reportedDates;
    const data2 = subgreddiit?.deletePostDates;

    // console.log(data1);
    // console.log(data2);

    let startDate = new Date(subgreddiit?.creationDate);
    let endDate = new Date(Date.now());
    // console.log(startDate);
    // console.log(endDate);

    const arr = [];
    for (
      let d = startDate;
      d <= endDate || d.toDateString() == endDate.toDateString();
      d.setDate(d.getDate() + 1)
    ) {
      let cnt1 = 0;
      // console.log("hi");
      for (let i = 0; i < data1?.length; i++) {
        // console.log("hello");
        let reporteddate = new Date(Number(data1[i]?.reportedDate));
        // console.log(reporteddate, d);
        if (
          reporteddate <= d ||
          reporteddate.toDateString() == d.toDateString()
        ) {
          cnt1++;
        }
        // console.log(cnt);
      }

      let cnt2 = 0;
      for (let i = 0; i < data2?.length; i++) {
        let deletedpostdate = new Date(Number(data2[i]?.deletePostDate));
        if (
          deletedpostdate <= d ||
          deletedpostdate.toDateString() == d.toDateString()
        ) {
          cnt2++;
        }
      }
      let now = new Date(d);
      let dt = now.toLocaleDateString();
      let report = cnt1;
      let del = cnt2;
      arr.push({ dt, report, del });
    }

    // console.log(arr);
    res.status(201).send(arr);
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/openingsg", authenticate, async (req, res) => {
  const { subgreddiitId } = req.body;
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const updateOpenDates = subgreddiit?.openDates.concat({
      openDate: Date.now(),
    });
    const data = await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
      openDates: updateOpenDates,
    });
    res.status(201).json({ message: "Open Dates Updated Successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/followerslist", authenticate, async (req, res) => {
  const { follower, id } = req.body;
  try {
    const userNow = await User.findById(id);
    const check = userNow?.followers.filter(
      (f) => f.follower === follower
    ).length;
    if (check) {
      const updatedFollowers = userNow?.followers.filter(
        (f) => f.follower !== follower
      );
      await User.findByIdAndUpdate(id, { followers: updatedFollowers });
      const userFollowing = await User.findById(follower);
      const updatedFollowings = userFollowing?.followings.filter(
        (f) => f.following !== id
      );
      await User.findByIdAndUpdate(follower, {
        followings: updatedFollowings,
      });
      res.status(200).json({ message: "Removed Successfully" });
    } else {
      res.status(422).json({ message: "Not following you" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/likes", authenticate, async (req, res) => {
  try {
    const { userID, subgreddiitId, postID } = req.body;
    // console.log(userID, subgreddiitId, postID);
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const checkposts = subgreddiit?.posts?.find(
      (p) => p._id.toString() === postID
    );
    const check = checkposts?.likes?.some((l) => l.like === userID);
    if (!check) {
      const updatedlikes = checkposts.likes.concat({
        like: userID,
      });
      const data = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "posts._id": postID },
        { $set: { "posts.$.likes": updatedlikes } }
      );
      res.status(201).json({ message: "Liked Successfully" });
    } else {
      const removedlikes = checkposts?.likes?.filter((l) => l.like !== userID);
      const data = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "posts._id": postID },
        { $set: { "posts.$.likes": removedlikes } }
      );
      res.status(200).json({ message: "Removed Like Successfully" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/dislikes", authenticate, async (req, res) => {
  try {
    const { userID, subgreddiitId, postID } = req.body;
    // console.log(userID, subgreddiitId, postID);
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const checkposts = subgreddiit?.posts?.find(
      (p) => p._id.toString() === postID
    );
    const check = checkposts?.dislikes?.some((l) => l.dislike === userID);
    if (!check) {
      const updateddislikes = checkposts?.dislikes.concat({
        dislike: userID,
      });
      const data = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "posts._id": postID },
        { $set: { "posts.$.dislikes": updateddislikes } }
      );
      res.status(201).json({ message: "DisLiked Successfully" });
    } else {
      const removeddislikes = checkposts?.dislikes?.filter(
        (l) => l.dislike !== userID
      );
      const data = await SubGreddiit.updateOne(
        { _id: subgreddiitId, "posts._id": postID },
        { $set: { "posts.$.dislikes": removeddislikes } }
      );
      res.status(200).json({ message: "Removed Dislike Successfully" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put("/api/savepost", authenticate, async (req, res) => {
  const { userID, subgreddiitId, postId } = req.body;
  const saved = { subgreddiitId: subgreddiitId, postId: postId };
  // console.log(userID,subgreddiitId,postId,saved);
  // console.log(userID, subgreddiitId, postId);
  // console.log(saved);
  try {
    const userNow = await User.findById(userID);
    const alreadySaved = userNow.savedPosts?.some(
      (s) => s.saved.postId === postId
    );
    if (!alreadySaved) {
      const updatedsaves = userNow?.savedPosts.concat({
        saved: saved,
      });
      const data = await User.findByIdAndUpdate(userID, {
        savedPosts: updatedsaves,
      });
      res.status(201).json({ message: "Saved Successfully" });
    } else {
      res.status(200).json({ message: "Already Saved" });
    }
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/deletecomments", authenticate, async (req, res) => {
  const { postID, commentID } = req.body;
  try {
    await SubGreddiit.updateOne(
      { "posts._id": postID, "posts.comments._id": commentID },
      { $pull: { "posts.$.comments": { _id: commentID } } }
    );
    res.status(201).json({ message: "Comment Deleted Successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.put(
  "/api/deletecommentsfromsubgreddiit",
  authenticate,
  async (req, res) => {
    const { userID, owner, postID, commentID, commentedByID } = req.body;
    // console.log(commentedByID);
    try {
      if (userID === owner || userID === commentedByID) {
        await SubGreddiit.updateOne(
          { "posts._id": postID, "posts.comments._id": commentID },
          { $pull: { "posts.$.comments": { _id: commentID } } }
        );
        res.status(201).json({ message: "Comment Deleted Successfully" });
      } else {
        res.status(200).json({ message: "Can't Delete other's comments" });
      }
    } catch (e) {
      console.log(e);
      res.send("Some Error on console");
    }
  }
);

router.put("/api/comments", authenticate, async (req, res) => {
  try {
    const { user_name, userID, subgreddiitId, postID, comment } = req.body;
    // console.log(user_name, subgreddiitId, postID);
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const checkposts = subgreddiit?.posts?.find(
      (p) => p._id.toString() === postID
    );

    const updatedcomments = checkposts?.comments.concat({
      commentedBy: user_name,
      comment: comment,
      commentedByID: userID,
    });
    const data = await SubGreddiit.updateOne(
      { _id: subgreddiitId, "posts._id": postID },
      { $set: { "posts.$.comments": updatedcomments } }
    );
    res.status(201).json({ message: "Commented Successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on console");
  }
});

router.get("/api/profile", authenticate, (req, res) => {
  // console.log("Welcome to my Profile");
  res.send(req.rootUser);
});

router.get("/api/editprofile", authenticate, (req, res) => {
  // console.log("Welcome to my editProfile");
  res.send(req.rootUser);
});

router.put("/api/editprofile", authenticate, async (req, res) => {
  const { _id, firstName, lastName, userName, email,skills, age, contactNumber } =
    req.body;
  // console.log(_id);
  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !age ||
    !contactNumber
  ) {
    return res.status(422).json({
      error: "Please fill the fields properly",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });
    let temp;
    if (userExist) {
      const ObjectId = userExist._id;
      temp = ObjectId.toString();
    } else {
      temp = _id;
    }
    if (userExist && !(_id === temp)) {
      return res.status(422).json({
        error: "You Entered Existed Email",
      });
    } else {
      await User.findByIdAndUpdate(_id, {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        skills:skills,
        age: age,
        contactNumber: contactNumber,
      });

      res.status(201).json({ message: "profile updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send("profile not updated");
  }
});

router.put("/api/subgreddiitsjoining", authenticate, async (req, res) => {
  const { subgreddiitId, userID, userDetails } = req.body;
  // console.log(userDetails);
  try {
    const subgreddiitNow = await SubGreddiit.findById(subgreddiitId);
    const userNow = await User.findById(userID);
    const check1 = userNow?.subgreddiits.filter(
      (s) => s.subgreddiit === subgreddiitId
    ).length;
    const check2 = subgreddiitNow?.followers.filter(
      (s) => s.follower === userID
    ).length;
    const checkleft = userNow?.leftSG.filter(
      (l) => l.left === subgreddiitId
    ).length;
    const checkblocked = subgreddiitNow?.blockedSG.filter(
      (b) => b.blocked === userID
    ).length;
    if ((!check1 || !check2) && !checkleft && !checkblocked) {
      const updatedrequestedJoins = userNow?.requestedJoins.concat({
        request: subgreddiitId,
      });
      await User.findByIdAndUpdate(userID, {
        requestedJoins: updatedrequestedJoins,
      });
      const updatedjoinrequests = subgreddiitNow?.joinrequests.concat({
        user: userDetails,
      });
      await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
        joinrequests: updatedjoinrequests,
      });
      res.status(201).json({ message: "Join Request Sent Successfully" });
    } else if (checkleft) {
      res.status(200).json({ message: "You can't Join Again Once You Left" });
    } else if (checkblocked) {
      res.status(202).json({ message: "You are blocked" });
    } else {
      res.status(422).json({ message: "Already Joined" });
    }
  } catch (e) {
    console.log(e);
    res.send("some Error on console");
  }
});

router.put("/api/subgreddiitsleaving", authenticate, async (req, res) => {
  const { subgreddiitId, userID } = req.body;
  // console.log(userDetails);
  try {
    const subgreddiitNow = await SubGreddiit.findById(subgreddiitId);
    const userNow = await User.findById(userID);
    const check1 = userNow?.subgreddiits.filter(
      (s) => s.subgreddiit === subgreddiitId
    ).length;
    const check2 = subgreddiitNow?.followers.filter(
      (s) => s.follower === userID
    ).length;

    if ((check1 || check2) && subgreddiitNow?.owner !== userID) {
      const updatedsubgreddiits = userNow?.subgreddiits?.filter(
        (s) => s.subgreddiit !== subgreddiitId
      );
      const updateAccepts = userNow?.acceptedJoins?.filter(
        (a) => a.accept !== subgreddiitId
      );
      const updateLefts = userNow?.leftSG.concat({
        left: subgreddiitId,
      });
      await User.findByIdAndUpdate(userID, {
        subgreddiits: updatedsubgreddiits,
        acceptedJoins: updateAccepts,
        leftSG: updateLefts,
      });
      const updatedfollowers = subgreddiitNow?.followers?.filter(
        (f) => f.follower !== userID
      );
      const updateRejectedDates = subgreddiitNow?.rejectedDates.concat({
        rejectedDate: Date.now(),
      });
      const followersCount = subgreddiitNow?.followers.length - 1;
      await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
        followers: updatedfollowers,
        followersCount: followersCount,
        rejectedDates: updateRejectedDates,
      });
      res.status(201).json({ message: "Left Successfully" });
    } else if (subgreddiitNow.owner === userID) {
      res.status(200).json({ message: "Owner Can't Leave" });
    } else {
      res.status(422).json({ message: "Already Joined" });
    }
  } catch (e) {
    console.log(e);
    res.send("some Error on console");
  }
});

router.put("/api/removeuser", authenticate, async (req, res) => {
  const { subgreddiitId, userId } = req.body;
  try {
    const subgreddiitNow = await SubGreddiit.findById(subgreddiitId);
    const userNow = await User.findById(userId);
    const check1 = userNow?.subgreddiits.filter(
      (s) => s.subgreddiit === subgreddiitId
    ).length;
    const check2 = subgreddiitNow?.followers.filter(
      (s) => s.follower === userId
    ).length;

    if ((check1 || check2) && subgreddiitNow.owner !== userId) {
      const updatedsubgreddiits = userNow?.subgreddiits?.filter(
        (s) => s.subgreddiit !== subgreddiitId
      );
      const updateAccepts = userNow?.acceptedJoins?.filter(
        (a) => a.accept !== subgreddiitId
      );

      const updateRejectedDates = subgreddiitNow?.rejectedDates?.concat({
        rejectedDate: Date.now(),
      });

      await User.findByIdAndUpdate(userId, {
        subgreddiits: updatedsubgreddiits,
        acceptedJoins: updateAccepts,
      });
      const updatedfollowers = subgreddiitNow?.followers?.filter(
        (f) => f.follower !== userId
      );
      const followersCount = subgreddiitNow?.followers.length - 1;
      await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
        followers: updatedfollowers,
        followersCount: followersCount,
        rejectedDates: updateRejectedDates,
      });
      res.status(201).json({ message: "Removed Successfully" });
    } else {
      res.status(422).json({ message: "Not Removed" });
    }
  } catch (e) {
    console.log(e);
    res.send("some Error on console");
  }
});

router.put("/api/cancellingrequest", authenticate, async (req, res) => {
  const { decision, subgreddiitId, userID, userDetails } = req.body;
  // console.log(decision, subgreddiitId, userID, userDetails);
  // console.log(userDetails);
  try {
    const subgreddiitNow = await SubGreddiit.findById(subgreddiitId);
    const userNow = await User.findById(userID);
    const check1 = userNow?.requestedJoins.filter(
      (s) => s.request === subgreddiitId
    ).length;
    const check2 = subgreddiitNow?.joinrequests.filter(
      (s) => s.user.userID === userID
    ).length;

    // console.log(check1, check2);

    if ((check1 || check2) && decision === "YES") {
      const updatedrequestedJoins = userNow?.requestedJoins.filter(
        (r) => r.request !== subgreddiitId
      );

      await User.findByIdAndUpdate(userID, {
        requestedJoins: updatedrequestedJoins,
      });
      const updatedjoinrequests = subgreddiitNow?.joinrequests.filter(
        (u) => u.user.userID !== userID
      );
      await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
        joinrequests: updatedjoinrequests,
      });
      res.status(201).json({ message: "Cancelled" });
    } else {
      res.status(422).json({ message: "Didn't Join or Already Joined" });
    }
  } catch (e) {
    console.log(e);
    res.send("some Error on console");
  }
});

router.put("/api/acceptingrequests", authenticate, async (req, res) => {
  const { userID, subgreddiitId } = req.body;
  // console.log(userID,subgreddiitId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const updateFollowers = subgreddiit?.followers.concat({
      follower: userID,
    });
    const removeRequests = subgreddiit?.joinrequests?.filter(
      (r) => r.user.userID !== userID
    );
    const userFollowed = await User.findById(userID);
    const updateAccepts = userFollowed?.acceptedJoins.concat({
      accept: subgreddiitId,
    });
    const updateAcceptDates = subgreddiit?.acceptedDates.concat({
      acceptedDate: Date.now(),
    });
    const updatedsubgreddiits = userFollowed?.subgreddiits.concat({
      subgreddiit: subgreddiitId,
    });
    const removerequestedJoins = userFollowed?.requestedJoins?.filter(
      (r) => r.request !== subgreddiitId
    );
    const followersCount = subgreddiit?.followers.length + 1;
    await User.findByIdAndUpdate(userID, {
      acceptedJoins: updateAccepts,
      subgreddiits: updatedsubgreddiits,
      requestedJoins: removerequestedJoins,
    });
    await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
      joinrequests: removeRequests,
      followers: updateFollowers,
      followersCount: followersCount,
      acceptedDates: updateAcceptDates,
    });
    res.status(201).json({ message: "Join Request Accepted Successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/decliningrequests", authenticate, async (req, res) => {
  const { userID, subgreddiitId } = req.body;
  // console.log(userID,subgreddiitId);
  try {
    const subgreddiit = await SubGreddiit.findById(subgreddiitId);
    const removeRequests = subgreddiit?.joinrequests?.filter(
      (r) => r.user.userID !== userID
    );
    const userFollowed = await User.findById(userID);
    const removerequestedJoins = userFollowed?.requestedJoins?.filter(
      (r) => r.request !== subgreddiitId
    );
    await User.findByIdAndUpdate(userID, {
      requestedJoins: removerequestedJoins,
    });
    await SubGreddiit.findByIdAndUpdate(subgreddiitId, {
      joinrequests: removeRequests,
    });
    res.status(201).json({ message: "Join Request Declined Successfully" });
  } catch (e) {
    console.log(e);
    res.send("Some Error on Console");
  }
});

router.put("/api/creatingposts", authenticate, async (req, res) => {
  // console.log("Came");
  const { postName, description, postedBy, postedIn } = req.body;
  try {
    const subgreddiit = await SubGreddiit.findById(postedIn);
    const bannedKeyWords = subgreddiit?.bannedKeyWords?.map(
      (obj) => obj.keyword
    );
    const bannedKeyWordsRegex = new RegExp(
      `\\b(${bannedKeyWords.join("|")})\\b`,
      "gi"
    );
    const maskedDescription = description?.replace(
      bannedKeyWordsRegex,
      (match) => "*".repeat(match.length)
    );

    // console.log(maskedDescription);

    const updatedPosts = subgreddiit?.posts.concat({
      postName: postName,
      description: maskedDescription,
      postedBy: postedBy,
      postedIn: postedIn,
    });
    const updatePostDates = subgreddiit?.postDates.concat({
      postDate: Date.now(),
    });
    const data = await SubGreddiit.findByIdAndUpdate(postedIn, {
      posts: updatedPosts,
      postDates: updatePostDates,
    });
    // console.log(data.posts);
    if (maskedDescription !== description) {
      res.status(201).json({ maskedDescription });
    } else if (maskedDescription === description) {
      res.status(200).json({ maskedDescription });
    }
  } catch (e) {
    console.log(e);
    res.status(422).send("Some Error on Console");
  }
});

router.get("/api/subgreddiits", authenticate, (req, res) => {
  // console.log("Welcome to Subgreddiits Page");
  res.send(req.rootUser);
});

router.get("/api/userlist", authenticate, (req, res) => {
  // console.log("Welcome to Userlist Page");
  res.send(req.rootUser);
});

router.get("/api/followerslist", authenticate, (req, res) => {
  // console.log("Welcome to Userlist Page");
  res.send(req.rootUser);
});

router.get("/api/followinglist", authenticate, (req, res) => {
  // console.log("Welcome to Userlist Page");
  res.send(req.rootUser);
});

router.get("/api/mysubgreddiits", authenticate, (req, res) => {
  // console.log("Welcome to My Subgreddiits Page");
  res.send(req.rootUser);
});

module.exports = router;

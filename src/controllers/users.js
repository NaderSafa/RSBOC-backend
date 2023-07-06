import User from "../models/user.js";
import Developer from "../models/developer.js";
import Attachment from "../models/attachment.js";

const getDeveloperTitle = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else if (user) {
      if (user.developerId) {
        Developer.findById(user.developerId, (error, developer) => {
          res.send(developer.title);
        });
      } else {
        res.send(404);
      }
    } else {
      res.status(404).send({ message: `User not found` });
    }
  });
};

// Handle index actions
const findAll = (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log(req.params);
      req.query.token === "wvGe5xbCkyiDcpnFTbzex8iQsYHceSYR"
        ? res.send(users)
        : res.send("Success");
    }
  });
};
// Handle view user info
const findOne = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: `User not found` });
    }
  });
};

const create = (req, res) => {
  // for (let step = 0; step < 5000; step++) {
  new User({
    ...req.body,
  }).save((error, user) => {
    if (error || !user) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.send({
        message: "User created successfully",
        user: user,
      });
      console.log("success");
    }
  });
  // }
};
// Handle update user info
const update = (req, res) => {
  User.findById(req.params.user_id, (error, user) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else if (user) {
      Object.keys(req.body).forEach((key) => {
        if (req.body) {
          user[key] = req.body[key];
        }
      });
      User.save((error, user) => {
        if (error || !user) {
          console.log(error);
          res.status(500).send(error);
        } else {
          res.send({
            message: "User updated successfully",
            user: user,
          });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  });
};
// Handle delete user
const destroy = (req, res) => {
  User.remove({ _id: req.params.user_id }, (error) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.send({
        message: "User deleted successfully",
      });
    }
  });
};

const getUserRegisteredEventIds = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else if (user) {
      res.send(user.registeredEventIds);
    } else {
      res.status(404).send({ message: `User not found` });
    }
  });
};

const registerNotificationToken = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else if (user) {
      user.notificationToken = req.body.notificationToken;
      user.save();
      res.send({ message: "Notification registered successfully" });
    } else {
      res.status(404).send({ message: `User not found` });
    }
  });
};

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
  getDeveloperTitle,
  getUserRegisteredEventIds,
  registerNotificationToken,
};

import Event from "../models/event.js";
import Developer from "../models/developer.js";

const findAll = (req, res) => {
  Developer.find({}, (error, developers) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.send(developers);
    }
  });
};

export default {
  findAll,
};

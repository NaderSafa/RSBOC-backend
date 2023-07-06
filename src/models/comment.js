import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user_id: {
    type: Schema.ObjectId,
    ref: "User",
  },
  passage_id: {
    type: String,
  },
  passage_title: {
    type: String,
  },
  message: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Comment", commentSchema);

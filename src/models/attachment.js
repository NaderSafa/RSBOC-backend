import mongoose from "mongoose";

const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
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
  s3_key: {
    type: String,
  },
  attachment_type: {
    type: String,
  },
  attachment_location: {
    type: String,
  },
  title: {
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

export default mongoose.model("Attachment", attachmentSchema);

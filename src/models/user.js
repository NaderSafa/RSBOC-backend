import mongoose from "mongoose";
import { registrationSchema } from "./registration.js";
import Event from "./event.js";
import { developerSchema } from "./developer.js";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  notificationToken: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  adminPassword: {
    type: String,
  },
  uid: {
    type: String,
  },
  role: {
    type: String,
  },
  eventId: {
    type: Schema.ObjectId,
    ref: "Event",
  },
  registeredEventIds: [{ type: String, default: [] }],
  developerId: { type: Schema.ObjectId, ref: "Developer" },
  registrations: [registrationSchema],
  create_date: {
    type: Date,
    default: Date.now,
  },
});

export { userSchema };
export default mongoose.model("User", userSchema);

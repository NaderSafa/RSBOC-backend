import mongoose from "mongoose";

const Schema = mongoose.Schema;

const developerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  address: {
    type: String,
  },
  logo: {
    type: String,
  },
  primaryContact: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  projects: [
    {
      projectName: {
        type: String,
      },
      project3DLink: {
        type: String,
      },
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  website: {
    type: String,
  },
  events: [
    {
      type: Schema.ObjectId,
      ref: "Event",
    },
  ],
  create_date: {
    type: Date,
    default: Date.now,
  },
});

export { developerSchema };
export default mongoose.model("Developer", developerSchema);

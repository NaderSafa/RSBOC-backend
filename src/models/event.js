import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  eventDates: [
    {
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
      },
    },
  ],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  videoURL: {
    type: String,
  },
  videoCoverPhoto: {
    type: String,
  },
  place: {
    title: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  totalRegisters: {
    type: Number,
    default: 0,
  },
  totalScanned: {
    type: Number,
    default: 0,
  },
  developer: {
    type: Schema.ObjectId,
    ref: "Developer",
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

export { eventSchema };
export default mongoose.model("Event", eventSchema);

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const registrationSchema = new Schema({
  // event: {
  //   type: eventSchema,
  // },
  user: {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    uid: {
      type: String,
    },
    role: {
      type: String,
    },
    notificationToken: { type: String },
    create_date: {
      type: Date,
    },
  },
  attendance: {
    type: Boolean,
    default: false,
  },
  developersVisited: [{ type: String, default: [] }],
  form: {
    residentialType: [
      {
        type: String,
      },
    ],
    locationOfInterest: [{ type: String }],
    unitType: [{ type: String }],
    budget: { type: String },
    developerOfInterest: [{ type: String }],
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },
    province: {
      type: String,
    },
  },
  base64QRCode: {
    type: String,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
})

export { registrationSchema }
export default mongoose.model('Registration', registrationSchema)

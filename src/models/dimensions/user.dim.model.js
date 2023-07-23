import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  uid: { type: String, unique: true },
  national_federation_id: { type: Number },
  email: { type: String, required: true, unique: true, lowercase: true },
  full_name: { type: String, required: true },
  nick_name: { type: String },
  phone_number: { type: String },
  country: { type: String },
  dob: { type: Date },
  phone: { type: String },
  gender: { type: String, enum: ['M', 'F'] },
  role: { type: String, enum: ['player', 'admin'], default: 'player' },
  profile_picture_url: { type: String },
  club_id: { type: mongoose.Types.ObjectId },
  preferred_hand: { type: String, enum: ['R', 'L'] },
  weight: { type: Number, min: 20, max: 200 },
  height: { type: Number, min: 100, max: 300 },
  verified: { type: Boolean, default: false },
  club: {
    type: Schema.ObjectId,
    ref: 'Club',
  },
  registrations: [
    {
      type: Schema.ObjectId,
      ref: 'Registration',
      default: [],
    },
  ],
  registered_events: [
    {
      type: Schema.ObjectId,
      ref: 'Event',
      default: [],
    },
  ],
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { userSchema }
export default mongoose.model('User', userSchema)

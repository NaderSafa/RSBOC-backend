import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  nick_name: { type: String },
  birth_date: { type: Date },
  gender: { type: String, enum: ['M', 'F'] },
  type: { type: String, enum: ['player', 'coach', 'admin'], default: 'player' },
  admin: { type: Boolean, default: false },
  profile_picture_url: { type: String },
  club_id: { type: mongoose.Types.ObjectId },
  preferred_hand: { type: String, enum: ['R', 'L'] },
  height: { type: Number, min: 140, max: 240 },
  approved: { type: Boolean, default: false },
})

export { userSchema }
export default mongoose.model('User', userSchema)

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  nick_name: { type: String },
  birth_date: { type: Date },
  gender: { type: String, enum: ['M', 'F'] },
  role: { type: String, enum: ['player', 'admin'], default: 'player' },
  profile_picture_url: { type: String },
  club_id: { type: mongoose.Types.ObjectId },
  preferred_hand: { type: String, enum: ['R', 'L'] },
  height: { type: Number, min: 140, max: 240 },
  approved: { type: Boolean, default: false },
})

export { userSchema }
export default mongoose.model('User', userSchema)

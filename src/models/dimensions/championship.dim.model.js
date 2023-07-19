import mongoose from 'mongoose'

const Schema = mongoose.Schema

const championshipSchema = new Schema({
  full_name: { type: String },
  short_name: { type: String, unique: true },
  ground: { type: String, default: 'solid' },
  logo_url: { type: String },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { championshipSchema }
export default mongoose.model('Championship', championshipSchema)

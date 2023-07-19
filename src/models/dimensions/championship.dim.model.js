import mongoose from 'mongoose'

const Schema = mongoose.Schema

const championshipDimSchema = new Schema({
  full_name: { type: String },
  short_name: { type: String, unique: true },
  ground: { type: String, default: 'solid' },
  logo_url: { type: String },
})

export { championshipDimSchema }
export default mongoose.model('ChampionshipDim', championshipDimSchema)

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const championshipFactSchema = new Schema({
  parent: {
    type: Schema.ObjectId,
    ref: 'ChampionshipDim',
  },
  full_name: { type: String, unique: true },
  short_name: { type: String, unique: true },
  registration_start_date: { type: Date },
  registration_end_date: { type: Date },
  qualifiers_dates: [{ type: Date, default: [] }],
  finals_dates: [{ type: Date, default: [] }],
  venue: {
    type: Schema.ObjectId,
    ref: 'VenueLookup',
  },
})

export { championshipFactSchema }
export default mongoose.model('ChampionshipFact', championshipFactSchema)

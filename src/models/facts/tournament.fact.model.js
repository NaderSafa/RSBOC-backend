import mongoose from 'mongoose'

const Schema = mongoose.Schema

const tournamentSchema = new Schema({
  championship_id: {
    type: Schema.ObjectId,
    ref: 'Championship',
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
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { tournamentSchema }
export default mongoose.model('Tournament', tournamentSchema)

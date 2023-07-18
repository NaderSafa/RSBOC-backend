import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventBridgeSchema = new Schema({
  championship: {
    type: Schema.ObjectId,
    ref: 'ChampionshipFact',
    required: true,
  },
  event_type: {
    type: Schema.ObjectId,
    ref: 'EventType',
    required: true,
  },
  event_code: { type: String, required: true },
  name: { type: String },
  gender: { type: String },
  age_limit: { type: Number },
  registration_start_date: { type: Date },
  registration_end_date: { type: Date },
  qualifiers_dates: [{ type: Date, default: [] }],
  finals_dates: [{ type: Date, default: [] }],
})

export { eventBridgeSchema }
export default mongoose.model('Event', eventBridgeSchema)

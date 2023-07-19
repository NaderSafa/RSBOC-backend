import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventBridgeSchema = new Schema({
  tournament_id: {
    type: Schema.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  event_type_id: {
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
  dates: [{ type: Date, default: [] }],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { eventBridgeSchema }
export default mongoose.model('Event', eventBridgeSchema)

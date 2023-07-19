import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventBridgeSchema = new Schema({
  tournament: {
    type: Schema.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  event_type: {
    type: Schema.ObjectId,
    ref: 'EventType',
    required: true,
  },
  name: { type: String },
  gender: { type: String, enum: ['male', 'female', 'mixed'] },
  age_limit: { type: Number, max: 99 },
  registration_start_date: { type: Date },
  registration_end_date: { type: Date },
  dates: [{ type: Date, default: [] }],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { eventBridgeSchema }
export default mongoose.model('Event', eventBridgeSchema)

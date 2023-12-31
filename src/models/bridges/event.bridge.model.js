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
  qualifiers: {
    type: Schema.ObjectId,
    ref: 'Event',
  },
  finals: {
    type: Schema.ObjectId,
    ref: 'Event',
  },
  groups: [
    {
      type: Schema.ObjectId,
      ref: 'Group',
    },
  ],
  name: { type: String },
  gender: { type: String, enum: ['male', 'female', 'mixed'] },
  age_limit: { type: Number, max: 99 },
  registration_start_date: { type: Date },
  registration_end_date: { type: Date },
  dates: [{ type: Date, default: [] }],
  requires_registration: { type: Boolean, default: false },
  fees: { type: Number },
  currency: { type: String },
  registrations: [
    {
      type: Schema.ObjectId,
      ref: 'Registration',
      default: [],
    },
  ],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { eventBridgeSchema }
export default mongoose.model('Event', eventBridgeSchema)

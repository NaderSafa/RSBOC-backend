import mongoose from 'mongoose'

const Schema = mongoose.Schema

const registrationSchema = new Schema({
  players: [
    {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  event: {
    type: Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  qualifiers_id: {
    type: Schema.ObjectId,
    ref: 'Registration',
  },
  fees: { type: Number },
  currency: { type: String, enum: ['EGP'] },
  payment_method: { type: String, enum: ['cash', 'instapay'] },
  payment_image_url: { type: String },
  preferred_dates: [{ type: Date }],
  group: { type: Schema.ObjectId, ref: 'Group' },
  points: { type: Number }, // if group
  matches_won: { type: Number }, // if group
  matches_lost: { type: Number }, // if group
  sets_won: { type: Number }, // if group
  sets_lost: { type: Number }, // if group
  qualified: { type: Boolean }, // if the event is qualifying to another event
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { registrationSchema }
export default mongoose.model('Registration', registrationSchema)

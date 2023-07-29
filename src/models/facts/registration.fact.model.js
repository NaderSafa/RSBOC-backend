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
  fees: { type: Number },
  currency: { type: String },
  payment_method: { type: String, enum: ['cash', 'instapay'] },
  payment_image_url: { type: String },
  preferred_dates: [{ type: Date }],
  group: { type: Schema.ObjectId, ref: 'Group' },
  points: { type: Number },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { registrationSchema }
export default mongoose.model('Registration', registrationSchema)

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
  payment_image_url: { type: String },
  group: { type: String },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { registrationSchema }
export default mongoose.model('Registration', registrationSchema)

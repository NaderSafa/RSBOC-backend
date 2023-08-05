import mongoose from 'mongoose'

const Schema = mongoose.Schema

const groupSchema = new Schema({
  name: { type: String, required: true },
  registrations: [
    {
      type: Schema.ObjectId,
      ref: 'Registration',
      required: true,
    },
  ],
  event: {
    type: Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  matches: [
    {
      type: Schema.ObjectId,
      ref: 'Match',
    },
  ],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { groupSchema }
export default mongoose.model('Group', groupSchema)

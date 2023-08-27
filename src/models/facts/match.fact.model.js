import mongoose from 'mongoose'
import { setSchema } from './set.fact.model.js'

const Schema = mongoose.Schema

const nextSchema = new Schema({
  event: {
    type: Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  round: { type: Number, required: true },
  match: { type: Number, required: true },
})

const matchSchema = new Schema({
  group: { type: Schema.ObjectId, ref: 'Group' },
  event: {
    type: Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  registration1: {
    type: Schema.ObjectId,
    ref: 'Registration',
    // required: true,
  },
  registration2: {
    type: Schema.ObjectId,
    ref: 'Registration',
    // required: true,
  },
  referee: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  round: { type: Number },
  match: { type: Number },
  win: nextSchema,
  loss: nextSchema,
  winner: { type: Schema.ObjectId, ref: 'Registration' },
  sets: [setSchema],
  played: { type: Boolean, default: false },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
})

export { matchSchema }
export default mongoose.model('Match', matchSchema)

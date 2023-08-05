import mongoose from 'mongoose'

const Schema = mongoose.Schema

const setSchema = new Schema({
  set_number: Number,
  registration1_score: Number,
  registration2_score: Number,
})

export { setSchema }
export default mongoose.model('Set', setSchema)

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const clubSchema = new Schema({
  name: { type: String, required: true },
  country: { type: Schema.ObjectId, ref: 'Country', required: true },
  image_url: { type: String },
})

export { clubSchema }
export default mongoose.model('Club', clubSchema)

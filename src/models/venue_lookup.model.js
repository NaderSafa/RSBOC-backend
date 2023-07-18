import mongoose from 'mongoose'

const Schema = mongoose.Schema

const venueSchema = new Schema({
  name: { type: String },
  location_url: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  images: [{ type: String, default: [] }],
})

export { venueSchema }
export default mongoose.model('VenueLookup', venueSchema)

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const countrySchema = new Schema({
  name: { type: String },
  alpha_2: { type: String, unique: true },
  alpha_3: { type: String, unique: true },
  country_code: { type: String, unique: true },
  iso_3166_2: { type: String, unique: true },
  region: { type: String },
  sub_region: { type: String },
  intermediate_region: { type: String },
  region_code: { type: String },
  sub_region_code: { type: String },
  intermediate_region_code: { type: String },
})

export { countrySchema }
export default mongoose.model('Country', countrySchema)

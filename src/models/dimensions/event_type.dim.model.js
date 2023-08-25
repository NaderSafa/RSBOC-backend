import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventTypeSchema = new Schema({
  // general info
  code: { type: String, required: true },
  time_based: { type: Boolean, required: true },
  head: {
    type: String,
    required: true,
    enum: [
      'solo',
      'singles',
      'doubles',
      'relay',
      'solo teams',
      'singles teams',
    ],
  },
  players_per_team: { type: Number, required: true },
  // match based info
  best_of: [{ type: Number }], // [3,0,5] means final is best of 5, [3,1,5] means final and semifinal are best of 5
  points_per_set: { type: Number },
  tie_breaks: { type: Number },
  tournament_format: {
    type: String,
    enum: ['groups', 'single elimination', 'double elimination'],
  },
  consolation: { type: Boolean }, // if tournament_format === 'single elimination'
  starting_round: { type: Number }, // if tournament_format === 'double elimination'
  max_group_teams: { type: Number }, // if tournament_format === 'groups'
  min_group_teams: { type: Number }, // if tournament_format === 'groups'
  points_per_win: { type: Number }, // if tournament_format === 'groups'
  points_per_lose: { type: Number }, // if tournament_format === 'groups'
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
  // time based info
})

export { eventTypeSchema }
export default mongoose.model('EventType', eventTypeSchema)

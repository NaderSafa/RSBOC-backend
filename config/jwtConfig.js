// Import enviroment variables
import dotenv from 'dotenv'
dotenv.config()

const jwtConfig = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
}

export default jwtConfig

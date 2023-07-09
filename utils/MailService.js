// Import enviroment variables
import dotenv from 'dotenv'
dotenv.config()

// Mailgun configuration
const domain = process.env.MAILGUN_DOMAIN
const apiKey = process.env.MAILGUN_API_KEY

import Mailgun from 'mailgun-js'

const mailgun = new Mailgun({ domain, apiKey })

const test = {
  sendMail: (mailTo, mailSubject, mailText, html, attachments = []) => {
    mailgun
      .messages()
      .send({
        from: `PA<info@${domain}>`,
        to: mailTo,
        subject: mailSubject,
        text: mailText,
        html,
        attachments,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  },
}

export default test

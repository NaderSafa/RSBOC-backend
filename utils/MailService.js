// // Import enviroment variables
// import dotenv from 'dotenv'
// dotenv.config()

// // Mailgun configuration
// const domain = 'sandboxf74ee44f6b914b618eea7785cc3c4d31.mailgun.org'
// const apiKey = '530f5b6045854c54b83f2b77a47effe0-6d8d428c-079e5347'

// import Mailgun from 'mailgun-js'

// const mailgun = new Mailgun({ domain, apiKey })

// const test = {
//   sendMail: (mailTo, mailSubject, mailText, html, attachments = []) => {
//     mailgun
//       .messages()
//       .send({
//         from: `PA<info@${domain}>`,
//         to: mailTo,
//         subject: mailSubject,
//         text: mailText,
//         html,
//         attachments,
//       })
//       .then((res) => console.log(res))
//       .catch((err) => console.log(err))
//   },
// }

// export default test

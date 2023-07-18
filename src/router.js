import UsersController from './controllers/users.js'
import ChampionshipDimController from './controllers/championship_dim.controller.js'
import ChampionshipFactController from './controllers/championship_fact.controller.js'
import DevelopersController from './controllers/developers.js'
import RegistrationsController from './controllers/registrations.js'
import EventsController from './controllers/events.js'
import ResultsController from './controllers/results.js'
import NotificationsController from './controllers/notifications.js'
import authenticateUser from './middlewares/authenticateUser.js'
import authorizeUser from './middlewares/authorizeUser.js'
import multer from 'multer'
import CountryController from './controllers/country_lookup.controller.js'
import VenueController from './controllers/venue_lookup.controller.js'

export default (express, passport, adminJs) => {
  const getCrudMethods = (controller, identifier = null) => {
    return (
      express
        .Router()
        .get(`/`, authenticateUser, authorizeUser('all'), controller.findAll)
        .get(
          `/:${identifier}`,
          authenticateUser,
          authorizeUser('all'),
          controller.findOne
        )
        .post(`/`, controller.create)
        .patch(`/`, authenticateUser, authorizeUser('all'), controller.update)
        // .put(`/:${identifier}`, controller.update)
        .delete(`/:${identifier}`, controller.destroy)
    )
  }

  const upload = multer({ storage: multer.memoryStorage() })

  return (
    express
      .Router()
      .use('/users', getCrudMethods(UsersController, 'user_id'))
      .use('/country', getCrudMethods(CountryController, 'country_id'))
      .use(
        '/championship_dim',
        getCrudMethods(ChampionshipDimController, 'championship_dim_id')
      )
      .use(
        '/championship_fact',
        getCrudMethods(ChampionshipFactController, 'championship_fact_id')
      )
      .use('/venue', getCrudMethods(VenueController, 'venue_id'))
      .post(
        '/users/upload',
        authenticateUser,
        authorizeUser('all'),
        upload.single('filename'),
        UsersController.uploadProfilePicture
      )
      .post(
        '/users/:user_id/registrations/:registration_id/qrcode',
        RegistrationsController.saveQRCodeToFS
      )
      .post('/users/login', UsersController.login)
      .post('/users/register', UsersController.registerCombined)
      .get(
        '/getUser',
        authenticateUser,
        authorizeUser('all'),
        UsersController.getUserData
      )
      // .post('/users/verifyEmail', UsersController.verifyEmail)
      .post(
        '/users/:user_id/registration',
        RegistrationsController.addRegistration
      )
      .get(
        '/users/:user_id/registrations',
        RegistrationsController.getUserRegistrations
      )
      .get('/events', EventsController.findAll)
      .patch('/events/:event_id', EventsController.incrementTotalScanned)
      .post(
        '/users/:user_id/notifications',
        UsersController.registerNotificationToken
      )
      .get('/users/:user_id/admin/event', EventsController.getAdminEvent)
      .get('/users/:user_id/events', UsersController.getUserRegisteredEventIds)
      .get('/users/:user_id/developer', UsersController.getDeveloperTitle)
      .get('/developers', DevelopersController.findAll)
      .get('/results', ResultsController.renderResults)
      .get('/notifications', NotificationsController.renderNotificationHTML)
      .post('/notifications', NotificationsController.sendNotifications)
      .get('/notifications/test', NotificationsController.sendNotifications)
  )
  // .get("/notifications/register", NotificationsController.registerToken);
}

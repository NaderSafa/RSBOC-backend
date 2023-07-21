import UsersController from './controllers/dimensions/user.dim.controller.js'
import ChampionshipController from './controllers/dimensions/championship.dim.controller.js'
import TournamentController from './controllers/facts/tournament.fact.controller.js'
import RegistrationController from './controllers/facts/registration.fact.controller.js'
// import RegistrationsController from './controllers/registrations.js'
import ResultsController from './controllers/results.js'
// import NotificationsController from './controllers/notifications.js'
import authenticateUser from './middlewares/authenticateUser.js'
import authorizeUser from './middlewares/authorizeUser.js'
import multer from 'multer'
import CountryController from './controllers/lookups/country.lookup.controller.js'
import VenueController from './controllers/lookups/venue_lookup.controller.js'
import EventTypeController from './controllers/dimensions/event_type.dim.controller.js'
import EventController from './controllers/bridges/event.bridge.controller.js'

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

  return express
    .Router()
    .use('/users', getCrudMethods(UsersController, 'user_id'))
    .use('/country', getCrudMethods(CountryController, 'country_id'))
    .use(
      '/championship',
      getCrudMethods(ChampionshipController, 'championship_id')
    )
    .use('/tournament', getCrudMethods(TournamentController, 'tournament_id'))
    .use('/venue', getCrudMethods(VenueController, 'venue_id'))
    .use('/event_type', getCrudMethods(EventTypeController, 'event_type_id'))
    .use('/event', getCrudMethods(EventController, 'event_id'))
    .use(
      '/registration',
      getCrudMethods(RegistrationController, 'registration_id')
    )
    .post(
      '/users/upload',
      authenticateUser,
      authorizeUser('all'),
      upload.single('filename'),
      UsersController.uploadProfilePicture
    )
    .post('/users/login', UsersController.login)
    .post('/users/register', UsersController.registerCombined)
    .post('/users/forgot-password', UsersController.forgotPassword)
    .get(
      '/getUser',
      authenticateUser,
      authorizeUser('all'),
      UsersController.getUserData
    )
  // .get("/notifications/register", NotificationsController.registerToken);
}

import Event from '../models/event.js';
import Developer from '../models/developer.js';
import User from '../models/user.js';
import Registration from '../models/registration.js';
import user from '../models/user.js';

const findAll = (req, res) => {
  Event.find({}, (error, events) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.send(events);
    }
  });
};

const getAdminEvent = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log('finding event..', user.eventId);
      Event.findById(user.eventId, (err, event) => {
        if (err) {
          console.log(err);
        } else {
          console.log(event);
          res.status(200).send(event);
        }
      });
    }
  });
};

const incrementTotalScanned = (req, res) => {
  console.log(req.body.registrationId);
  console.log('request body', req.body);
  Registration.findByIdAndUpdate(
    req.body.registrationId,
    { attendance: true },
    { new: true },
    (err, registration) => {
      if (err) {
        console.log(err);
      } else {
        //check if logged in scanner is developer or admin
        //if develoepr, add the developer title to the user's developersVisited array:
        if (req.body.developerTitle) {
          !registration.developersVisited.includes(
            req.body.developerTitle
          ) &&
            registration.developersVisited.push(
              req.body.developerTitle
            );
          registration.save();
          User.findOne({ uid: req.body.currentUser }, (err, user) => {
            if (err) {
              console.log(err);
            } else {
              if (
                !user.registeredEventIds.includes(
                  req.body.registrationId
                )
              ) {
                console.log('here will add user');
                user.registeredEventIds.push(req.body.registrationId);
                user.registrations.push(registration);
                user.save();
              } else {
                console.log('user already scanned');
              }
            }
          });
          Registration.find(
            {
              developersVisited: req.body.developerTitle,
              'event._id': req.params.event_id,
            },
            (err, registrations) => {
              if (err) {
                console.log(err);
              } else {
                //return the total number of people who were scanned at this developer
                res.status(200).send({ total: registrations.length });
              }
            }
          );
        } else {
          //if scanner is an admin: update event attendance and update registration card on the user object
          registration.event._id.toString() === req.params.event_id
            ? //update registration card on the user object for faster queries in the future
              User.findOne(
                { email: registration.user.email },
                (err, user) => {
                  const currentRegistration = user.registrations.find(
                    (currentReg) =>
                      currentReg._id.equals(registration._id)
                  );
                  currentRegistration.attendance = true;
                  req.body.developerTitle &&
                    !currentRegistration.developersVisited.includes(
                      req.body.developerTitle
                    ) &&
                    currentRegistration.developersVisited.push(
                      req.body.developerTitle
                    );
                  user.save();
                  //return the total number of people who showed up to the event
                  Registration.find(
                    { attendance: true },
                    (err, registrations) => {
                      if (err) {
                        console.log(err);
                      } else {
                        Event.findOne(
                          {
                            _id: registration.event._id,
                          },
                          (err, event) => {
                            if (err) {
                              console.log(err);
                            } else {
                              //Updating total scanned number for events
                              event.totalScanned =
                                event.totalScanned + 1;
                              event.save();
                              res.status(200).send({
                                total: event.totalScanned,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              )
            : res.status(400).send({ message: 'Invalid QR Code!' });
        }
      }
    }
  );
};

export default {
  findAll,
  getAdminEvent,
  incrementTotalScanned,
};

import User from '../models/dimensions/user.dim.model.js'
import Attachment from '../models/attachment.js'
import fs from 'fs'

// Handle index actions
const renderResults = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
  })
  fs.readFile('./src/views/landing.html', null, function (error, data) {
    if (error) {
      // res.writeHead(404);
      // res.write("Whoops! File not found!");
    } else {
      res.write(data)
    }
    res.end()
  })

  // User.find({}, (error, users) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send(error);
  //   } else {
  //     console.log(req.params);
  //     req.query.token === "wvGe5xbCkyiDcpnFTbzex8iQsYHceSYR"
  //       ? res.send(users)
  //       : res.send("Success");
  //   }
  // });
}

export default {
  renderResults,
}

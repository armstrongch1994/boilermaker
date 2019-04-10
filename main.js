'use strict';

const { db } = require('./server/db');
const app = require('./server');
const port = process.env.PORT || 3001; // this can be very useful if you deploy to Heroku!

db.sync().then(function() {
  app.listen(port, () => {
    console.log(
      `Yay!, your server is listening on port ${port} http://localhost:3001/`
    );
  });
});

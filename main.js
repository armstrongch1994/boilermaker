'use strict';

const app = require('./server');
const port = process.env.PORT || 3001; // this can be very useful if you deploy to Heroku!
app.listen(port, function() {
  console.log(`Yay!, your server is listening on port ${port}`);
});

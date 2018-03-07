// TODO: your code goes here
console.log(process.argv);

var mongoose = require('mongoose');
mongoose.Promise = Promise;
var db = mongoose.connection;

db.on('error', console.error); // log any errors that occur

// bind a function to perform when the database has been opened
db.once('open', function() {
  // perform any queries here, more on this later
  console.log("Connected to DB!");
});

// process is a global object referring to the system process running this
// code, when you press CTRL-C to stop Node, this closes the connection
process.on('SIGINT', function() {
   mongoose.connection.close(function () {
       console.log('DB connection closed by Node process ending');
       process.exit(0);
   });
});

// the user, password, and url values will be explained next
mongoose.connect('mongodb://bdognom.cs.brown.edu/cdquery', {
  user: 'cs132',
  pass: 'csci1320',
  useMongoClient: true
});

var trackSchema = new mongoose.Schema({
  name: String,
  artist: String,
  length: Number,
  number: Number,
  offset: Number
});

var Track = mongoose.model('Track', trackSchema);

var cdSchema = new mongoose.Schema({
  diskid: String,
  title: String,
  artist: String,
  length: Number,
  genre: String,
  year: Number,
  tracks: [trackSchema]
});

var CD = mongoose.model('CD', cdSchema);


CD.find({
  artist: process.argv[3]
})
.limit(5)
.exec()
.then(cds => {
  if (process.argv[2] === 'related') {
    if (cds.length > 0) {
      var artists = new Set();
      cds.forEach(cd => {
        cd.tracks.forEach(track => {
          artists.add(track.artist);
        })
      })

      console.log(artists.has(process.argv[4]) ? 'True' : 'False');
    } else {
      console.log('False');
    }
  }

  if (process.argv[2] === 'search') {
    if (cds.length > 0) {
      console.log(cds)
      var max = +process.argv[4];
      var count = 0;
      cds.forEach(cd => {
        cd.tracks.forEach(track => {
          if (count < max && track.artist !== process.argv[3]) {

            console.log(track.artist);
            count += 1;
          }
        })
      })
    }
  }

})


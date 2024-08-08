const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');


const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// The following HTML routes should be created:

// * `GET /notes` should return the `notes.html` file.
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// * `GET *` should return the `index.html` file.
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// The following API routes should be created:

// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/notes.json'));
});
//get route to get a specific note id
app.get('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid();
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json('Error reading db.json');
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json('Error writing to db.json');
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

// // // `GET /notes` should return the `notes.html` file.


// app.get('/notes', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/notes.html'))
// );

// // `GET *` should return the `index.html` file.
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/index.html'))
// );

// // Create a GET route to should read the `db/notes.json` file and return
// //all saved notes as JSON on the homepage.
// app.get('/api/notes', (req, res) => {
//   res.sendFile(path.join(__dirname, '/db/notes.json'));
// });

// //Create post route to create a new note, storing the title and text
// //in the db/notes.json file and then displaying the note on the homepage

// app.post('/api/notes', (req, res) => {
//     const newNote = req.body;
//     newNote.id = uuid();
//     fs.readFile(dbPath, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).json('Error reading db.json');
//         } else {
//             const notes = JSON.parse(data);
//             notes.push(newNote);
//             fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).json('Error writing to db.json');
//                 } else {
//                     res.json(newNote);
//                 }
//             });
//         }
//     });
// });
// // Delete route for deleting existing notes
// app.delete('/notes/:notes_id', (req, res) => {
//     const noteId = req.params.note_id;
//     readFromFile('./db/notes.json')
//       .then((data) => JSON.parse(data))
//       .then((json) => {
//         // Make a new array of all notes except the one with the ID provided in the URL
//         const result = json.filter((note) => note.note_id !== noteId);
  
//         // Save that array to the filesystem
//         writeToFile('./db/notes.json', result);
  
//         // Respond to the DELETE request
//         res.json(`Item ${noteId} has been deleted ���️`);
//       });
//   });
// // GET route for notes page for specific note id
// app.get('/notes/:notes_id', (req, res) =>
//     res.sendFile(path.join(__dirname, '/public/notes.html'))
// );

//   // Add a delete handler for when somebody clicks on the icon to delete a note

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);





//* `POST /api/notes` should receive a new note to save on the request body,
//add it to the `db/notes.json` file, and then return the new note 
//to the client. You'll need to find a way to give each note a unique id when it is saved





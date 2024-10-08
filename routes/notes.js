const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all stored notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});


// GET Route to view a specific note
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// POST Route to create a new note.
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/notes.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});
// Route to delete a note, removes the note with the given `id` property, 
//and then rewrites the notes to the `db.json` file.

notes.delete('/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);

      if (result.length === json.length) {
        return res.status(404).json({ error: `Note with id ${noteId} not found` });
      }

      writeToFile('./db/notes.json', result)
        .then(() => res.json({ message: `Note with id ${noteId} has been deleted` }))
        .catch((err) => res.status(500).json({ error: 'Failed to delete note' }));
    })
    .catch((err) => res.status(500).json({ error: 'Failed to read notes' }));
});



module.exports = notes;

const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = 3001;
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "db", "db.json");

async function getNotes() {
  try {
    const data = await fs.promises.readFile(dbPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function saveNotes(notes) {
  try {
    await fs.promises.writeFile(dbPath, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error("Error saving notes:", err);
    throw err;
  }
}

app.post("/api/notes", async (req, res) => {
  try {
    const newNote = { ...req.body, id: (await getNotes()).length + 1 };
    const notes = await getNotes();
    notes.push(newNote);
    await saveNotes(notes);
    res.status(201).json(notes);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Error creating note" });
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);




const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  notes.push(req.body);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes))
  res.json(notes)
});

app.delete('/api/notes/:id', (req, res) => {
  for (let i = 0; i < notes.length; i++) {
    if (req.params.id === notes[i].id) {
      notes.splice(i, 1)
      break;
    }    
  }
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(notes);
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});



app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);

module.exports = app;
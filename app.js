const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cricketTeam.db");
const app = express();

app.use(express.json());

// API 1: GET all players
app.get("/players", (req, res) => {
  db.all("SELECT * FROM cricket_team", (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(rows);
    }
  });
});

// API 2: POST a new player
app.post("/players", (req, res) => {
  const { player_name, jersey_number, role } = req.body;
  if (!player_name || !jersey_number || !role) {
    res.status(400).send("Missing required fields");
    return;
  }
  db.run(
    "INSERT INTO cricket_team (player_name, jersey_number, role) VALUES (?, ?, ?)",
    [player_name, jersey_number, role],
    function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.status(201).send({ player_id: this.lastID });
      }
    }
  );
});

// API 3: GET a player by ID
app.get("/players/:playerId", (req, res) => {
  const playerId = req.params.playerId;
  db.get(
    "SELECT * FROM cricket_team WHERE player_id = ?",
    playerId,
    (err, row) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else if (row) {
        res.send(row);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

// API 4: PUT a player by ID
app.put("/players/:playerId", (req, res) => {
  const playerId = req.params.playerId;
  const { player_name, jersey_number, role } = req.body;
  if (!player_name || !jersey_number || !role) {
    res.status(400).send("Missing required fields");
    return;
  }
  db.run(
    "UPDATE cricket_team SET player_name = ?, jersey_number = ?, role = ? WHERE player_id = ?",
    [player_name, jersey_number, role, playerId],
    function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else if (this.changes === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

// API 5: DELETE a player by ID
app.delete("/players/:playerId", (req, res) => {
  const playerId = req.params.playerId;
  db.run(
    "DELETE FROM cricket_team WHERE player_id = ?",
    playerId,
    function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else if (this.changes === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

module.exports = app;

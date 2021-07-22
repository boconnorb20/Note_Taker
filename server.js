// Importing dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Server creation
const app = express();

// Set a port listener
const PORT = process.env.PORT || 3000

// Setting the createDataNote array
let createDataNote = [];

// Middleware and body parsing, static, and the route taken
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

// The api call response for notes taken also having results sent to over to the browser as an array of objects
app.get("/api/notes", function (err, res) {
    try {
      createDataNote = fs.readFileSync("db/db.json", "utf8");
      console.log("Hello from the SERVER!");
      createDataNote = JSON.parse(createDataNote);
    } catch (err) {
      console.log("\n error (catch err app.get):");
      console.log(err);
    }
    res.json(createDataNote);
  });

  // Writing the new note to the json file and sending back to the browser
app.post("/api/notes", function (req, res) {
    try {
      createDataNote = fs.readFileSync("./db/db.json", "utf8");
      console.log(createDataNote);
      createDataNote = JSON.parse(createDataNote);
      req.body.id = createDataNote.length;
      createDataNote.push(req.body);
      createDataNote = JSON.stringify(createDataNote);
      fs.writeFile("./db/db.json", createDataNote, "utf8", function (err) {
        if (err) throw err;
      });
  
      res.json(JSON.parse(createDataNote));
    } catch (err) {
      throw err;
      console.error(err);
    }
  });

  // Function for deleting a note and then reading the json file. Also writing the new note to the file to send back to the browser

app.delete("/api/notes/:id", function (req, res) {
    try {
      createDataNote = fs.readFileSync("./db/db.json", "utf8");
      createDataNote = JSON.parse(createDataNote);
      createDataNote = createDataNote.filter(function (note) {
        return note.id != req.params.id;
      });
      createDataNote = JSON.stringify(createDataNote);
  
      fs.writeFile("./db/db.json", createDataNote, "utf8", function (err) {
        if (err) throw err;
      });
  
      res.send(JSON.parse(createDataNote));
    } catch (err) {
      throw err;
      console.log(err);
    }
  });
  
  // html and  GET requests
  
  // when the GET start button is clicked it will display the note.html to be displayed to the page
  app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });
  
  // Funtion for if no matching route is seen, then it'll default to home
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });
  
  app.get("/api/notes", function (req, res) {
    return res.sendFile(path.json(__dirname, "db/db.json"));
  });
  
  // Server on the port
  app.listen(PORT, function () {
    console.log("SERVER IS LISTENING: " + PORT);
  });


  






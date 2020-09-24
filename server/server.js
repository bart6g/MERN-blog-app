const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = 4000;
const app = express();
const noteRoutes = express.Router();
let Note = require("./note.model.js");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//connect to DB

mongoose.connect("mongodb://127.0.0.1:27017/notes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/notes", noteRoutes);

//GET ROUTES /TODOS/

noteRoutes.route("/").get((req, res) => {
  Note.find((err, notes) => {
    if (err) {
      console.log(err);
    } else {
      res.json(notes);
    }
  });
});

noteRoutes.route("/:id").get((req, res) => {
  let id = req.params.id;
  Note.findById(id, (err, note) => {
    if (err) {
      console.log(err);
    } else {
      res.json(note);
    }
  });
});

// POST ROUTES /TODOS/ADD
noteRoutes.route("/add").post((req, res) => {
  let note = new Note(req.body);

  note
    .save()
    .then((note) => {
      res.status(200).send("adding new note successfull");
    })
    .catch((err) => {
      res.status(400).send("adding new note failed");
    });
});

noteRoutes.route("/update/:id").post((req, res) => {
  Note.findById(req.params.id, (err, note) => {
    if (!note) {
      res.status(404).send("data is not found");
    } else {
      (note.title = req.body.title),
        (note.author = req.body.author),
        (note.description = req.body.description);

      note
        .save()
        .then((note) => {
          res.json("note updated");
        })
        .catch((err) => {
          res.status(400).send("update is not possible");
        });
    }
  });
});

//DELETE NOTE

noteRoutes.route("/delete/:id").delete((req, res) => {
  let id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((note) => {
      if (!note) {
        return res.status(404).send("note not found");
      } else {
        res.send("note deleted successfully");
      }
    })
    .catch((err) => {
      return res.status(500).send("could not delete note");
    });
});

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

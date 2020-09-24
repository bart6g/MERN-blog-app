const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Note = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Note", Note);

const mongoose = require("mongoose");

const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide organization name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
});

module.exports = mongoose.model("Organization", OrgSchema);

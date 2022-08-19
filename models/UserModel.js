const mongoose = require(`mongoose`);
const { Schema } = mongoose;

const userModel = new Schema({
  name: { type: String },
  password: { type: String },
  adminLevel: { type: Number },
});

module.exports = mongoose.model("Book", userModel);

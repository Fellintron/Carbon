const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema({
  name: String,
  usage: { type: Number, default: 0 },
  disabled: { type: Boolean, default: 0 },
});

module.exports = mongoose.model('command', CommandSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: String,
  commandsRan: { type: Number, default: 0 },
  afk: {
    reason: String,
    timestamp: Number
  },
  highlight: {
    words: [String]
  },
  messageSettings: {
    highlightsDisabled: Boolean,
    snipesDisabled: Boolean,
    lastPingDisabled: Boolean
  }
});

module.exports = mongoose.model('user', UserSchema);

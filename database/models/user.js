const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: String,
  commandsRan: { type: Number, default: 0 },
  afk: {
    type: Object,
    default: {
      afk: false
    }
  },
  highlight: {
    words: [String]
  },
  messageSettings: {
    highlightsDisabled: Boolean,
    snipesDisabled: Boolean,
    lastPingDisabled: Boolean
  },
  fighthub: {
    voting: {
      hasVoted: Boolean,
      lastVoted: Number,
      enabled: Boolean
    },
    investor: {
      isInvestor: Boolean,
      expiresOn: Number
    }
  }
});

module.exports = mongoose.model('user', UserSchema);

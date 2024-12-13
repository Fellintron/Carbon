const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  guildID: { type: String, required: true },
  donationRoles: { type: [String] },
  logChannel: { type: String },
  gtnRole: { type: [String] },
  skullBoard: {
    enabled: Boolean,
    count: Number,
    channelId: String
  },
  disabledDrop: { type: [String] },
  snipeConfig: {
    enabled: Boolean,
    allowedRoles: [String]
  },
  giveaway_config: {
    manager_roles: [String],
    blacklisted_roles: [String],
    bypass_roles: [String]
  },
  lockdownSet: {
    channels: [String],
    lockDowned: Boolean,
    issuedBy: String,
    message: String
  },
  afkIgnore: [String]
});

module.exports = mongoose.model('SettingsSchema', SettingsSchema);

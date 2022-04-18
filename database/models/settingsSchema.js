const mongoose = require('mongoose')

const SettingsSchema = new mongoose.Schema({
    guildID: { type: String, required: true },
    donationRoles: { type: [String] },
    logChannel: { type: String },
    gtnRole: { type: [String] },
    disabledDrop: { type: [String] },
    snipes: { type: Boolean },
    lockdownSet: {
        channels: [String],
        lockDowned: Boolean,
        issuedBy: String,
        message: String,
    },
    heistMode: {
        enabled: Boolean,
        joined: Number,
        left: Number,
        startedOn: Number,
    },
    afkIgnore: [String],
    censors: {
        censors: [Object],
        timeout_duration: Number,
    },
    pings: {
        mini: Number,
        gaw: Number,
        event: Number,
    },
})

module.exports = mongoose.model('SettingsSchema', SettingsSchema)

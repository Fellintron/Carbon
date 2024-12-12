const userSchema = require('../../database/models/user');
const guildSchema = require('../../database/models/settingsSchema');

module.exports = {
  name: 'afk',
  cooldown: 5,
  category: 'Utility',
  usage: '[reason]',
  description: 'Displays an AFK message when someone pings you.',
  async execute(message, args, client) {
    await guildSchema.findOneAndUpdate({ guildID: message.guild.id }, { afkIgnore : [] }, { upsert: true });
    
    const reason = args.join(' ') ?? 'AFK';
    
    await userSchema.findOneAndUpdate({ userId: message.author.id }, { afk: { reason, time: new Date() }}, { upsert: true })

    message.channel.send(`${message.author.toString()}, I have set your AFK: ${reason}`);
    
    message.member.setNickname(`[AFK] ${message.member.displayName}`);
    
    client.afks.push(message.author.id);
  }
};

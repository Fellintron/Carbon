const { EmbedBuilder } = require('discord.js');
const serverSettings = require('../database/models/settingsSchema');
const skulls = require('../database/models/skullboard');
module.exports = {
  name: 'messageReactionRemove',
  once: false,
  async execute(reaction, client) {
    console.log(`Reaction Removed; name: ${reaction.emoji.name}`);
    if (!reaction.emoji.name || reaction.emoji.name !== '💀') return;

    const message = reaction.message;
    const valid = await serverSettings.findOne({
      guildID: message.guild.id
    });
    if (!valid) return;
    if (!valid?.skullBoard.enabled) return;

    const { count, channelId } = valid.skullBoard;
    const rec = await reaction.fetch();
    const exists = await skulls.findOne({
      messageId: message.id
    });
    if (rec.count < count) {
      if (!exists) return;
      const mesId = exists.skullBoardMessageId;
      if (exists) {
        await skulls.deleteMany({
          messageId: message.id
        });
        const c = client.channels.cache.get(valid.skullBoard.channelId);
        const m = await c.messages.fetch(mesId);
        if (!m) return;

        m.delete();
        return;
      }
    } else {
      exists.count--;
      const c = client.channels.cache?.get(channelId);
      let msg = await c.messages.fetch(exists.skullBoardMessageId);
      const ee = EmbedBuilder.from(msg.embeds[0]);
      ee.setTitle(`**${reaction.count} :skull:**`);
      //msg.embeds[0].setTitle(`**${exists.count} :skull:**`)
      msg.edit({
        embeds: [ee]
      });
      exists.save();
    }
  }
};

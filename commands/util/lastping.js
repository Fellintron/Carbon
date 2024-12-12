const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const Pings = require('../../database/models/ping');
module.exports = {
  name: 'lastping',
  aliases: ['lp'],
  usage: '',
  category: 'Utility',
  description: 'Check your previous 10 pings in the server!',
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(message, args) {
    const DBUser = await Pings.findOne({ userId: message.author.id });

    const PingBed = new EmbedBuilder()
      .setTitle('Last Pings')
      .setColor('Green')
      .setTimestamp();

    if (!DBUser || !DBUser?.pings.length) {
      PingBed.setDescription(`None of your pings have been counted yet!`);
      return message.reply({
        embeds: [PingBed]
      });
    }

    let pings = DBUser.pings.sort((a, b) => b.when - a.when);
    if (pings.length > 10) pings = pings.slice(0, 10);
    const map = pings
      .map(
        (V, I) =>
          `${I + 1}. **In <#${V.channel}>, <t:${(V.when / 1000).toFixed(
            0
          )}:R>**\n**${V.author}**: ${V.content} [[Jump]](${V.message_link})`
      )
      .join('\n➖➖➖➖➖➖➖\n');
    PingBed.setDescription(map);
    const inboxMessage = await message.reply({
      content: 'Only 10 recent pings are shown...',
      embeds: [PingBed],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Clear inbox')
            .setEmoji('📭')
            .setCustomId('clear-inbox_lp')
        ])
      ]
    });

    const collector = inboxMessage.createMessageComponentCollector({
      filter: (but) => but.user.id === message.author.id,
      time: 30000
    });

    collector.on('collect', async (button) => {
      DBUser.pings = [];
      DBUser.save();

      PingBed.setDescription('Inbox cleared!');
      button.reply({
        content: 'Inbox is cleared.',
        ephemeral: true
      });
      inboxMessage.edit({
        embeds: [PingBed],
        components: [
          new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
              .setLabel('Clear inbox')
              .setEmoji('📭')
              .setCustomId('clear-inbox_lp')
              .setDisabled()
          ])
        ]
      });
    });
  }
};

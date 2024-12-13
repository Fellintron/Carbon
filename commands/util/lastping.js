const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const pingSchema = require('../../database/models/ping');

module.exports = {
  name: 'lastping',
  aliases: ['lp'],
  category: 'Utility',
  description: 'Check your previous 10 pings in the server.',
  async execute(message, args) {
    const user = await pingSchema.findOne({ userId: message.author.id });

    const embed = new EmbedBuilder()
      .setTitle('Last pings')
      .setColor('Green')
      .setTimestamp();

    if (!user || !user?.pings?.length) {
      embed.setDescription(`None of your pings have been counted yet.`);
      
      return message.reply({
        embeds: [embed]
      });
    }

    let pings = user.pings.sort((a, b) => b.timestamp - a.timestamp);
    if (pings.length > 10) pings = pings.slice(0, 10);
    
    const map = pings
      .map(
        (V, I) =>
          `${I + 1}. **In <#${V.channel}>, <t:${(V.when / 1000).toFixed(
            0
          )}:R>**\n**${V.author}**: ${V.content} [[Jump]](${V.message_link})`
      )
      .join('\n➖➖➖➖➖➖➖\n');
      
      function generateEmbeds() {
        const pings = []
        for (let i = 0; i < user.pings.length; i++) {
      const ping = user.pings[i];
    
      description.push(
        dedent`${i+1}. In <#${ping.channelId}>, <t:${(ping.timestamp/1000).toFixed()}:R> **${card.name}** • ${card.element} • Level ${card.level} • Tier : ${tierKeys[card.tier]}`,
      );
    }
      
    let description = [];
    const embeds = [];

    for (let i = 0; i < pings.length; i += 10) {
      description = pings.slice(i, i + 10);
      embeds.push(
        new EmbedBuilder()
          .setDescription(description.join('\n'))
          .setAuthor({
            name: `${target.username}'s pings`,
            iconURL: target.displayAvatarURL(),
          })
          .setColor('Blurple')
          .setFooter({
            text: `Page ${embeds.length + 1} / ${Math.ceil(pings.length / 10)}`,
          })
          .setTimestamp(),
      );
    }

    return embeds;
    
    function generateComponents(currentPage, totalPages, disabled = false) {
    const buttons = [];
    const emojis = [
      { id: '⏪', name: 'First' },
      { id: '◀️', name: 'Previous' },
      { id: '⏺️', name: 'Stop', style: ButtonStyle.Danger },
      { id: '▶️', name: 'Next' },
      { id: '⏩', name: 'Last' },
    ];

    for (let index = 0; index < emoji.length; index++) {
      const emoji = emojis[index];
      
      buttons.push(
        new ButtonBuilder()
          .setCustomId(emoji.name.toLowerCase())
          .setLabel(emoji.name)
          .setStyle(emoji?.style ?? ButtonStyle.Primary)
          .setEmoji({ name: emoji.id })
          .setDisabled(
            (currentPage === 1 && ['⏪', '◀️'].includes(emoji.id)) ||
              (currentPage === totalPages && ['⏩', '▶️'].includes(emoji.id)) ||
              disabled === true
              ? true
              : false,
          ),
      );
    }
    
    const row = new ActionRowBuilder().addComponents(buttons);

    return row;
  }

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

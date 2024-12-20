const {
  Message,
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: 'snipe',
  cooldown: 5,
  fight: '824294231447044197',
  requiredRoles: [
    '826196972167757875',
    '969870378811916408',
    '825283097830096908',
    '839803117646512128',
    '824687393868742696',
    '999911429421408346',
    '828048225096826890',
    '826002228828700718',
    '999911166673428521'
  ],
  notfight: '1001156093407395960',
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const guildId = message.guild.id;

    if (guildId === this.fight) {
      const hasRole = this.requiredRoles.some(roleId => 
        message.member.roles.cache.has(roleId)
      );
      if (!hasRole) {
        return message.reply('You do not have permission to use this command.');
      }
    } else if (guildId !== this.notfight) {
      return message.reply('This command is not available in this server.');
    }

    const channelId =
      message.mentions.channels?.first()?.id || message.channel.id;
    const snipes = client.snipes.snipes.get(channelId);

    if (!snipes) {
      return message.reply('There is nothing to be sniped!');
    }

    let index = +args[0] - 1 || 0;
    let target = snipes[index];
    let { msg, time, image } = target;

    let snipeEmbed = new EmbedBuilder()
      .setAuthor({
        name: msg.author.tag || 'Unknown',
        iconURL: msg.author.displayAvatarURL()
      })
      .setDescription(msg.content)
      .setColor('Random')
      .setImage(image)
      .setFooter({
        text: `${index + 1}/${snipes.length}`
      })
      .setTimestamp(time);

    let prevBut = new ButtonBuilder()
      .setEmoji('911971090954326017')
      .setCustomId('prev-snipe')
      .setStyle(ButtonStyle.Success);
    let delBut = new ButtonBuilder()
      .setEmoji('🗑')
      .setCustomId('del-snipe')
      .setStyle(ButtonStyle.Primary);
    let nextBut = new ButtonBuilder()
      .setEmoji('911971202048864267')
      .setCustomId('next-snipe')
      .setStyle(ButtonStyle.Success);
    let row = new ActionRowBuilder().addComponents([prevBut, delBut, nextBut]);

    const mainMessage = await message.reply({
      embeds: [snipeEmbed],
      components: [row]
    });
    const collector = mainMessage.createMessageComponentCollector({
      idle: 15_000
    });

    collector.on('collect', async (button) => {
      if (button.user.id !== message.author.id) {
        return button.reply({
          content: 'This is not your command.',
          ephemeral: true
        });
      }

      const id = button.customId;
      if (id == 'prev-snipe') {
        index--;
        if (index < 0) index = snipes.length - 1;

        target = snipes[index];
        let { msg, time, image } = target;

        snipeEmbed = new EmbedBuilder()
          .setAuthor({
            name: msg.author.tag,
            iconURL: msg.author.displayAvatarURL() || null
          })
          .setDescription(msg.content)
          .setColor('Random')
          .setFooter({ text: `${index + 1}/${snipes.length}` })
          .setImage(image)
          .setTimestamp(time);

        button.deferUpdate();
        return mainMessage.edit({
          embeds: [snipeEmbed],
          components: [row]
        });
      } else if (id == 'next-snipe') {
        index++;
        if (index == snipes.length) index = 0;

        target = snipes[index];
        let { msg, time, image } = target;

        snipeEmbed = new EmbedBuilder()
          .setAuthor({
            name: msg.author.tag,
            iconURL: msg.author.displayAvatarURL() || null
          })
          .setDescription(msg.content)
          .setColor('Random')
          .setFooter({ text: `${index + 1}/${snipes.length}` })
          .setImage(image)
          .setTimestamp(time);

        button.deferUpdate();
        return mainMessage.edit({
          embeds: [snipeEmbed],
          components: [row]
        });
      } else {
        await button.deferUpdate();
        await button.message.delete();
        return;
      }
    });

    collector.on('end', () => {
      if (mainMessage.editable) {
        prevBut.setDisabled();
        delBut.setDisabled();
        nextBut.setDisabled();

        mainMessage.edit({
          components: [row]
        });
      } else return;
    });
  }
};

const Messages = require('discord-messages');
const Heists = require('../../functions/heist-dono');
const Special = require('../../functions/another-dono-thing-whyy');
const {
  Message,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');
module.exports = {
  name: 'lb',
  aliases: ['lb', 'leaderboard'],
  fhOnly: true,
  description: 'Check leaderboard for donations',
  /**
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   * @returns
   */
  async execute(message, args, client) {
    let mainMessage = await message.channel.send('Loading...');
    const dLb = (
      await Messages.computeLeaderboard(
        client,
        await Messages.fetchLeaderboard(message.guild.id, 10),
        true
      )
    ).map(
      (e) =>
        `> ${e.position}. ${e.username}#${
          e.discriminator
        }\n> Donated coins: **${e.messages.toLocaleString()}**`
    );
    const hLb = (
      await Heists.computeLeaderboard(
        client,
        await Heists.fetchLeaderboard(message.guild.id, 10),
        true
      )
    ).map(
      (e) =>
        `> ${e.position}. ${e.username}#${
          e.discriminator
        }\n> Donated coins: **${e.amount.toLocaleString()}**`
    );
    const fLb = (
      await Special.computeLeaderboard(
        client,
        await Special.fetchLeaderboard(message.guild.id, 10),
        true
      )
    ).map(
      (e) =>
        `> ${e.position}. ${e.username}#${
          e.discriminator
        }\n> Donated coins: **${e.amount.toLocaleString()}**`
    );
    const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTimestamp()
      .setTitle('Main Donations');
    embed.setDescription(dLb.join('\n\n'));
    mainMessage = await mainMessage.edit({
      content: message.author.toString(),
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel('Main')
            .setCustomId('main-lb')
            .setStyle(ButtonStyle.Success)
            .setDisabled(),
          new ButtonBuilder()
            .setLabel('Heists')
            .setCustomId('heist-lb')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setLabel('Fighters Fiesta')
            .setCustomId('ff-lb')
            .setStyle(ButtonStyle.Success)
        ])
      ]
    });
    const collector = mainMessage.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id !== message.author.id) {
          return b.reply({
            content: 'Not for you',
            ephemeral: true
          });
        } else return true;
      },
      idle: 30_000
    });

    collector.on('collect', async (button) => {
      const what = button.customId.replace('-lb', '');

      if (what == 'main') {
        button.deferUpdate();
        ButtonBuilder.from(
          mainMessage.components[0].components.find((c) =>
            c.customId.includes('main')
          )
        ).setDisabled();
        ButtonBuilder.from(
          mainMessage.components[0].components.filter(
            (c) => !c.customId.includes(what)
          )
        ).forEach((b) => {
          b.setDisabled(false);
        });
        embed.setDescription(dLb.join('\n\n')).setTitle('Main Donations');
        mainMessage.edit({
          embeds: [embed],
          components: mainMessage.components
        });
      } else if (what == 'heist') {
        button.deferUpdate();
        ButtonBuilder.from(
          mainMessage.components[0].components.find((c) =>
            c.customId.includes('heist')
          )
        ).setDisabled();
        ButtonBuilder.from(
          mainMessage.components[0].components.filter(
            (c) => !c.customId.includes(what)
          )
        ).forEach((b) => {
          b.setDisabled(false);
        });
        embed.setDescription(hLb.join('\n\n')).setTitle('Heist Donations');
        mainMessage.edit({
          embeds: [embed],
          components: mainMessage.components
        });
      } else if (what == 'ff') {
        button.deferUpdate();
        mainMessage.components[0].components
          .find((c) => c.customId.includes('ff'))
          .setDisabled();
        mainMessage.components[0].components
          .filter((c) => !c.customId.includes(what))
          .forEach((b) => {
            b.setDisabled(false);
          });
        embed
          .setDescription(fLb.join('\n\n'))
          .setTitle('Fighters Fiesta Donations');
        mainMessage.edit({
          embeds: [embed],
          components: mainMessage.components
        });
      }
    });
  }
};

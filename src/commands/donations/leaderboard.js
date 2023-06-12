const {
  Message,
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');
const Main = require('../../database/main_dono');
const Grinder = require('../../database/grinder_dono');
const Karuta = require('../../database/tickets');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb'],
  cooldown: 60,
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const waitMessage = await message.reply('Fetching databases...');
    let MainRawLB = await Main.find({});
    MainRawLB = MainRawLB.sort((a, b) => b.messages - a.messages);
    let GrinderRawLB = await Grinder.find({});
    GrinderRawLB = GrinderRawLB.sort((a, b) => b.amount - a.amount);
    let KarutaRawLB = await Karuta.find({});
    KarutaRawLB = KarutaRawLB.sort((a, b) => b.amount - a.amount);

    await waitMessage.edit('Making fancy leaderboards...');
    const LBs = {
      main: [],
      grinder: [],
      karuta: []
    };

    for (const Profile of MainRawLB) {
      if (LBs.main.length > 9) break;
      const user =
        (await client.users.fetch(Profile.userID).catch(() => null)) ||
        'Unknown#00000';

      LBs.main.push(
        `${MainRawLB.indexOf(Profile) + 1}. **${user.tag}**: ⏣ ${
          Profile?.messages?.toLocaleString() || '0'
        }`
      );
    }
    for (const Profile of GrinderRawLB) {
      if (LBs.grinder.length > 9) break;
      const user =
        (await client.users.fetch(Profile.userID).catch(() => null)) ||
        'Unknown#00000';

      LBs.grinder.push(
        `${GrinderRawLB.indexOf(Profile) + 1}. **${user.tag}**: ⏣ ${
          Profile?.amount?.toLocaleString() || '0'
        }`
      );
    }
    for (const Profile of KarutaRawLB) {
      if (LBs.karuta.length > 9) break;
      const user =
        (await client.users.fetch(Profile.userId).catch(() => null)) ||
        'Unknown#00000';

      LBs.karuta.push(
        `${KarutaRawLB.indexOf(Profile) + 1}. **${user.tag}**: :tickets: ${
          Profile.amount.toLocaleString() || '0'
        }`
      );
    }
    const him = {
      main: MainRawLB.find((user) => user.userID == message.author.id) || null,
      grinder:
        GrinderRawLB.find((user) => user.userID == message.author.id) || null,
      karuta:
        KarutaRawLB.find((user) => user.userId == message.author.id) || null
    };
    waitMessage.delete();

    const MainEmbed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('Main Donations Leaderboard')
      .setTimestamp()
      .setDescription(
        LBs.main.join('\n') +
          `\n\n${
            him.main
              ? `**${MainRawLB.indexOf(him.main) + 1}. ${
                  message.author.tag
                }: ⏣ ${him?.main?.messages?.toLocaleString() || 'None'}**`
              : ''
          }`
      );
    const GrinderEmbed = new EmbedBuilder()
      .setColor(8666532)
      .setTitle('Grinder Donations Leaderboard')
      .setTimestamp()
      .setDescription(
        LBs.grinder.join('\n') +
          `\n\n${
            him.grinder
              ? `**${GrinderRawLB.indexOf(him.grinder) + 1}. ${
                  message.author.tag
                }: ⏣ ${him?.grinder?.amount?.toLocaleString() || 'None'}**`
              : ''
          }`
      );
    const KarutaEmbed = new EmbedBuilder()
      .setColor('LuminousVividPink')
      .setTitle('Karuta Donations Leaderboard')
      .setTimestamp()
      .setDescription(
        LBs.karuta.join('\n') +
          `\n\n${
            him.karuta
              ? `**${KarutaRawLB.indexOf(him.karuta) + 1}. ${
                  message.author.tag
                }: :tickets: ${
                  him?.karuta?.amount?.toLocaleString() || 'None'
                }**`
              : ''
          }`
      );
    const mainButton = new ButtonBuilder()
      .setLabel('Main')
      .setStyle(ButtonStyle.Success)
      .setDisabled()
      .setCustomId('main;lb');
    const grinderButton = new ButtonBuilder()
      .setLabel('Grinder')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('grinder;lb');
    const karutaButton = new ButtonBuilder()
      .setLabel('Karuta')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('karuta;lb');
    const row = new ActionRowBuilder().addComponents([
      mainButton,
      grinderButton,
      karutaButton
    ]);
    const mainMessage = await message.channel.send({
      embeds: [MainEmbed],
      components: [row]
    });
    const collector = mainMessage.createMessageComponentCollector({
      idle: 30_000
    });

    collector.on('collect', async (button) => {
      if (button.user.id != message.author.id) {
        return button.reply({
          content: 'Not your command.',
          ephemeral: true
        });
      }
      await button.deferUpdate();
      if (button.customId == 'main;lb') {
        mainButton.setDisabled(true).setStyle(ButtonStyle.Success);
        grinderButton.setDisabled(false).setStyle(ButtonStyle.Primary);
        karutaButton.setDisabled(false).setStyle(ButtonStyle.Primary);

        return mainMessage.edit({
          embeds: [MainEmbed],
          components: [row]
        });
      } else if (button.customId == 'grinder;lb') {
        mainButton.setDisabled(false).setStyle(ButtonStyle.Primary);
        grinderButton.setDisabled(true).setStyle(ButtonStyle.Success);
        karutaButton.setDisabled(false).setStyle(ButtonStyle.Primary);

        return mainMessage.edit({
          embeds: [GrinderEmbed],
          components: [row]
        });
      } else {
        mainButton.setDisabled(false).setStyle(ButtonStyle.Primary);
        grinderButton.setDisabled(false).setStyle(ButtonStyle.Primary);
        karutaButton.setDisabled(true).setStyle(ButtonStyle.Success);

        return mainMessage.edit({
          embeds: [KarutaEmbed],
          components: [row]
        });
      }
    });

    collector.on('end', () => {
      mainButton.setDisabled(true);
      grinderButton.setDisabled(true);
      karutaButton.setDisabled(true);

      return mainMessage.edit({
        components: mainMessage.components
      });
    });
  }
};

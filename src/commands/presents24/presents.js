const {
  Message,
  Client,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const Database = require('../../database/presents-dec-24');
module.exports = {
  name: 'presents',
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const user =
      message.mentions?.members?.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const db = await Database.findOne({
      userId: user.id
    });
    const presents = db?.amount || 0;

    const lb = await Database.aggregate([
      {
        $sort: {
          amount: -1
        }
      },
      {
        $limit: 10
      },
      {
        $project: {
          userId: 1,
          amount: 1
        }
      }
    ]);
    let description = '';
    lb.map((value, index) => {
      description += `${index + 1}. <@${
        value.userId
      }> - **${value.amount.toLocaleString()}**\n`;
    });

    const PresentsEmbed = new EmbedBuilder()
      .setAuthor({
        name: user.user.username,
        iconURL: user.user.displayAvatarURL({
          forceStatic: true
        })
      })
      .setDescription(
        `
      Presents: Presents24 **${db?.amount?.toLocaleString() || 0}**`
      )
      .setColor(Colors.Green);
    const LeaderboardEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setDescription(description)
      .setTitle('Presents24 Leaderboard')
      .setTimestamp();
    const Row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId('p24-p')
        .setLabel('Presents')
        .setDisabled(true)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('p24-l')
        .setLabel('Leaderboard')
        .setDisabled(false)
        .setStyle(ButtonStyle.Primary)
    ]);
    const msg = await message.reply({
      embeds: [PresentsEmbed, LeaderboardEmbed],
      components: [Row]
    });
  }
};

const medals = [':first_place:', ':second_place:', ':third_place:'];

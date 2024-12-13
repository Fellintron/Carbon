const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { getMilliseconds } = require('better-ms');

module.exports = {
  name: 'time',
  description: 'Get an interactive timestamp formatter.',
  category: 'Utility',
  usage: `<time>`,
  async execute(message, args, client) {
    if (!args[0])
      return message.reply(
        { embeds: createErrorEmbed('Please provide time.\n\n**Example:** `ic time 30 minutes`')
      });

   let time = getMilliseconds(args.join(' '));
    
    if (!time)
      return message.reply(
        `Couldn't parse \`${rawTime}\` as valid time. Please provide valid time.\n\n**Example:** \`ic time 30 minutes\``
      );

time = Date.now() + time

    const embed = new EmbedBuilder()
      .setTitle('Timestamp formatter')
      .setDescription(
        'Choose a format and click the button to get the text that you can copy.'
      )
      .setColor('Blurple')
      .setTimestamp();

    const components = [new ActionRowBuilder(), new ActionRowBuilder()];

    const array = [
      { label: 'Short time', value: timestamp(time, 't')},
      { label: 'Long time', value: timestamp(time, 'T')},
      { label: 'Short date', value: timestamp(time, 'd') },
      { label: 'Long date', value: timestamp( time, 'D') },
      { label: 'Short date time', value: timestamp(time,'f') },
      { label: 'Long date time', value : timestamp(time,'F')},
      { label: 'Relative time', value: timestamp(time,'R')}
    ];

    for (let i =0;i<array.length;i++) {
      const element = array[i]
      embed.addFields([
        {
          name: element.label,
          value: element.value,
          inline: true
        }
      ]);

      if (components[0].components.length < 5) {
        components[0].addComponents([
          new ButtonBuilder()
            .setLabel(element.label)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(i.toString())
        ]);
      } else {
        components[1].addComponents([
          new ButtonBuilder()
            .setLabel(elements.label)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(i.toString())
        ]);
      }
    }

    const response = await message.channel.send({
      embeds: [embed],
      components
    });
    
    const collector = response.createMessageComponentCollector({
      time: 30*60*1_000
    });

    collector.on('collect', async (interaction) => {
      await interaction.deferUpdate();
      
      const index = Number(interaction.customId)
      
      await interaction.followUp({ content: array[index] , ephemeral: true })
      });
    
    collector.on('end', () => {
    response.edit({ content : '*This interaction has expired, please use the command again.*', components: disableComponents(components)})
  })
}
}

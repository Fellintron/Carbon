const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Colors,
  codeBlock,
  inlineCode
} = require('discord.js');

module.exports = {
  name: 'calculator',
  aliases: ['calc'],
  category: 'Utility',
  description: 'A fancy 🧮 calculator within Discord.',
  async execute(message, args, client) {
    const array = [
      [
        ['7'],
        ['8'],
        ['9'],
        ['✖', ButtonStyle.Primary]
      ],
      [
        ['4'],
        ['5'],
        ['6'],
        ['➖', ButtonStyle.Primary]
      ],
      [
        ['1'],
        ['2'],
        ['3'],
        ['➕', ButtonStyle.Primary]
      ],
      [
        ['․', ButtonStyle.Primary],
        ['0'],
        ['➗', ButtonStyle.Primary],
        ['=',  ButtonStyle.Success]
      ]
    ];
    
    const components = [];

    for (let i=0; i<4;i++) {
      const row = new ActionRowBuilder()
      for (let j=0;j<4;j++) {
        row.addComponents([
          new ButtonBuilder()
            .setLabel(array[i][j][0])
            .setCustomId(array[i][j][0])
            .setStyle(array[i][j][1] || ButtonStyle.Secondary)
        ]);
      }
      components.push(row)
    }
    
    let description = [];
    
    const embed = new EmbedBuilder()
      .setTitle('🔢 Calculator')
      .setDescription(codeBlock(description.join('')))
      .setColor(Colors.Green)
      .setTimestamp()

    const response = await message.channel.send({
      embeds: [embed],
      components
    });
    
    const collector = response.createMessageComponentCollector({
      time: 30*60*1_000
    });
    
    const operationsArray = ['+', '-', '/', '*'];
    let calculated = false;
    
    collecter.on('collect', async (interaction) => {
      await interaction.deferUpdate();
      
      if (interaction.user.id !== message.author.id) {
       return interaction.followUp({ embeds: createWarnEmbed(`This interaction is not for you. Type ${inlineCode('ic calc')} to get your own calculator interface.`) , ephemeral : true})
      }
      
      if (calculated) {
        calculated = false;
        description = [];
      }
      
      const { customId } = interaction;
      
      if (customId === '=') {
        calculated = true;
        
        const result = eval(description.join(''));
        
        embed.setDescription(codeBlock(result.toLocaleString()));
        
        await interaction.editReply({
          embeds: [embed]
        });
      }
      
      const operation = operationsArray.includes(customId);
      
      operation
        ? operationsArray.includes(description [-1])
          ? (description[-1] = customId)
          : description.push(customId)
        : description.push(customId);
        
      embed.setDescription(codeBlock(description.join('')));
      
      await interaction.editReply({
        embeds: [embed]
      });
    });
    
    collector.on('end', () => {
      response.edit({ content: '*This interaction has expired, please use the command again.*', components: disableComponents(components)}).catch(() => null)
    })
  }
};

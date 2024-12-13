const {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  codeBlock
} = require('discord.js');

module.exports = {
  name: 'calculator',
  aliases: ['calc'],
  category: 'Utility',
  description: 'A fancy ✨ calculator within Discord.',
  async execute(message, args, client) {
    const arrays = [
      [
        ['7', ButtonStyle.Secondary],
        ['8', ButtonStyle.Secondary],
        ['9', ButtonStyle.Secondary],
        ['✖', ButtonStyle.Primary]
      ],
      [
        ['4', ButtonStyle.Secondary],
        ['5', ButtonStyle.Secondary],
        ['6', ButtonStyle.Secondary],
        ['➖', ButtonStyle.Primary]
      ],
      [
        ['1', ButtonStyle.Secondary],
        ['2', ButtonStyle.Secondary],
        ['3', ButtonStyle.Secondary],
        ['➕', ButtonStyle.Primary]
      ],
      [
        ['․', ButtonStyle.Primary],
        ['0', ButtonStyle.Secondary],
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
            .setLabel(array[i][j])
            .setCustomId(array[i][j])
            .setStyle(array[i][j])
        ]);
      }
      components.push(row)
    }
    
    let description = [];
    
    const embed = new EmbedBuilder()
      .setTitle('🔢 Calculator')
      .setDescription(codeBlock(description.join('')))
      .setColor('Green')
      .setTimestamp()

    const response = await message.channel.send({
      embeds: [embed],
      components
    });
    
    const collector = response.createMessageComponentCollector({
      time: 10*60*1_000
    });
    
    const operationsArray = ['+', '-', '/', '*'];
    let calculated = false;
    
    collecter.on('collect', async (interaction) => {
      await interaction.deferUpdate();
      
      if (interaction.user.id !== message.author.id) {
       return interaction.followUp({ content: `This interaction isn't for you.`, ephemeral : true})
      }
      
      if (calculated) {
        calculated = false;
        description = [];
      }
      
      const { customId } = interaction;
      
      if (interaction === '=') {
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
  }
};

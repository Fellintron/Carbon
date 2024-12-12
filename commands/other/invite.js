const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  description: 'Invite the bot.',
  category: 'Other',
  execute(message, args) {
    const button = new ButtonBuilder()
      .setLabel('Invite')
      .setStyle(ButtonStyle.Link)
      .setURL(
        'https://discord.com/oauth2/authorize?client_id=1291096313550737501&permissions=564584390323280&integration_type=0&scope=bot+applications.commands'
      );

    const row = new ActionRowBuilder().addComponents([button]);

    message.channel.send({
      content: 'You can invite me by using the button.',
      components: [row]
    });
  }
};

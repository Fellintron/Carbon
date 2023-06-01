const { Client, Message, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dm',
  fhOnly: false,
  category: 'Developer',
  disabledChannels: [],
  usage: '',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(message, args, client) {
    if (!client.config.cmds.dm.includes(message.author.id)) {
      return message.reply('You cannot use this.');
    }

    if (!args[0]) return message.reply('Please provide an ID.');
    const user = await client.users.fetch(args[0], { cache: true });

    if (!user) {
      return message.reply(
        `No user found with the ID \`${args[0]}\`.\n\nMake sure you provide a valid ID and __do not__ mention the user.`
      );
    }
    args.shift();

    let msg = args.join(' ');
    if (!msg)
      return message.reply(
        'Please give me what message you want to send them next time.'
      );
    let anonymous = false;
    if (msg.includes('-a')) {
      msg = msg.replace('-a', '');
      anonymous = true;
    }
    try {
      (await user.createDM()).send({
        content: 'You have received a message!',
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: anonymous ? 'Anonymous' : message.author.tag,
              iconURL: anonymous
                ? client.user.displayAvatarURL()
                : message.author.displayAvatarURL()
            })
            .setTitle('Message: ')
            .setDescription(msg.toString())
            .setTimestamp()
        ]
      });
      message.react('929620380434440212');
    } catch (e) {
      return message.reply({
        content: `Could not DM the user.\nError: ${
          e.message || 'hrish is dumb'
        }`
      });
    }
  }
};

// aaaaa restart

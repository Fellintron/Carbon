const { Client, Message, EmbedBuilder } = require('discord.js');
const Database = require('../../database/models/ar');
module.exports = {
  name: 'autoresponse',
  aliases: ['ar'],
  subcommands: ['+', 'add', '-', 'remove', 'list'],
  category: 'Moderation',
  fhOnly: true,
  /**
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (!message.member.permissions.has('BanMembers')) return;

    if (!args[0] || !this.subcommands.includes(args[0]))
      return message.reply('Not a valid sub-command');

    if (args[0] == '+' || args[0] == 'add') {
      args.shift();
      if (!args[0]) {
        return message.reply({
          embeds: [
            {
              description: `\`\`\`xml\n<Usage: fh ar add <auto trigger (Not found.)> <response>>\n\`\`\``
            }
          ]
        });
      }
      let trigger = args[0].toLowerCase();
      const aargs = args;
      if (trigger.startsWith('"')) {
        const amogus = args;
        amogus.join(' ').replace('"', '').split('"');
        trigger = amogus[0].toLowerCase();
        args = aargs;
      }
      args.shift();

      if (!args[0])
        return message.reply({
          embeds: [
            {
              description: `\`\`\`xml\n<Usage: fh ar add <auto trigger> <response (Not found.)>>\n\`\`\``
            }
          ]
        });

      const response = args.join(' ');

      if (await Database.findOne({ trigger }))
        return message.reply({
          embeds: [
            {
              description: `A trigger already exists with that name! Delete it first to create a new one with same name.`
            }
          ]
        });

      const entry = new Database({
        trigger,
        response,
        uses: 0,
        addedBy: message.author.id
      });
      entry.save();
      client.db.ars.push({
        trigger,
        response,
        uses: 0,
        addedBy: message.author.id
      });
      return message.reply(`Added a trigger with name "${trigger}".`);
    } else if (args[0] == '-' || args[0] == 'remove') {
      args.shift();

      if (!args[0])
        return message.reply({
          content: 'Please give the trigger name!'
        });

      const trigger = args[0].toLowerCase();
      if (!(await Database.findOne({ trigger })))
        return message.reply("That trigger doesn't seem to exist...");

      await Database.findOneAndDelete({
        trigger
      });
      client.db.ars = client.db.ars.filter((a) => a.trigger !== trigger);
      return message.reply('Removed that ar.');
    } else if (args[0] == 'list') {
      let data = await Database.find({});
      data = data
        .map(
          (value, index) =>
            `${index + 1}.  **Trigger:** ${
              value.trigger
            }\n<:blank:914473340129906708>**Response:** ${
              value.response
            }\n<:blank:914473340129906708>**Added by:** <@${value.addedBy}>`
        )
        .join('\n---------\n');

      await message.reply({
        embeds: [
          {
            title: 'Auto-Responses list',
            description: data || 'None!',
            timestamp: new Date()
          }
        ]
      });
    }
  }
};

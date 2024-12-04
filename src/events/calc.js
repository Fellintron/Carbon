const { Message, Client, Colors } = require('discord.js');
const math = require('mathjs');
module.exports = {
  name: 'messageCreate',
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const regex = /^\d+(\s*[+\-*/]\s*\d+)*$/;
    if (!regex.test(message.content)) return;
    await message.react('➕');
    await message
      .awaitReactions({
        max: 1,
        time: 10000,
        errors: ['time'],
        filter: (_, a) => !a.bot
      })
      .then((collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === '➕') {
          const result = math.evaluate(message.content);
          message.reply({
            embeds: [
              {
                title: 'Result',
                description: `Answer: ${result.toLocaleString()}`,
                footer: {
                  text: result.toString()
                },
                color: Colors.Blurple
              }
            ]
          });
        }
      });
  }
};

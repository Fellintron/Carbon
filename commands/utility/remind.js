const { Client, Message, EmbedBuilder } = require('discord.js');
const Database = require('../../database/models/remind');
const { getMilliseconds } = require('better-ms');

module.exports = {
  name: 'remind',
  aliases: ['rm', 'remindme'],
  category: 'Utility',
  usage: '<reason> in <time>',
  async execute(message, args, client) {
    const example = '\n\n`ic rm work in 1h`';
    
    if (!args[0]) return message.reply('Provide valid arguments.' + example);
    
    if (args[0] == 'list') {
      const embed = new EmbedBuilder()
        .setTitle('Reminders')
        .setColor('Green')
        .setDescription('Your reminders are as follows:')
        .setTimestamp();
        
      client.reminders
        .filter((user) => user.userId === message.author.id)
        .forEach((reminder) => {
         embed.addFields([
            {
              name: `Reminder about ${reminder.reason}`,
              value: `ID: ${reminder.id}\nReminds ${timestamp(
                reminder.timestamp,
                'R'
              )}`,
              inline: true
            }
          ]);
        });

      return message.reply({
        embeds: [eembed]
      });
    }
    
    let reason = args.join(' ').split(' in ');
    
    if (!reason.length)
      return message.reply('Please give valid time.' + example);

    let reason = valid.slice(0, -1).join(' ') || undefined;
    
    let time = reason.pop();
    if (!getMilliseconds(time))
      return message.reply(
        `Please provide valid time. I could not parse \`${time}\`${example}`
      );

    if (time > 157788000000) {
      return message.reply(
        `No, I will probably forget things that are to be reminded 5 years later.`
      );
    }
    time = new Date().getTime() + getMilliseconds(time);
    const id = (Math.random() + 1).toString(36).substring(7);
    const dbEntry = new Database({
      id,
      userId: message.author.id,
      time,
      reason,
      link: message.url
    });
    
    dbEntry.save();
    client.db.reminders.push({
      id,
      userId: message.author.id,
      time,
      reason,
      link: message.url
    });
    
    return message.reply(
      `${message.author.toString()} noted. I will remind you about **${reason} ${client.functions.timestamp(
        time,
        'R'
      )}**.\nType \`ic rm list\` to check your reminders!`
    );
  }
};

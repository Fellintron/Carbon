const { Message, Events, Colors } = require('discord.js');

module.export = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   */
  async execute(message, client) {
    if (message.guild.id !== '824294231447044197') return;
    if (message.author.bot) return;
    const role = '1301486755513372672';
    console.log('\n');
    if (
      message.content.toLowerCase() === 'pls tot' ||
      message.content.toLowerCase() === 'pls trickortreat'
    ) {
      console.log('TOT!');
      if (message.member.roles.cache.has(role)) {
        await message.reply({
          embeds: [
            {
              title: 'Happy Halloween 🎃',
              description: `You already have the role <@&${role}> but thank you!!`,
              footer: {
                text: "You're helping us get #1 on the leaderboard!"
              },
              color: Colors.Orange,
              thumbnail: {
                url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5b434546-d2d2-4907-92ff-af5ac256c1fe/dgegqhi-75e26fc9-4882-41b4-9b91-168854da77b8.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzViNDM0NTQ2LWQyZDItNDkwNy05MmZmLWFmNWFjMjU2YzFmZVwvZGdlZ3FoaS03NWUyNmZjOS00ODgyLTQxYjQtOWI5MS0xNjg4NTRkYTc3YjguZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BSwc_LUbcGhrfJcYjRT4aQov9VAFN9aKiQQK2K8HDrg'
              }
            }
          ]
        });
      } else {
        await message.member.roles.add(role);
        await message.reply({
          embeds: [
            {
              title: 'Happy Halloween 🎃',
              description: `You have been given the role <@&${role}>`,
              footer: {
                text: "You're helping us get #1 on the leaderboard!"
              },
              color: Colors.Orange,
              thumbnail: {
                url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5b434546-d2d2-4907-92ff-af5ac256c1fe/dgegqhi-75e26fc9-4882-41b4-9b91-168854da77b8.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzViNDM0NTQ2LWQyZDItNDkwNy05MmZmLWFmNWFjMjU2YzFmZVwvZGdlZ3FoaS03NWUyNmZjOS00ODgyLTQxYjQtOWI5MS0xNjg4NTRkYTc3YjguZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BSwc_LUbcGhrfJcYjRT4aQov9VAFN9aKiQQK2K8HDrg'
              }
            }
          ]
        });
      }
    }
  }
};

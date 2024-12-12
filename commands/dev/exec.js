const { exec } = require('shelljs');

module.exports = {
  name: 'exec',
  aliases: ['execute'],
  usage: '<string>',
  category: 'Developer',
  description: 'Run code in shell.',
  async execute(message, args, client) {
    if (!client.config.developers.includes(message.author.id))
      return;

    const query = args.join(' ');
    const results = await exec(query);

    return message.reply(`Output:\n\`\`\`js\n${results.stdout}\n\`\`\``);
  }
};

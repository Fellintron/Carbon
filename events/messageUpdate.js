module.exports = {
  name: 'messageUpdate',
  once: false,
  async execute(oldMessage, newMessage, client) {
    if (!oldMessage.guild || oldMessage.author.bot || oldMessage.webhookId)
      return;

    let editSnipedMessages =
      client.editSnipedMessages.get(oldMessage.channel.id) ?? [];

    editSnipedMessages.unshift({
      oldContent: oldMessage.content,
      createdTimestamp: oldMessage.createdTimestamp,
      editedTimestamp: newMessage.editedTimestamp,
      newContent: newMessage.content,
      oldAttachment: oldMessage.attachments.first() ?? null,
      newAttachment: newMessage.attachments.first() ?? null,
      author: newMessage.member
    });

    client.editSnipedMessages.set(oldMessage.channel.id, editSnipedMessages);
  }
};

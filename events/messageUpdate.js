module.exports = {
  name: 'messageUpdate',
  once: false,
  async execute(oldMessage, newMessage, client) {
    
    let editSnipedMessages = client.editSnipedMessages.get(oldMessage.channel.id) ?? [];

    editSnipedMessages.unshift({
      oldContent: oldMessage.content,
      newContent: newMessage.content,
      oldAttachmentURL: oldMessage.attachments.first()?.proxyURL ?? null,
      newAttachmentURL: newMessage.attachments.first()?.proxyURL ?? null,
      editedIn: newMessage.createdAt - oldMessage.editedAt,
      author: newMessage.member,
    });

    client.editSnipedMessages.set(oldMessage.channel.id, editSnipedMessages);
  }
};

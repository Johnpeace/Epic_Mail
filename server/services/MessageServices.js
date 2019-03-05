import {
  messages, drafts, users, inboxs, sents,
} from '../dummyData/Database';
import Message from '../model/message';
import Inbox from '../model/inbox';
import Sent from '../model/sent';
import Draft from '../model/draft';

export default class messageServices {
  static createMessage({ subject, message, status }) {
    const msg = new Message();
    msg.id = messages[messages.length - 1].id + 1;
    msg.subject = subject;
    msg.message = message;
    msg.status = status;

    messages.push(msg);

    return msg;
  }

  static saveDraft(data) {
    const { userId, contactEmail } = data;

    const receiverId = this.getMessageReceiver(contactEmail);
    const message = this.createMessage(data);

    const draft = new Draft();
    draft.id = drafts[drafts.length - 1].id + 1;
    draft.senderId = userId;
    draft.receiverId = receiverId;
    draft.messageId = message.id;

    drafts.push(draft);

    return {
      status: 200,
      message: 'draft saved successfully',
      data: [message],
    };
  }

  static getMessageReceiver(email) {
    const user = users.find(data => data.email === email);
    if (user) {
      return user.id;
    }
    return null;
  }

  static sendMessage(data) {
    const { userId, contactEmail } = data;

    const receiverId = this.getMessageReceiver(contactEmail);
    const message = this.createMessage(data);

    const inbox = new Inbox();
    inbox.id = drafts[drafts.length - 1].id + 1;
    inbox.receiverId = receiverId;
    inbox.messageId = message.id;

    inboxs.push(inbox);

    const sent = new Sent();
    sent.id = sents[sents.length - 1].id + 1;
    sent.messageId = message.id;
    sent.senderId = userId;

    sents.push(sent);

    return {
      status: 200,
      message: 'message sent successfully',
      data: [message],
    };
  }
}
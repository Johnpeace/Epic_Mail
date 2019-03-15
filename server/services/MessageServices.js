import {
  messages, inboxs, sents,
} from '../dummyData/Database';
import { Sent } from '../model/sent';
import { Inbox } from '../model/inbox';
import { Email } from '../model/email';
import { Draft } from '../model/draft';

export default class messageServices {
  static async saveDraft(data) {
    const { userId, contactEmail } = data;

    const res = await Email.getMessageReceiverId(contactEmail);
    let receiverId = null;

    if (res.success) {
      receiverId = res.id;
    }

    let msg = await Email.createMessage(data);
    if (!msg.success) {
      return {
        status: 401,
        error: msg.error,
      };
    }
    msg = msg.data;
    const messageId = msg.id;

    const inserts = { userId, messageId, receiverId };

    const fromDraft = await Draft.insertIntoDraftTable(inserts);

    if (!fromDraft.success) {
      return {
        status: 401,
        error: fromDraft.error,
      };
    }

    const info = {
      id: messageId,
      createdOn: msg.createdat,
      subject: msg.subject,
      message: msg.message,
      parentMessageId: msg.parentMessageId,
      status: msg.status,
    };

    return {
      status: 201,
      message: 'draft saved successfully',
      data: [info],
    };
  }

  static async sendMessage(data) {
    const { userId, contactEmail } = data;

    const res = await Email.getMessageReceiverId(contactEmail);
    if (!res.success) {
      return {
        status: 401,
        error: res.error,
      };
    }
    const receiverId = res.id;

    let msg = await Email.createMessage(data);
    if (!msg.success) {
      return {
        status: 401,
        error: msg.error,
      };
    }
    msg = msg.data;
    const messageId = msg.id;

    const inserts = { userId, messageId, receiverId };

    const result = await Inbox.insertIntoInboxTable(inserts);

    if (!result.success) {
      return {
        status: 4012,
        error: result.error,
      };
    }

    const fromSent = await Sent.insertIntoSentTable(inserts);
    if (!fromSent.success) {
      return {
        status: 401,
        error: fromSent.error,
      };
    }

    const info = {
      id: messageId,
      createdOn: msg.createdat,
      subject: msg.subject,
      message: msg.message,
      parentMessageId: msg.parentMessageId,
      status: msg.status,
    };

    return {
      status: 201,
      message: 'message sent successfully',
      data: [info],
    };
  }

  static filteredMessage(msgs) {
    const response = [];

    msgs.forEach((inbox) => {
      const mail = messages.find(data => data.id === inbox.messageId);
      const { subject, message, parentMessageId } = mail;
      const {
        id, createdOn, read, status, senderId, receiverId,
      } = inbox;

      response.push({
        id, createdOn, subject, message, senderId, receiverId, parentMessageId, status, read,
      });
    });

    return response;
  }

  static getUsersMessages(userId) {
    const msgs = inboxs.filter(data => data.receiverId === userId);
    const response = this.filteredMessage(msgs);
    return response;
  }

  static getSentEmails(userId) {
    const msgs = sents.filter(data => data.senderId === userId);
    const response = this.filteredMessage(msgs);
    return {
      status: 200,
      data: response,
    };
  }

  static getUnReadEmails(userId) {
    const response = this.getUsersMessages(userId);
    const res = response.filter(data => data.read === false);

    return {
      status: 200,
      data: res,
    };
  }

  static deleteAnInboxMessage({ userId, id }) {
    let response = 'unsuccessful';
    const inboxId = inboxs.findIndex(data => (data.senderId === parseInt(userId, 10)
      && data.messageId === parseInt(id, 10)));

    if (inboxId !== -1) {
      inboxs.splice(inboxId, 1);
      response = 'deleted successfully';
    } else {
      response = 'not found';
    }
    return {
      status: 202,
      data: [{ message: response }],
    };
  }

  static viewAnInboxMessage({ userId, id }) {
    const inbox = inboxs.find(data => (data.receiverId === parseInt(userId, 10)
      && data.id === parseInt(id, 10)));

    let response = [];

    if (inbox) {
      const msg = messages.find(data => data.id === parseInt(inbox.messageId, 10));

      const { subject, message, parentMessageId } = msg;
      const {
        createdOn, read, status, senderId, receiverId,
      } = inbox;

      response.push({
        id: inbox.id,
        createdOn,
        read,
        status,
        senderId,
        receiverId,
        subject,
        message,
        parentMessageId,
      });
    } else {
      response = [{ message: 'not found' }];
    }

    return {
      status: 200,
      data: response,
    };
  }

  static getRecievedEmails(userId) {
    const response = this.getUsersMessages(userId);

    return {
      status: 200,
      data: response,
    };
  }
}

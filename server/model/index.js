import { User } from './user';
import { Email } from './email';
import { Contact } from './contact';
import { Inbox } from './inbox';
import { Sent } from './sent';
import { Draft } from './draft';
import { Group } from './group';
import { GroupMember } from './groupMemebers';

/* istanbul ignore next */
const createAllTables = async () => {
/* istanbul ignore next */
  await User.createUserTable();
  /* istanbul ignore next */
  await Email.createEmailTable();
  /* istanbul ignore next */
  await Contact.createContactsTable();
  /* istanbul ignore next */
  await Inbox.createInboxTable();
  /* istanbul ignore next */
  await Sent.createSentTable();
  /* istanbul ignore next */
  await Draft.createDraftTable();
  /* istanbul ignore next */
  await Group.createGroupTable();
  /* istanbul ignore next */
  await GroupMember.createMemberTable();
};

/* istanbul ignore next */
const dropAllTables = async () => {
/* istanbul ignore next */
  await User.dropUserTable();
  /* istanbul ignore next */
  await Email.dropEmailTable();
  /* istanbul ignore next */
  await Contact.dropContactTable();
  /* istanbul ignore next */
  await Inbox.dropInboxTable();
  /* istanbul ignore next */
  await Sent.dropSentTable();
  /* istanbul ignore next */
  await Draft.dropDraftTable();
  /* istanbul ignore next */
  await Group.dropGroupTable();
  /* istanbul ignore next */
  await GroupMember.dropMemberTable();
};

export {
  createAllTables, dropAllTables,
};

export interface Folder {
  id: string;
  name: string;
  description: string;
}

export interface Message {
  id: string;
  folderId: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
}

export const FOLDERS: Folder[] = [
  {
    id: "inbox",
    name: "Inbox",
    description: "Mail addressed directly to you.",
  },
  {
    id: "archive",
    name: "Archive",
    description: "Older mail you keep around.",
  },
  {
    id: "spam",
    name: "Spam",
    description: "Filtered automatically. Probably ignore.",
  },
];

export const MESSAGES: Message[] = [
  {
    id: "m1",
    folderId: "inbox",
    from: "Avery",
    subject: "Friday demo agenda",
    preview: "Quick note on what we want to cover…",
    body: "Quick note on what we want to cover Friday. I'll spin up the staging build right before the call and share my screen — let me know if you'd rather drive.",
  },
  {
    id: "m2",
    folderId: "inbox",
    from: "Build robot",
    subject: "main: build succeeded",
    preview: "Bundle: 142 kB (-3 kB). Tests: 318 passed.",
    body: "Bundle: 142 kB (-3 kB). Tests: 318 passed. Deploy is queued for the next maintenance window.",
  },
  {
    id: "m3",
    folderId: "archive",
    from: "Jordan",
    subject: "Q3 retrospective notes",
    preview: "Three things to keep, two to drop, one to try…",
    body: "Three things to keep, two to drop, one to try. The full doc is linked in the channel; I pulled the highlights into the deck.",
  },
  {
    id: "m4",
    folderId: "archive",
    from: "Conference org",
    subject: "Speaker confirmation — March",
    preview: "We've got you down for the routing talk on the second day.",
    body: "We've got you down for the routing talk on the second day. Tech check the night before; AV team will reach out separately.",
  },
  {
    id: "m5",
    folderId: "spam",
    from: "Crypto opportunity",
    subject: "URGENT: claim your reward",
    preview: "Limited time offer just for you…",
    body: "Limited time offer just for you. Definitely real. Forward this to twelve friends and your fortune triples overnight.",
  },
];

export function getFolder(id: string): Folder | null {
  return FOLDERS.find((f) => f.id === id) ?? null;
}

export function getMessagesInFolder(folderId: string): Message[] {
  return MESSAGES.filter((m) => m.folderId === folderId);
}

export function getMessage(
  folderId: string,
  messageId: string,
): Message | null {
  return (
    MESSAGES.find((m) => m.folderId === folderId && m.id === messageId) ?? null
  );
}

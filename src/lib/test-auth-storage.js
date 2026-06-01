const SESSION_KEY = "k12-study-buddy-session";
const USERS_KEY = "k12-study-buddy-users";

function readJson(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function buildUserId(name, accessCode) {
  return `${slugify(name)}::${slugify(accessCode)}`;
}

export function getStoredSession() {
  return readJson(SESSION_KEY, null);
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function saveSession({ name, accessCode }) {
  const trimmedName = name.trim();
  const trimmedAccessCode = accessCode.trim();
  const userId = buildUserId(trimmedName, trimmedAccessCode);
  const users = readJson(USERS_KEY, {});
  const existingUser = users[userId];

  const session = {
    userId,
    name: trimmedName,
    accessCode: trimmedAccessCode
  };

  users[userId] = {
    userId,
    name: trimmedName,
    accessCode: trimmedAccessCode,
    chats: existingUser?.chats || [],
    createdAt: existingUser?.createdAt || new Date().toISOString()
  };

  writeJson(USERS_KEY, users);
  writeJson(SESSION_KEY, session);

  return session;
}

export function getUserState(userId) {
  const users = readJson(USERS_KEY, {});

  return (
    users[userId] || {
      userId,
      name: "",
      accessCode: "",
      chats: []
    }
  );
}

export function saveUserChats(userId, updater) {
  const users = readJson(USERS_KEY, {});
  const user = users[userId];

  if (!user) {
    return null;
  }

  const nextChats = updater(user.chats || []);
  users[userId] = {
    ...user,
    chats: nextChats
  };
  writeJson(USERS_KEY, users);

  return users[userId];
}

export function createChatRecord() {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function buildChatTitle(firstMessage) {
  const trimmed = firstMessage.trim();
  return trimmed.length > 36 ? `${trimmed.slice(0, 36)}...` : trimmed;
}

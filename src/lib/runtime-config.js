function readWindowConfig() {
  if (typeof window === "undefined") {
    return {};
  }

  return window.__APP_CONFIG__ || {};
}

export function getRuntimeConfig() {
  const config = readWindowConfig();

  return {
    chatApiUrl: config.chatApiUrl || "",
    appName: config.appName || "K12 Study Buddy",
    limits: {
      maxChatsPerUser: config.maxChatsPerUser ?? 3,
      maxMessagesPerChat: config.maxMessagesPerChat ?? 8,
      maxTotalMessagesPerUser: config.maxTotalMessagesPerUser ?? 20
    }
  };
}

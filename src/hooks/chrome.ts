export const defaultSettings = {
  website: {
    hostname: "*",
    on: false,
    mode: "global" as "global" | "website",
    overlay: {
      opacity: 0.5,
      color: "#18181a",
    },
  },
  global: {
    overlay: {
      opacity: 0.5,
      color: "#18181a",
    },
  },
};

export default function useChrome() {
  const getSettings = async () => {
    try {
      return await chrome.runtime.sendMessage({ type: "getSettings" });
    } catch (_e) {
      return structuredClone(defaultSettings);
    }
  };

  const saveSettings = async (settings: typeof defaultSettings) => {
    try {
      await chrome.runtime.sendMessage({ type: "saveSettings", payload: settings });
    } catch (_e) {}
  };

  const resetSettings = async (type: string) => {
    try {
      await chrome.runtime.sendMessage({ type: "resetSettings", payload: type });
    } catch (_e) {}
  };

  return { getSettings, saveSettings, resetSettings };
}

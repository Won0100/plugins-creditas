import { LocalStorageItemType } from "./LocalStorageItemType";
import { teamsDocument } from "services/sync/teams";
import { departmentDocument } from "services/sync/department";

export const localStorage = {
  set: (key: LocalStorageItemType, payloadString: string) => {
    window.localStorage.setItem(key, payloadString);
  },
  get: (key: LocalStorageItemType) => {
    return window.localStorage.getItem(key);
  },
  removeAll: () => {
    window.localStorage.removeItem(LocalStorageItemType.ATHAN_USER_CRM_DATA);
    window.localStorage.removeItem(LocalStorageItemType.ATHAN_AUTH_CRM_DATA);
    window.localStorage.removeItem(LocalStorageItemType.ATHAN_DIALER_LOCATION);
    window.localStorage.removeItem(LocalStorageItemType.ATHAN_USER_CRM_TOKEN);
  },
  setDocument: async (key: LocalStorageItemType) => {
    switch (key) {
      case LocalStorageItemType.TEAMS: {
        const document = await teamsDocument.get();
        if (document)
          localStorage.set(LocalStorageItemType.TEAMS, JSON.stringify(document.data.teams));
        break;
      }
      case LocalStorageItemType.AREAS: {
        const document = await departmentDocument.get();
        if (document)
          localStorage.set(LocalStorageItemType.AREAS, JSON.stringify(document.departments));
        break;
      }
    }
  },
};

// Helper functions for CopilotIA storage
export const copilotStorage = {
  getConversations: () => {
    const stored = localStorage.get(LocalStorageItemType.COPILOT_CONVERSATIONS);
    return stored ? JSON.parse(stored) : {};
  },

  setConversations: (conversations: any) => {
    localStorage.set(LocalStorageItemType.COPILOT_CONVERSATIONS, JSON.stringify(conversations));
  },

  getMapping: () => {
    const stored = localStorage.get(LocalStorageItemType.COPILOT_CONVERSATION_MAPPING);
    return stored ? JSON.parse(stored) : {};
  },

  setMapping: (mapping: any) => {
    localStorage.set(LocalStorageItemType.COPILOT_CONVERSATION_MAPPING, JSON.stringify(mapping));
  }
};

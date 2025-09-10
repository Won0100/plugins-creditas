import axios from "axios";
import api from "./api";

export const oldContacts = {
  getConversationsByAddress: async (address: string) => {
    const params = {
      method: "GET",
      params: {
        address,
      },
    };

    const { data: conversationsByAddress } = await api(
      "/contact-history/search-conversations-by-address",
      params
    );

    return conversationsByAddress;
  },
  getMediaBySid: async (
    workerToken: string,
    chatServiceSid: string,
    mediaSid: string
  ) => {
    try {
      const { data: mediaInstance } = await axios.get(
        `https://mcs.us1.twilio.com/v1/Services/${chatServiceSid}/Media/${mediaSid}`,
        {
          headers: {
            "X-Twilio-Token": workerToken,
          },
        }
      );

      return mediaInstance.links.content_direct_temporary;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  },
  getMessagesByConversationSid: async (conversationSid: string) => {
    const params = {
      method: "GET",
      params: {
        conversationSid,
      },
    };

    const { data: messages } = await api(
      "/contact-history/get-messages-from-conversation",
      params
    );

    return messages;
  },
};

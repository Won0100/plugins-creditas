import axios from "axios";
import { userInstance } from "./manager/user";

export const flexAgent = {
  update: async (workerSid: string, attributes: string) => {
    try {
      const tokenAuthorization: string = `${
        userInstance.getAccount().accountSid
      }:${userInstance.getAccount().authToken}`;
      const buffer = Buffer.from(tokenAuthorization);

      const tokenFormatted = buffer.toString("base64");

      await fetch(
        `https://taskrouter.twilio.com/v1/Workspaces/${
          userInstance.getAccount().workspaceSid
        }/Workers/${workerSid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${tokenFormatted}==`,
          },
          body: new URLSearchParams({
            Attributes: attributes,
          }),
        }
      ).then((response) => response.json());

      return {
        success: true,
        message: `Atributos do agente ${workerSid} atualizados com sucesso`,
      };
    } catch (err) {
      return {
        success: false,
        message: `Falha para atualizar os atributos do agente ${workerSid}`,
      };
    }
  },
};

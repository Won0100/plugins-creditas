import * as Flex from "@twilio/flex-ui";
import { userInstance } from "./manager/user";
import { RecordGlobal } from "types/record";

const CUSTOMER = "creditas-minuto";
const METRIC = "USER_SESSION_STATE";
const workerClient = userInstance.getWorkerClient();

export const sendLogs = async (message: string, data?: RecordGlobal) => {
  const manager = userInstance.getInstance();

  const environment = manager.serviceConfiguration.attributes?.environment;

  const DDTAGS = `env:${environment},athanCustomer:${CUSTOMER},metric:${METRIC}`;

  // await fetch(
  //   `${process.env.FLEX_APP_API_BASE_URL}/integrations/datadog_logs`,
  //   {
  //     method: "POST",
  //     mode: "no-cors",
  //     body: new URLSearchParams({
  //       ddtags: DDTAGS,
  //       message,
  //       level: "log",
  //       data: JSON.stringify({
  //         agentEmail: workerClient?.attributes.email,
  //         agentName: workerClient?.attributes.full_name,
  //         hostedPage: window.location.ancestorOrigins[0]
  //           ? window.location.ancestorOrigins[0]
  //           : window.location.href,
  //         ...(data && { ...data }),
  //       }),
  //     }),
  //   }
  // );
};

export const handleLogs = async () => {
  localStorage.openpages = Date.now();
  window.addEventListener(
    "storage",
    function (e) {
      if (e.key == "openpages") {
        localStorage.page_available = Date.now();
      }
      if (e.key == "page_available") {
        sendLogs(
          `Usuário ${workerClient?.attributes.email} acessou mais de uma aba do Twilio Flex simultaneamente`
        );
      }
    },
    false
  );

  window.addEventListener("offline", () => {
    sendLogs(
      `Usuário ${workerClient?.attributes.email} perdeu a conexão com o Twilio Flex - ${workerClient?.activity.name}`
    );
  });

  window.addEventListener("beforeunload", () => {
    sendLogs(
      `Usuário ${workerClient?.attributes.email} fechou ou recarregou o Twilio Flex sem realizar o logout com a atividade - ${workerClient?.activity.name}`
    );
  });

  Flex.Actions.addListener("beforeLogout", async () => {
    await sendLogs(
      `Usuário ${workerClient?.attributes.email} fez logout no Twilio Flex com a atividade - ${workerClient?.activity.name}`
    );
  });
};

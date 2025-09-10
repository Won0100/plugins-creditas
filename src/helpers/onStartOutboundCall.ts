import { Manager } from "@twilio/flex-ui";

interface OutboundCallersConfig {
  value: string;
  label: string;
  isSipPhone?: boolean;
  sipConfiguration?: string;
}

export const onStartOutboundCall = async (payload: any) => {
  const manager = Manager.getInstance();
  const callersConfig: OutboundCallersConfig[] =
    manager.serviceConfiguration.attributes.outbound_callers_id;

  const callerElement = document.querySelector(
    "#caller-id-select-outbound-call input"
  ) as HTMLSelectElement;

  const queueElement = document.querySelector(
    "#queue-select-outbound-call input"
  ) as HTMLSelectElement;

  let callerIdElement: string = callerElement
    ? callerElement.value
    : callersConfig[0]?.value;

  let callerIdConfig = callersConfig.find(
    (elm) => elm.value === callerIdElement
  );

  if (callerIdConfig?.isSipPhone) {
    const cleanDestination = payload.destination.replace(/([^\w])|([a-z])/gi, "");

    if (payload.workerDialerConfig) {
      const { callerId, techPrefix, ipAddress } = payload.workerDialerConfig;

      payload.callerId = callerId;
      payload.destination = `sip:${techPrefix}${cleanDestination}@${ipAddress};region=br1`;

    } else {
      payload.callerId = callerIdElement;

      if (callerIdConfig.sipConfiguration) {
        payload.destination = callerIdConfig.sipConfiguration.replace("XXXX", cleanDestination);
      } else {
        console.warn("Configuração SIP não encontrada para o caller ID:", callerIdElement);
      }
    }
  }

  return {
    ...payload,
    queueSid: queueElement.value,
  };
};

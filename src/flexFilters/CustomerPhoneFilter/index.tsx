import { FilterDefinition } from "@twilio/flex-ui";
import { PhoneNumberLabel } from "./label";
import { PhoneNumberInput } from "./input";

export const phoneNumberFilter: FilterDefinition = {
  id: "data.worker_sid",
  fieldName: "customer-phone",
  title: "Número (cliente)",
  customStructure: {
    field: <PhoneNumberInput />,
    label: <PhoneNumberLabel />,
  },
  condition: "EQ",
};

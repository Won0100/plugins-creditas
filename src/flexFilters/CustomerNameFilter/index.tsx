import { FilterDefinition } from "@twilio/flex-ui";
import { CustomerNameLabel } from "./label";
import { CustomerNameInput } from "./input";

export const customerNameFilter: FilterDefinition = {
  id: "data.friendly_name",
  fieldName: "customer-name",
  title: "Nome (cliente)",
  customStructure: {
    field: <CustomerNameInput />,
    label: <CustomerNameLabel />,
  },
  condition: "EQ",
};

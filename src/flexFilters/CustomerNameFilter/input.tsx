import { CustomInput } from "components/Custom/CustomInput";
import { ChangeEvent, useEffect, useState } from "react";
import {
  GetWorkerByTaskAttributesFilterType,
  ServerlessApiInstance,
} from "services/serverless";

type CustomerNameInputProps = {
  handleChange?: (value: string) => void;
};

export const CustomerNameInput = ({ handleChange }: CustomerNameInputProps) => {
  const serverlessApiInstance = new ServerlessApiInstance();

  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (!customerName) {
      handleChange!("");
      return;
    }

    const handler = setTimeout(async () => {
      if (customerName) {
        const result = await serverlessApiInstance.getWorkerByTaskAttributes({
          filterType: GetWorkerByTaskAttributesFilterType.CUSTOMER_NAME,
          filterValue: customerName,
        });

        handleChange!(result?.friendlyName || "not found");
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [customerName, handleChange]);

  const onHandleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomerName(event.target.value);
  };

  return (
    <CustomInput
      type="text"
      placeholder="Nome (cliente)"
      value={customerName}
      onChange={onHandleChange}
    />
  );
};

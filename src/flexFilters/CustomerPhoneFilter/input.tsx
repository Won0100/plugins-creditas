import { CustomInput } from "components/Custom/CustomInput";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  GetWorkerByTaskAttributesFilterType,
  ServerlessApiInstance,
} from "services/serverless";
import { AsYouType } from "libphonenumber-js";

type PhoneNumberInputProps = {
  handleChange?: (value: string) => void;
};

export const PhoneNumberInput = ({ handleChange }: PhoneNumberInputProps) => {
  const serverlessApiInstance = new ServerlessApiInstance();

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (!phoneNumber) {
      handleChange!("");
      return;
    }

    const handler = setTimeout(async () => {
      const asYouType = new AsYouType("BR");
      asYouType.input(phoneNumber);

      if (phoneNumber && asYouType.isValid()) {
        const result = await serverlessApiInstance.getWorkerByTaskAttributes({
          filterType: GetWorkerByTaskAttributesFilterType.CUSTOMER_PHONE,
          filterValue: phoneNumber,
        });

        handleChange!(result?.sid || "not found");
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [phoneNumber, handleChange]);

  const onHandleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const asYouType = new AsYouType("BR");
    asYouType.input(phoneNumber);

    setPhoneNumber(event.target.value);
  };

  return (
    <CustomInput
      type="text"
      placeholder="Número (cliente)"
      value={phoneNumber}
      onChange={onHandleChange}
    />
  );
};

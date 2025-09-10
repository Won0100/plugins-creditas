import { JSXElementConstructor, ReactElement } from "react";

export const PhoneNumberLabel = (): ReactElement<
  any,
  string | JSXElementConstructor<any>
> => {
  return <span>Digite o número do cliente</span>;
};

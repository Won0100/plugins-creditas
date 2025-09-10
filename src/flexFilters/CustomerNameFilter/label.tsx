import { JSXElementConstructor, ReactElement } from "react";

export const CustomerNameLabel = (): ReactElement<
  any,
  string | JSXElementConstructor<any>
> => {
  return <span>Digite o nome do cliente</span>;
};

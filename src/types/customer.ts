export interface CustomerInactivityMap {
  timer: number;
}

export type CustomerInactivityMapWithKey = CustomerInactivityMap & {
  key: string;
};

export type ReadCustomerInactivityMapReturn = {
  mapKey: string;
  timer: number;
};

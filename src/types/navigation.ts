import { Customer } from './database';
import { Bill } from './database';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  BillingScreen: undefined;
  CustomerHistory: { customer: Customer };
  BillHistory: { 
    startDate: string;
    endDate: string;
  };
  EditBill: { bill: Bill };
};

export type RootTabParamList = {
  Billing: undefined;
  Customers: undefined;
  Analytics: undefined;
  ShopDetails: undefined;
  Bin: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 
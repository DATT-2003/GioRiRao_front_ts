export interface IOrder {
  _id: string;
  code: string;
  storeId: string;
  createdBy: string;
  status: "PENDING" | "COMPLETED";
  paymentMethod: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

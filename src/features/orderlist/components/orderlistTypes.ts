export interface IOrderItem {
  drinkId: string;
  drinkName: string;
  quantity: number;
  note?: string;
  size: string;
  toppings: {
    toppingId: string;
    name: string;
    quantity: number;
  }[];
}

export interface IOrder {
  _id: string;
  code: string;
  createdBy: string;
  storeId: string;
  items: IOrderItem[]; // ✅ chính là dòng bị thiếu
  status: "PENDING" | "COMPLETED";
  paymentMethod: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

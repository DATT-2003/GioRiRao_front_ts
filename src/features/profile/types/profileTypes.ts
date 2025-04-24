export interface IProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: "admin" | "storeManager" | "staffBarista" | "staffCashier" | "staffWaiter";
  createdAt: string;
  updatedAt: string;
}

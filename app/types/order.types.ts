// types/order.types.ts
export type Order = {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  totalFee: number;
  createdAt: string;
  products: {
    id: string;
    name: string;
    imageUrl: string;
    quantity: number;
    price: number;
  }[];
};

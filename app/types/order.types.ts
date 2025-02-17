export type OrderItem = {
  pokemon_id: string;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  user_id: number;
  email: string;
  total: number;
  status: "paid" | "pending" | "canceled";
  created_at: string;
  items: OrderItem[]; // ✅ Ajout de la liste des cartes achetées
};

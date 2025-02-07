"use client";

import { useEffect, useState } from "react";
import { Order } from "@/app/types/order.types"; // Import du type Order
import { useRouter } from "next/navigation"; // Import du router

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Liste des commandes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders"); // Récupération des commandes
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des commandes.");
        }
        const data = await response.json();
        setOrders(data.orders);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Chargement des commandes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <button onClick={() => router.push("/admin/dashboard")}>
        Retour au dashboard
      </button>
      <h1>Liste des commandes - Total ({orders.length})</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Montant total</th>
              <th>Date commande</th>
              <th>Produits commandés</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.customer.firstName} {order.customer.lastName}
                </td>
                <td>{order.customer.email}</td>
                <td>{order.customer.phone}</td>
                <td>
                  {order.customer.address.street}, {order.customer.address.city}
                  , {order.customer.address.postalCode},{" "}
                  {order.customer.address.country}
                </td>
                <td>{order.totalFee} €</td>
                <td>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>
                  <ul>
                    {order.products.map((product) => (
                      <li key={product.id}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          width="50"
                        />
                        {product.name} x{product.quantity} - {product.price} €
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;

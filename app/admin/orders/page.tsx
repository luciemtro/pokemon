"use client";

import { useEffect, useState } from "react";
import { Order } from "@/app/types/order.types"; // Importer le type Order
import { useRouter } from "next/navigation"; // Importer useRouter pour la navigation

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Spécifier que `orders` est un tableau de `Order`
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Utiliser string | null pour l'erreur
  const router = useRouter(); // Initialiser useRouter

  useEffect(() => {
    // Récupérer les commandes via l'API
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders");
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
    <div className="mt-28">
      <button
        className="golden-button mb-4 ml-11"
        onClick={() => router.push("/admin/dashboard")} // Redirige vers le dashboard
      >
        Retour au dashboard
      </button>
      <h1 className="pl-11 pb-5 golden-text">
        Liste des commandes - Total ({orders.length})
      </h1>
      <div className=" order-table ml-11 mr-11">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Tél</th>
              <th>Adresse</th>
              <th>Nbr personne</th>
              <th>Type de service</th>
              <th>Budget</th>
              <th>Commentaire</th>
              <th>Date de l'événement</th>
              <th>Heure de l'événement</th>
              <th>Artistes sélectionnés</th>
              <th>Montant total</th>
              <th>Date commande</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.first_name} {order.last_name}
                </td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td className="min-w-[200px]">
                  {order.event_address}, {order.event_city},{" "}
                  {order.event_postal_code}, {order.event_country}
                </td>
                <td>{order.number_of_people}</td>
                <td>{order.service_type}</td>
                <td>{order.budget} €</td>
                <td>{order.comment}</td>
                <td>
                  {new Date(order.event_date).toLocaleDateString("fr-FR")}
                </td>

                <td>{order.event_hour}</td>
                <td>{order.artists}</td>
                <td>{order.total_fee} €</td>
                <td>
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
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

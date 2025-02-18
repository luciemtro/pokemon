"use client";
import { useEffect, useState } from "react";
import { Order } from "@/types/order.types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.error || "Erreur de récupération des commandes.");
        }
      } catch (error) {
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="p-10 pt-28 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold amethyst-text">
        📦 <span>Toutes les Commandes</span>
        <span className="title-underline"></span>
      </h1>
      <div className=" w-full py-20 flex justify-center items-center">
        {orders.length === 0 ? (
          <p className="text-gray-400 mt-4">Aucune commande trouvée.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="background-card-violet p-6 rounded-lg shadow-xl shadow-gray-500"
              >
                <h2 className="text-xl font-bold">Commande #{order.id}</h2>
                <p className="text-gray-300">Utilisateur : {order.email}</p>
                <p className="text-gray-300">Total : {order.total}€</p>
                <p
                  className={`text-${
                    order.status === "paid" ? "green" : "red"
                  }-400`}
                >
                  Statut : {order.status}
                </p>
                <p className="text-gray-500 text-sm">
                  Date : {new Date(order.created_at).toLocaleDateString()}
                </p>

                {/* 🃏 Liste des cartes achetées */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Cartes achetées :
                  </h3>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {order.items.map((item) => (
                      <li
                        key={item.pokemon_id}
                        className="bg-gray-700 p-3 rounded-lg text-center"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 mx-auto rounded-md"
                        />
                        <p className="text-white text-sm mt-1">{item.name}</p>
                        <p className="text-green-400 font-semibold">
                          {item.price}€
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

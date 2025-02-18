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
    <section className=" pt-24 min-h-screen text-white">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-extrabold amethyst-text uppercase">
        📦 <span>Toutes les Commandes</span>
        <span className="title-underline"></span>
      </h1>
      {orders.length === 0 ? (
        <p className="text-gray-400 mt-4">Aucune commande trouvée.</p>
      ) : (
        <ul className=" space-y-4 flex flex-col w-full hadow-xl shadow-gray-500 rounded-lg items-center mt-6">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-xl shadow-gray-500 w-[90%]"
            >
              <h2 className="text-xl font-bold text-blue-950">
                Commande #{order.id}
              </h2>
              <p className="text-blue-950">Utilisateur : {order.email}</p>
              <p className="text-blue-950">Total : {order.total}€</p>
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
                <h3 className="text-lg font-semibold text-blue-950">
                  Cartes achetées :
                </h3>
                <ul className="flex flex-wrap gap-4 mt-2 justify-center">
                  {order.items.map((item) => (
                    <li
                      key={item.pokemon_id}
                      className="background-card-violet py-5 rounded-lg  min-w-[300px] flex justify-around items-center"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-40 h-60  rounded-md"
                      />
                      <div>
                        <p className="text-white text-sm mt-1">{item.name}</p>
                        <p className="text-green-400 font-semibold">
                          {item.price}€
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

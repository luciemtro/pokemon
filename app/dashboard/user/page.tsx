"use client";
import { useEffect, useState } from "react";
import { Order } from "@/types/order.types";

export default function UserDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      const data = await res.json();

      console.log("📦 Données reçues :", data); // 🔍 Vérifier la structure

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("❌ Les commandes ne sont pas un tableau :", data);
      }
    }

    fetchOrders();
  }, []);

  return (
    <section className="p-10 pt-28 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-extrabold text-blue-400">
        📜 Mes Commandes
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 mt-4">Aucune commande trouvée.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-white">
                Commande #{order.id}
              </h2>
              <p className="text-gray-300">
                Total :{" "}
                <span className="font-bold text-green-400">{order.total}€</span>
              </p>
              <p
                className={`text-${
                  order.status === "paid" ? "green" : "red"
                }-400 font-semibold`}
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
    </section>
  );
}

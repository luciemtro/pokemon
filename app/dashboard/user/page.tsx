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
    <section className=" pt-24 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-extrabold amethyst-text uppercase">
        📜 Mes Commandes
        <span className="title-underline"></span>
      </h1>
      <div className=" w-full py-10 flex justify-center items-center">
        {orders.length === 0 ? (
          <p className="text-gray-400 mt-4">Aucune commande trouvée.</p>
        ) : (
          <ul className=" space-y-4 flex flex-col w-[90%] shadow-xl shadow-gray-500 rounded-lg">
            {orders.map((order) => (
              <li key={order.id} className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold  text-indigo-900">
                  Commande #{order.id}
                </h2>
                <p className="text-gray-800">
                  Total :{" "}
                  <span className="font-bold text-green-400">
                    {order.total}€
                  </span>
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cartes achetées :
                  </h3>
                  <ul className="flex flex-wrap gap-4 mt-2">
                    {order.items.map((item) => (
                      <li
                        key={item.pokemon_id}
                        className="background-card-violet p-5 rounded-lg  min-w-[320px] flex justify-around items-center"
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
      </div>
    </section>
  );
}

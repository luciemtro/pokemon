"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/app/types/order.types";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session) {
        const res = await fetch("/api/orders_user");
        const data = await res.json();
        setOrders(data.orders || []);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (status === "loading" || loading) {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return <p>Vous devez être connecté pour voir vos commandes.</p>;
  }

  return (
    <div className="container_order_user">
      {orders.length === 0 ? (
        <p className="">Vous n'avez aucune commande pour le moment.</p>
      ) : (
        <section className="">
          <h1 className="">Bienvenue, {session.user.email}</h1>
          <h2 className="">Vos commandes</h2>
          {orders.map((order) => (
            <div key={order.id} className="">
              <div className="">
                <h3 className="">
                  Commande #{order.id} - Créée le{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </h3>
              </div>

              <div className="">
                <div>
                  <p className="">Client:</p>
                  <p>
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                </div>

                <div>
                  <p className="">Email:</p>
                  <p>{order.customer.email}</p>
                </div>

                <div>
                  <p className="">Téléphone:</p>
                  <p>{order.customer.phone}</p>
                </div>

                <div>
                  <p className="">Adresse:</p>
                  <p>
                    {order.customer.address.street},{" "}
                    {order.customer.address.city},{" "}
                    {order.customer.address.country}
                  </p>
                </div>

                <div className="">
                  <p className="">Produits commandés:</p>
                  <div className="">
                    {order.products.map((product, index) => (
                      <div key={index} className="">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className=""
                        />
                        <p className="">{product.name}</p>
                        <p className="">Quantité: {product.quantity}</p>
                        <p className="">Prix: {product.price} €</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="">
                  <p className="">Prix total (€):</p>
                  <p className="">{order.totalFee} €</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default UserDashboard;

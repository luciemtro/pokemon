"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Rediriger vers la page de login si non authentifié
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user?.role !== "admin") {
    router.push("auth/login"); // Si l'utilisateur n'est pas un admin, redirige
    return null;
  }

  return (
    <div className="pt-28 flex flex-col justify-center items-center gap-10 container_dashboard_admin">
      <h1>
        Bienvenue dans le tableau de bord administrateur, {session?.user?.email}
      </h1>
      {/* Bouton pour accéder aux commandes */}
      <button onClick={() => router.push("/admin/orders")}>
        Voir les commandes
      </button>
      {/* Bouton pour accéder aux artistes */}
      <button onClick={() => router.push("/admin/artistForm")}>
        Accéder aux artistes
      </button>
    </div>
  );
};

export default AdminDashboard;

"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Navbar = () => {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="">
      <nav className="flex gap-4">
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/catalogPokemon" className="">
              Catalogue
            </Link>
          </li>
        </ul>
        <div className="user-account">
          {status === "authenticated" && session?.user ? (
            <div>
              <p>
                Bienvenue, {session.user.email} ({session.user.role})
              </p>
              <button onClick={handleLogout}>Déconnexion</button>
            </div>
          ) : (
            <button>Connexion</button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

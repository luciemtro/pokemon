"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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
          <ul>
            {status === "authenticated" && session?.user ? (
              <li>
                <a onClick={handleLogout} className="">
                  DÉCONNEXION
                </a>
              </li>
            ) : (
              <li>
                <Link href="/auth/login">Connexion</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

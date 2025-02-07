"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "@/app/styles/navbar.module.scss"; // Import des styles SCSS
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
    <header className={styles.navbar}>
      <button className={styles.hamburger} onClick={toggleMenu}>
        <span className={isMenuOpen ? styles.hamburgerOpen : ""}></span>
        <span className={isMenuOpen ? styles.hamburgerOpen : ""}></span>
        <span className={isMenuOpen ? styles.hamburgerOpen : ""}></span>
      </button>
      <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}>
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/catalogArtist" className="">
              Catalogue
            </Link>
          </li>
          <li>
            <Link href="/reservation" className="pink-link">
              Réservation
            </Link>
          </li>
          <li>
            <Link href="mailto:contact@avenuemondaine.com">Contact</Link>
          </li>
        </ul>
        <div className="user-account">
          {status === "authenticated" && session?.user ? (
            <div className={styles.dropdown}>
              <button
                onClick={toggleDropdown}
                className={styles.dropdownToggle}
              >
                <span className="text-xs">Mon compte</span>
                <svg
                  className={`w-4 h-4 transition-transform${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ color: "black" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/user/dashboard" className="text-xs">
                    Mes commandes
                  </Link>
                  <a onClick={handleLogout} className="text-xs deconnexion">
                    DÉCONNEXION
                  </a>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">Connexion</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

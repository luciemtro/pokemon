"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestion du scroll pour changer la couleur de fond du header principal
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header
      className={`fixed top-0 w-full z-[1000] px-8 py-4 flex items-center justify-between transition-all duration-300 h-16 ${
        isScrolled ? "bg-white shadow-xl" : "bg-white shadow-md"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-blue-950 uppercase text-lg font-semibold flex items-center gap-2 absolute left-8 top-2"
      >
        <Image
          src="/images/logo-pokemon.webp"
          alt="Logo pokéball"
          width={45}
          height={45}
          priority
        />
        <span>Pokémon Store</span>
      </Link>

      {/* Navigation - Desktop */}
      <nav className="hidden md:flex flex-1 justify-center gap-8 text-lg font-semibold text-blue-950 uppercase">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          Accueil
        </Link>
        <Link
          href="/catalogPokemon"
          className="hover:opacity-80 transition-opacity"
        >
          Carte Pokémon
        </Link>
      </nav>

      {/* Desktop : User + Panier */}
      <div className="hidden md:flex items-center gap-6">
        {status === "authenticated" && session?.user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-sm font-semibold text-blue-950 hover:opacity-80 transition-opacity"
            >
              <AiOutlineUser className="text-2xl" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-blue-950 rounded-lg shadow-lg py-2 flex flex-col gap-2">
                <Link href="/user/dashboard" className="px-4 py-2">
                  Mes commandes
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 flex items-center gap-2 text-red-500 hover:opacity-80 transition-opacity"
                >
                  <RiLogoutBoxRLine className="text-2xl" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="hover:opacity-80 transition-opacity"
          >
            Connexion
          </Link>
        )}

        {/* Icône du Panier */}
        <Link
          href="/card"
          className="hover:opacity-80 transition-opacity text-2xl"
        >
          <BsCart3 />
        </Link>
      </div>

      {/* Menu Burger - MOBILE */}
      <button
        className={`md:hidden flex flex-col justify-center items-center gap-1 z-[1001] w-8 h-8 absolute right-4 top-4 ${
          isMenuOpen ? "hidden" : "flex"
        }`}
        onClick={() => setIsMenuOpen(true)}
      >
        <span className="block w-6 h-[3px] bg-blue-950 rounded-sm transition-transform duration-300"></span>
        <span className="block w-6 h-[3px] bg-blue-950 rounded-sm transition-opacity duration-300"></span>
        <span className="block w-6 h-[3px] bg-blue-950 rounded-sm transition-transform duration-300"></span>
      </button>

      {/* Menu Mobile (Burger) avec animation d'ouverture et de fermeture */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ x: "100%" }} // Commence hors écran
            animate={{ x: 0 }} // Glisse à l'ouverture
            exit={{ x: "100%" }} // Glisse à la fermeture
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="md:hidden fixed top-0 right-0 w-full h-full bg-white flex flex-col items-center justify-center gap-6 text-blue-950 text-lg font-semibold uppercase shadow-lg z-[999]"
          >
            {/* Bouton de fermeture ✖ */}
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              ✖
            </button>

            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Accueil
            </Link>
            <Link href="/catalogPokemon" onClick={() => setIsMenuOpen(false)}>
              Carte Pokémon
            </Link>

            {/* Utilisateur en Mobile */}
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href="/user/dashboard"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes commandes
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-500 hover:opacity-80 transition-opacity"
                >
                  <RiLogoutBoxRLine className="text-2xl" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hover:opacity-80 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

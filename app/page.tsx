import Carousel from "@/components/Carousel";
import Link from "next/link";

const images = [
  "/images/pokemon/pikachu.webp",
  "/images/pokemon/bulbizare.webp",
  "/images/pokemon/dresseur.webp",
  "/images/pokemon/evoli.webp",
  "/images/pokemon/gardevoir.webp",
  "/images/pokemon/lucario.webp",
  "/images/pokemon/mewtwo.webp",
  "/images/pokemon/ronflex.webp",
  "/images/pokemon/amphinobi.webp",
  "/images/pokemon/spectrum.webp",
];

export default function Home() {
  return (
    <main>
      <header className="pt-20 pb-4 text-center px-6">
        <h1 className="title-main">
          Bienvenue sur Pokémon Store !<span className="title-underline"></span>
        </h1>
        <p className="mt-2 text-lg text-gray-700 max-w-4xl mx-auto">
          Explore un univers rempli de cartes Pokémon. Découvre les créatures
          légendaires et constitue ta collection !
        </p>
      </header>

      <section className="relative w-full h-full flex items-center justify-center bg-[url('/images/pokeball.webp')] bg-cover bg-center">
        {/* Gradient en cercle */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

        {/* Carousel */}
        <Carousel images={images} />

        {/* Bouton centré sur le carousel */}

        <Link
          href="/catalogPokemon"
          className="absolute left-1/2 bottom-20 transform -translate-x-1/2 "
        >
          <button className="btn-slanted-violet">Explorer les Cartes</button>
        </Link>
      </section>
    </main>
  );
}

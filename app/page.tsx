import Carousel from "@/components/Carousel";

const images = [
  "/images/pokemon/bulbizare.webp",
  "/images/pokemon/carapuce.webp",
  "/images/pokemon/dresseur.webp",
  "/images/pokemon/evoli.webp",
  "/images/pokemon/gardevoir.webp",
  "/images/pokemon/lucario.webp",
  "/images/pokemon/mewtwo.webp",
  "/images/pokemon/pikachu.webp",
  "/images/pokemon/ronflex.webp",
  "/images/pokemon/amphinobi.webp",
  "/images/pokemon/spectrum.webp",
];

export default function Home() {
  return (
    <main>
      <header className="pt-16 text-center px-6"></header>

      <section className="relative w-full h-full flex items-center justify-center bg-[url('/images/pokeball.webp')] bg-cover bg-center">
        {/* Gradient en cercle */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

        <Carousel images={images} />
      </section>
    </main>
  );
}

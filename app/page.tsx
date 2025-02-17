import Image from "next/image";

export default function Home() {
  return (
    <main>
      <article className="">
        <header></header>
        <section className="flex justify-between items-center">
          <picture>
            <Image
              src="/images/pokemon-banner.jpg"
              alt="Cartes Pokémon"
              width={300}
              height={300}
              priority
            />
          </picture>
          <div className="text-center">
            <h1>Bienvenue sur notre Pokémon Store</h1>
            <p>
              Vous trouverez ici un large choix de cartes Pokémon, de la
              première génération à la dernière.
            </p>
            <button className="btn-slanted-yellow">
              Découvrez nos cartes Pokémon
            </button>
          </div>
          <picture>
            <Image
              src="/images/pokemon-collection.jpg"
              alt="Collection de cartes"
              width={300}
              height={300}
            />
          </picture>
        </section>
      </article>
    </main>
  );
}

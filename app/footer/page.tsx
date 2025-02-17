import { FaLinkedin, FaGithub } from "react-icons/fa"; // Import des icônes

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-semibold">Pokémon Store - Projet Fictif</h2>
        <p className="mt-2 text-gray-300">
          Ce site est une <span className="font-semibold">simulation</span>{" "}
          d'une boutique en ligne de cartes Pokémon. Aucune carte n'est
          réellement en vente et les paiements sont inactifs.
        </p>
        <p className="mt-2 text-gray-400">
          Projet développé avec{" "}
          <span className="text-blue-400 font-medium">Next.js</span>,
          <span className="text-blue-400 font-medium"> Tailwind CSS</span>,{" "}
          <span className="text-blue-400 font-medium">Stripe</span> et
          <span className="text-blue-400 font-medium"> l’API Pokémon TCG</span>.
        </p>

        <p className="mt-4 text-gray-500 text-sm">
          Pokémon et tous les éléments associés sont des marques déposées de
          Nintendo, Game Freak et The Pokémon Company. Ce projet n'est affilié à
          aucune de ces entreprises.
        </p>

        {/* Liens vers les réseaux sociaux */}
        <div className="mt-6 flex justify-center gap-6">
          {/* Lien LinkedIn */}
          <a
            href="https://www.linkedin.com/in/lucie-monteiro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition duration-300 text-2xl"
          >
            <FaLinkedin />
          </a>

          {/* Lien GitHub */}
          <a
            href="https://github.com/luciemtro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200 transition duration-300 text-2xl"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

export default function LoadingSpinner() {
  return (
    <section className="flex justify-center flex-col items-center h-screen bg-gray-100">
      <div
        className="relative flex justify-center items-center w-72 h-72"
        style={{
          backgroundImage: "url('/images/pokeball-loading.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute w-28 h-28 rounded-full border-4 border-transparent animate-spin"
          style={{
            background: "conic-gradient(from 0deg, #19003a, #6200ff)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 51%)",
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 51%)",
            border: "4px solid #6200ff",
          }}
        ></div>
      </div>
      <span className="font-extrabold uppercase pt-10 text-xl text-blue-950">
        Chargement en cours...
      </span>
    </section>
  );
}

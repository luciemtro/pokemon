const ErrorPage = () => {
  return (
    <section
      id="error-authentification"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="p-5 text-center uppercase">
        <p className="text-5xl">OUPS !</p>
        <h1>Erreur d'authentification</h1>
        <p>Veuillez réessayer ou contacter l'administrateur.</p>
      </div>
    </section>
  );
};

export default ErrorPage;
